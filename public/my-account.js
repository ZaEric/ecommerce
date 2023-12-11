/**
 * Eric Wan
 * CSE 154 AB
 * FP
 * This js file handles the my account section of ZaShop. Shows order history and allows user to
 * add additional funds into their account for purchases.
 */
"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Gets user transactions and balance on load and sets up event listeners.
   */
  function init() {
    loadTransactions();
    displayBalance();
    id("transaction-h1").addEventListener("click", toggleTransDisplay);
    id("addfund-btn").addEventListener("click", addFund);
  }

  /**
   * Retrieve all the user transactions with the products and product counts of each transaction,
   * alongside some basic information about the product. Displays the product under the transactions
   * tab.
   */
  function loadTransactions() {
    fetch("/account/history")
      .then(statusCheck)
      .then(res => res.json())
      .then((res) => {
        for (const key in res) {
          id("transactions-list").appendChild(formatTransaction(res[key], key));
        }
      })
      .catch(displayError);
  }

  /**
   * Creates and formats a transaction given detailed data fetched from the server.
   * @param {object} transaction - detailed data about a transaction
   * @param {string} key - transaction id
   * @returns {object} formated transaction
   */
  function formatTransaction(transaction, key) {
    let container = gen("section");
    container.classList.add("transaction");
    container.appendChild(formatMeta(transaction, key));
    let products = gen("section");
    products.classList.add("products");
    transaction.products.forEach(product => products.appendChild(formatProduct(product)));
    container.appendChild(products);
    return container;
  }

  /**
   * Creates and formats the metadata section of a transaction.
   * @param {object} transaction - detailed data about a transaction
   * @param {string} key - transaction id
   * @returns {object} - formated metadata
   */
  function formatMeta(transaction, key) {
    let container = gen("section");
    container.classList.add("metadata");
    let date = gen("p");
    let cost = gen("p");
    let id = gen("p");
    date.classList.add("date");
    cost.classList.add("cost");
    id.classList.add("trans-id");
    date.textContent = "Ordered on: " + transaction.date;
    cost.textContent = "Total: $" + transaction.cost;
    id.textContent = "Transaction id: " + key;
    container.appendChild(date);
    container.appendChild(cost);
    container.appendChild(id);
    return container;
  }

  /**
   * Creates and formats a product.
   * @param {object} product - detailed data about a product
   * @returns {object} - formatted product
   */
  function formatProduct(product) {
    let container = gen("p");
    container.classList.add("product");
    let img = gen("img");
    img.src = "img/" + product.image;
    img.alt = product.name + " image";
    container.appendChild(img);
    let text = gen("section");
    text.classList.add("product-text");
    let name = gen("p");
    name.classList.add("name");
    name.textContent = product.name;
    let count = gen("p");
    count.classList.add("count");
    count.textContent = "x " + product.count;
    text.appendChild(name);
    text.appendChild(count);
    container.appendChild(text);
    return container;
  }

  /**
   * Sends request to retrieve user balance and displays it to user on the page.
   */
  function displayBalance() {
    fetch("/account/balance")
      .then(statusCheck)
      .then(res => res.text())
      .then(res => {qs("#current-bal p").textContent = "Wallet Balance: $" + res;})
      .catch(displayError);
  }

  /**
   * Handles addfund btn click. Adds the value selected and put it onto the users account.
   */
  function addFund() {
    let amount = qs("#add-balance select").value;
    let data = new FormData();
    data.append('amount', amount);
    fetch("/account/add", {method: "POST", body: data})
      .then(statusCheck)
      .then(res => res.text())
      .then((res) => {
        const index = 17;
        id("success-msg").textContent = res;
        let oldBal = qs("#current-bal p").textContent;
        let newBal = parseInt(oldBal.substring(index)) + parseInt(amount);
        qs("#current-bal p").textContent = "Wallet Balance: $" + newBal;
      })
      .catch(displayError);
  }

  /**
   * Toggles the transaction list display.
   */
  function toggleTransDisplay() {
    id("transactions-list").classList.toggle("hidden");
  }

  /**
   * Displays any errors returned by fetch requests to the user.
   * @param {error} err - error from fetch request
   */
  function displayError(err) {
    id("error-msg").classList.remove("hidden");
    id("error-msg").textContent = err.message;
  }

  /**
   * Checks if the response from a fetch request is valid or not.
   * @param {object} response - response to be checked
   * @returns {object} - response is valid, throws error if response not ok
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns a new element with the tagname given
   * @param {string} tagName - HTML tag
   * @returns {object} - an HTML element with the given tag
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();