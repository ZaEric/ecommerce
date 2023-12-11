# ZaShop API Documentation

## Create a new User
**Request Format:** /account/create endpoint with POST parameters of email, uname, pwrd

**Request Type:** POST

**Returned Data Format**: Plain text

**Description:** Tries to create a new account for a client given their email, username and
password.

**Example Request:** POST parameters of "email=bob@gmail.com", "uname=bob1", "pwrd=password1"

**Example Response:**

```
Successfully created account for bob1.
```

**Error Handling:**
- Possible 400 error
  - If 'uname' already exists, return error with "Username already exists!"
- Possible 500 error
  - Server issue, return error with "An error occured on the server. Try again later."

## Login to account
**Request Format:** /account/login with POST parameters uname and pwrd

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Tries to login to an existing account using the given username and password.

**Example Request:** POST parameters of "uname=bob1", "pwrd=password1"

**Example Response:**

```
Welcome back, bob1.
```

**Error Handling:**
- Possible 400 error
  - if 'uname' doesn't exist or 'pwrd' doesn't match, return error with "Incorrect username
  or password!"
- Possible 500 error
  - Server issue, return error with "An error occured on the server. Try again later."

## Retrieve detailed information about a specific product
**Request Format:** /product/get/:id

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets more detailed information about a specific product by its product id. This is
done by the user clicking on a product in the search page.

**Example Request:** /product/get/1

**Example Response:**

```json
{
  "id": "1",
  "name": "Example1",
  "image": "img/example1.jpg",
  "price": "1000",
  "description": "Example1 is pretty cool.",
  "category": "computer"
}
```

**Error Handling:**
- Possible 500 error (Plain Text)
  - Server issue, return error with "An error occured on the server. Try again later."

## Search for products matching criteria
**Request Format:** /product/search

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns an array of JSON objects of basic information about products that fit the
search criteria. Clients can search products by "name" or "description". Searchs are not case
sensitive (so lower or upper queries by client should work). There are preset filters that would
search products by "category". A request with no specified parameters return basic information on
all products.


**Example Request:** /product/search?category=computer

**Example Response:**

```json
{
  "products": [
    {
      "id": 1,
      "name": "Example1",
      "image": "img/example1.jpg",
      "price": 1000
    },
    {
      "id": 5,
      "name": "Asus ROG Zephyrus G14",
      "image": "img/rog-zephy.jpg",
      "price": 1500
    }
    ...
  ]
}
```

**Error Handling:**
- Possible 400 error (Plain text)
  - If passed a query that returns no results, returns an error with "No products matching query.
  Please try again."
- Possible 500 error (Plain text)
  - Server issue, return error with "An error occured on the server. Try again later."

## Add product to cart
**Request Format:** /cart/add/:id

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Adds a product into the user's cart. If product already exists in cart, increment
the count of that specific product. Only works if user is logged into an account.

**Example Request:** /cart/add/1

**Example Response:**

```
Successfully added Example1 into cart.
```

**Error Handling:**
- Possible 400 error (Plain text)
  - If user is not logged in, return error with "Please login first before trying this!"
  - If product id doesn't exist, return error with "Product does not exist!"
- Possible 500 error (Plain text)
  - Server issue, return error with "An error occured on the server. Try again later."

## Get cart items
**Request Format:** /cart/all

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Gets all the products in the current user's cart. Only works if the user is
logged in to their account.

**Example Request:** /cart/all

**Example Response**

```json
{
  "products": [
    {
      "id": 3,
      "name": "Hololive Elite Miko T-Shirt",
      "image": "elite-miko-shirt.jpg",
      "price": 100,
      "count": 1
    },
    ...
  ]
}
```

**Error Handling**
- Possible 400 error (Plain text)
  - If user is not logged in, return error with "Please login first before trying this!"
  - If there is no item in cart, return error with "Cart is empty. Please add products to cart first."
- Possible 500 error (Plain text)
  - Server issue, return error with "An error occured on the server. Try again later."


## Purchase products in cart
**Request Format:** /cart/purchase

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Client attempts to purchase all products that are currently saved in their cart.
Generates a transaction id on successful purchase based on username and how many times they've
made purchases on ZaShop.

**Example Request:** /cart/purchase

**Example Response:**

```
Successfully completed purchase. Transaction id: bob1-1
```

**Error Handling:**
- Possible 400 error (Plain Text)
  - If a product in the cart doesn't exist, return error with "A product in the cart does not exist!"
  - User does not have enough money to make this purchase, return error with "Not enough money for
  this transaction! Please add more funds."
- Possible 500 error (Plain text)
  - Server issue, return error with "An error occured on the server. Try again later."

## View funds on user's account
**Request Format:** /account/balance

**Request Type:** GET

**Returned Data Format** Plain Text

**Description:** Gets the current balance stored in the user's wallet.

**Example Request:** /account/balance

**Example Response:**
```
2000
```

**Error Handling:**
- Possible 400 error (Plain text)
  - If user is not logged in, return error with "Please login first before trying this!"
- Possible 500 error (Plain ext)
  - Server issue, return error with "An error occured on the server. Try again later."


## Add funds to user's account
**Request Format:** /account/add with POST parameter amount

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Adds balance onto the user's account for future purchases.

**Example Request:** POST parameter of 'amount=2000'

**Example Response:**

```
Successfully added $2000 to account!
```

**Error Handling:**
- Possible 400 error (Plain text)
  - If user is not logged in, return error with "Please login first before trying this!"
- Possible 500 error (Plain text)
  - Server issue, return error with "An error occured on the server. Try again later."


## View transaction history
**Request Format:** /account/history

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns an array of JSON objects of the user's transaction history. Returns an
empty array if no history present.

**Example Request:** /account/history

**Example Response:**

```json
{
  "bob1-1": {
    "date": "2023-11-27 01:11:10",
    "cost": "3500",
    "products": [
      {
        "id": "1",
        "name": "Example1",
        "image": "img/example1.jpg",
        "price": "1000",
        "count": "2"
      },
      {
        "id": "5",
        "name": "Asus ROG Zephyrus G14",
        "image": "img/rog-zephy.jpg",
        "price": "1500",
        "count": "1"
      }
    ]
  },
  ...
}
```

**Error Handling:**
- Possible 400 error (Plain text)
  - If user is not logged in, return error with "Please login first before trying this!"
- Possible 500 error (Plain text)
  - Server issue, return error with "An error occured on the server. Try again later."