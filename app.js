/**
 * Eric Wan
 * CSE 154 AB
 * FP 4
 * Serverside implementation of ZaShop. Handles user account creation / login, product searches,
 * adding product to cart and making orders.
 */
"use strict";

const express = require('express');
const app = express();

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const cookieParser = require('cookie-parser');

const INVALID_PARAM_ERROR = 400;
const SERVER_ERROR = 500;
const DEFAULT_PORT = 8000;
const PERSIST_AGE = 200000000;
const SERVER_ERROR_MSG = 'An error occured on the server. Try again later.';
const MISSING_PARAM_MSG = 'Missing one or more of the required parameters.';
const NO_SESSION_MSG = 'Please login first before trying this!';
const INVALID_SESSION_MSG = "Login session is invalid, user doesn't exist!";

// other required modules ...
const multer = require("multer"); // import multer into your project

// For data sent as form-urlencoded
app.use(express.urlencoded({extended: true}));

// For data sent as json
app.use(express.json());

// For data sent as a form
app.use(multer().none()); // requires the "multer" module

// use cookies
app.use(cookieParser());

// Account back-ends

/**
 * Handles account creation requests. Checks if body parameters are valid and attempts to create
 * a new account into the database. Fails if username already exists.
 */
app.post('/account/create', async function(req, res) {
  let email = req.body.email;
  let uname = req.body.uname;
  let pwrd = req.body.pwrd;
  let msg;
  if (!email || !uname || !pwrd) {
    handleRequestError(res, MISSING_PARAM_MSG);
  } else if ((msg = checkRegisterInputs(email, uname, pwrd)) !== "Success!") {
    handleRequestError(res, msg);
  } else {
    try {
      let db = await getDBConnection();
      let qry = "INSERT INTO users (email, uname, pwrd) VALUES (?, ?, ?);";
      let results = await db.run(qry, [email, uname, pwrd]);
      await db.close();
      if (results.changes === 1) {
        res.cookie('session', uname, {maxAge: PERSIST_AGE, sameSite: 'lax'});
        res.type("text").send("Successfully created account for " + uname);
      } else {
        handleServerError(res, "Something went wrong!");
      }
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        handleRequestError(res, "Username already exists!");
      } else {
        handleServerError(res);
      }
    }
  }
});

/**
 * Handles account login requests. Returns a session cookie indicating the logged in account
 * if the account info given exists in database.
 */
app.post('/account/login', async function(req, res) {
  let uname = req.body.uname;
  let pwrd = req.body.pwrd;
  if (!uname || !pwrd) {
    handleRequestError(res, MISSING_PARAM_MSG);
  } else {
    try {
      let db = await getDBConnection();
      let results = await db.get("SELECT uname FROM users WHERE uname=? AND pwrd=?", [uname, pwrd]);
      await db.close();
      if (results && results.length !== 0) {
        res.cookie('session', results.uname, {maxAge: PERSIST_AGE, sameSite: 'lax'});
        res.type('text').send("Welcome back, " + results.uname + ".");
      } else {
        handleRequestError(res, "Incorrect username or password! Please try again.");
      }
    } catch (err) {
      handleServerError(res);
    }
  }
});

/**
 * Checks if the email, username and password inputs for accound creation are valid. Returns
 * an appropriate error message if not, otherwise return a success message.
 * @param {string} email - email input value
 * @param {string} uname - username input value
 * @param {string} pwrd - password input value
 * @returns {boolean} - True if all inputs valid, false otherwise
 */
function checkRegisterInputs(email, uname, pwrd) {
  const minLength = 5;
  if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
    return "Please enter a valid email.";
  } else if (!uname.match(/^[\w]+$/)) {
    return "Username must contain only letters and numbers (underscores are allowed).";
  } else if (pwrd.length < minLength) {
    return "Password must be least 6 characters long.";
  } else if (!pwrd.match(/(?=.*\d)(?=.*[A-Z])/)) {
    return "Password must contain at least one uppercase letter and number";
  }
  return "Success!";
}

// Search back-end

/**
 * Handles search requests. Returns all products if no queries provided, otherwise match query
 * to either the name or description of products, or search products by their category.
 */
app.get('/product/search', async function(req, res) {
  try {
    let db = await getDBConnection();
    let qry = "SELECT id, name, image, price FROM products";
    let results;
    if (req.query['query']) {
      qry += " WHERE name LIKE ? OR description LIKE ?;";
      results = await db.all(qry, ["%" + req.query['query'] + "%", "%" + req.query['query'] + "%"]);
    } else if (req.query['category']) {
      qry += " WHERE category=?;";
      results = await db.all(qry, req.query['category']);
    } else {
      results = await db.all(qry);
    }
    await db.close();
    if (results.length === 0) {
      handleRequestError(res, "No products matching query. Please try a different input.");
    } else {
      res.json({"products": results});
    }
  } catch (err) {
    handleServerError(res);
  }
});

/**
 * Handles get requests for a specific product based on its id. Returns the name, image, price and
 * description of a product given its id.
 */
app.get('/product/get/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let db = await getDBConnection();
    let query = "SELECT name, image, price, description FROM products WHERE id=?;";
    let result = await db.get(query, id);
    await db.close();
    if (result) {
      res.json(result);
    } else {
      handleRequestError(res, "Product id does not exist in ZaShop!");
    }
  } catch (err) {
    handleServerError(res);
  }
});

// Cart back-end

/**
 * Handles requests to add a product to user's cart. Returns a cookie storing the user's cart.
 * This request only works if a user is logged in.
 */
app.get('/cart/add/:id', async function(req, res) {
  try {
    let id = req.params.id;
    let db = await getDBConnection();
    if (!(await checkLoginStatus(req.cookies, db, res))) {return;}
    let name = await db.get("SELECT name FROM products WHERE id=?;", id);
    await db.close();
    if (name) {
      let [cart, count] = formatCart(req.cookies, id);
      res.cookie('cart', cart, {maxAge: PERSIST_AGE, sameSite: 'lax'});
      let msg = "Successfully added " + name.name + " into cart (Count: " + count + ").";
      res.type('text').send(msg);
    } else {
      handleRequestError(res, "Product does not exist!");
    }
  } catch (err) {
    handleServerError(res);
  }
});

/**
 * Parses the cart cookie into a map with product ids as keys, and the count of that product in the
 * cart as values.
 * @param {object} cookies - cookies sent with request
 * @param {number} id - product id
 * @returns {[string, number]} - Returns array in form of [Stringified cart, Product count in cart]
 */
function formatCart(cookies, id) {
  let cart = cookies['cart'];
  if (cart) {
    let cartMap = JSON.parse(cart);
    if (cartMap[id]) {
      cartMap[id] = cartMap[id] + 1;
    } else {
      cartMap[id] = 1;
    }
    return [JSON.stringify(cartMap), cartMap[id]];
  }
  let cartMap = {};
  cartMap[id] = 1;
  return [JSON.stringify(cartMap), 1];
}

/**
 * Handles requests to get all products in a user's cart. Reads the user's cookie for cart info.
 */
app.get('/cart/all', async function(req, res) {
  try {
    let db = await getDBConnection();
    if (!(await checkLoginStatus(req.cookies, db, res))) {return;}
    if (req.cookies['cart']) {
      let cartMap = JSON.parse(req.cookies['cart']);
      let query = "SELECT id, name, image, price FROM products WHERE";
      let keys = Object.keys(cartMap);
      keys.forEach((item) => {
        query += (" id=" + item + " OR");
      });
      query = query.substring(0, query.length - 3) + ";";
      let results = await db.all(query);
      await db.close();
      results.forEach((product) => {
        product['count'] = cartMap[product.id];
      });
      res.json({"products": results});
    } else {
      handleRequestError(res, "Cart is empty. Please add products to cart first.");
    }
  } catch (err) {
    handleServerError(res);
  }
});

/**
 * Handles requests to make a bulk purchase for all items in the cart. Requires the user be logged
 * in and for the cart to not be empty.
 */
app.get('/cart/purchase', async function(req, res) {
  try {
    let db = await getDBConnection();
    if (!(await checkLoginStatus(req.cookies, db, res))) {
      return;
    }
    if (req.cookies['cart']) {
      let cartMap = JSON.parse(req.cookies['cart']);
      let priceCheck = await processCart(req.cookies, cartMap, db);
      if (priceCheck[0]) {
        for (const [key, value] of Object.entries(cartMap)) {
          let qry = "INSERT INTO transactionItems (p_id, count, t_id) VALUES (?, ?, ?);";
          await db.run(qry, [parseInt(key), value, priceCheck[1]]);
        }
        res.type('text').send("Successfully completed purchase. Transaction id: " + priceCheck[1]);
      } else {
        handleRequestError(res, priceCheck[1]);
      }
    } else {
      handleRequestError(res, "Cart is empty. Please add products to cart first.");
    }
  } catch (err) {
    handleServerError(res);
  }
});

/**
 * Process cart adds up the total cost of the cart by finding each product's price and multiplying
 * by the count value from cartMap. This also verifies whether all products in the cart actually
 * exist and the cookie isn't corrupted in some way. If cart is valid, create a transaction and
 * return its confirmation msg and whether transaction succeeded or not.
 * @param {object} cookies - cookies from client
 * @param {object} cartMap - parsed cart cookie data in the form of a map
 * @param {object} db - database where products table is stored
 * @return {[boolean, number]} - [whether purchase succeeded, trans-id or error msg]
 */
async function processCart(cookies, cartMap, db) {
  let total = 0;
  for (const [key, value] of Object.entries(cartMap)) {
    let price = await db.get("SELECT price FROM products WHERE id=?", key);
    if (price) {
      total += price.price * value;
    } else {
      return [false, "A product in the cart does not exist!"];
    }
  }
  let bal = await getBalance(cookies, db);
  if (bal < total) {
    return [false, "Not enough money for this transaction! Please add more funds."];
  }
  let id = await db.get("SELECT COUNT(*) FROM transactions WHERE uname=?", cookies['session']);
  let transId = cookies['session'] + "-" + (id["COUNT(*)"] + 1);
  let qry = "INSERT INTO transactions (t_id, uname, cost) VALUES (?, ?, ?);";
  await db.run(qry, [transId, cookies['session'], total]);
  await db.run("UPDATE users SET bal=? WHERE uname=?;", [bal - total, cookies['session']]);
  return [true, transId];
}

// Account related back-end

/**
 * Get the balance of the current user. User must be logged in for this to work.
 */
app.get('/account/balance', async function(req, res) {
  try {
    let db = await getDBConnection();
    if (!(await checkLoginStatus(req.cookies, db, res))) {return};
    let bal = await getBalance(req.cookies, db);
    await db.close();
    res.type('text').send("" + bal);
  } catch (err) {
    handleServerError(res);
  }
});

/**
 * Handles request to add additional amount into the user's current balance. User must be logged in
 * for this to work.
 */
app.post('/account/add', async function(req, res) {
  let amount = req.body.amount;
  if (amount) {
    try {
      let db = await getDBConnection();
      if (!(await checkLoginStatus(req.cookies, db, res))) {
        return;
      }
      let bal = await getBalance(req.cookies, db);
      bal = parseInt(amount) + bal;
      await db.run("UPDATE users SET bal=? WHERE uname=?", [bal, req.cookies['session']]);
      await db.close();
      res.type('text').send("Successfully added $" + bal + " to account!");
    } catch (err) {
      handleServerError(res);
    }
  } else {
    handleRequestError(res, MISSING_PARAM_MSG);
  }
});

/**
 * Handles requests to get the user's order history. User must be logged in for this to work.
 */
app.get('/account/history', async function(req, res) {
  try {
    let db = await getDBConnection();
    if (!(await checkLoginStatus(req.cookies, db, res))) {
      return;
    }
    let uname = req.cookies['session'];
    let tIds = await db.all("SELECT t_id FROM transactions WHERE uname=?", uname);
    let results = {};
    for (const tId of tIds) {
      let transaction = await formatResult(tId.t_id, db);
      results[tId.t_id] = transaction;
    }
    res.json(results);
  } catch (err) {
    handleServerError(res);
  }
});

/**
 * Gets transaction items for a specific transaction id and return it in a formatted manner
 * that makes it easy to parse.
 * @param {string} tId - transaction id
 * @param {object} db - database containing necessary tables
 * @returns {object} - detailed info (date, cost, products) of the given transaction
 */
async function formatResult(tId, db) {
  let result = await db.get("SELECT date, cost FROM transactions WHERE t_id=?", tId);
  let qry = "SELECT p.id, p.name, p.image, p.price, t.count FROM products p, transactionItems t" +
  " WHERE p.id=t.p_id AND t.t_id=?";
  let products = await db.all(qry, tId);
  result['products'] = products;
  return result;
}

// General Helper Functions

/**
 * Looks at the client cookies to check if client is logged in or not (whether the session
 * cookie exists).
 * @param {object} cookies - cookies sent along with client request
 * @param {object} db - database containing the users table
 * @param {object} res - response to send back to client
 * @returns {boolean} - True if there's a user logged in, false otherwise
 */
async function checkLoginStatus(cookies, db, res) {
  let session = cookies['session'];
  if (session) {
    let test = await db.get("SELECT * FROM users WHERE uname=?", session);
    if (test && test.length !== 0) {
      return true;
    }
    await db.close();
    handleRequestError(res, INVALID_SESSION_MSG);
    return false;
  }
  await db.close();
  handleRequestError(res, NO_SESSION_MSG);
  return false;
}

/**
 * Gets the balance of the user based on the session cookie.
 * @param {object} cookies - cookies sent along with client request
 * @param {object} db - database containing users table
 * @returns {number} - balance of the logged in user
 */
async function getBalance(cookies, db) {
  let result = await db.get("SELECT bal FROM users WHERE uname=?;", cookies['session']);
  return result.bal;
}

/**
 * Helper function in the event of a invalid request error.
 * @param {object} res - response to send back to client
 * @param {string} msg - error message to send back to client
 */
function handleRequestError(res, msg) {
  res.type('text').status(INVALID_PARAM_ERROR);
  res.send(msg);
}

/**
 * Helper function in the event an error is caught. Handles server side errors.
 * @param {object} res - response to send back to client caller
 */
function handleServerError(res) {
  res.type('text').status(SERVER_ERROR);
  res.send(SERVER_ERROR_MSG);
}

/**
 * Establishes a database connection to a database and returns the database object.
 * Any errors that occur during connection should be caught in the function
 * that calls this one.
 * @returns {Object} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'zashop.db',
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static('public'));
const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT);