/**
 * Eric Wan
 * CSE 154 AB
 * FP
 * This is the search js file that handles ZaShop behavior for search page. Filters search results
 * based on product categories, switch display between compact and cozy.
 */
"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Get all products on load and set up event listeners for the search bar and all buttons.
   */
  function init() {
    handleSearch("");
    let radios = qsa("input[name='product-display']");
    radios.forEach((radio) => {
      radio.addEventListener("change", toggleProductDisplay);
    });
    id("filter-select").addEventListener("change", filterProducts);
    id("search-bar").addEventListener("submit", searchProducts);
    id("back-btn").addEventListener("click", toggleDisplay);
    id("add-cart-btn").addEventListener("click", addCart);
  }

  /**
   * Switches the display view between the general list of products and a detailed display of a
   * specific product.
   */
  function toggleProductDisplay() {
    id("search-result").classList.toggle("cozy");
    id("search-result").classList.toggle("compact");
  }

  /**
   * Handles the built in filter options. Filter products by category and get those products
   * by querying the database.
   */
  function filterProducts() {
    let filter = this.value;
    if (filter === "none") {
      handleSearch("");
    } else {
      handleSearch("?category=" + filter.toLowerCase());
    }
  }

  /**
   * Takes the query input on the search bar and searches all products with a similar name or
   * description to the query.
   * @param {object} ele - the search bar form element, used to disable page refresh on submit
   */
  function searchProducts(ele) {
    ele.preventDefault();
    let query = id("search-query").value.trim();
    query = query.length === 0 ? query : "?query=" + query;
    handleSearch(query);
  }

  /**
   * Sends a search request to database for products matching the search. Search by category, names
   * or description, or retrieve all products in the database. Displays the products to the user.
   * @param {string} param - additional search parameters (if any)
   */
  function handleSearch(param) {
    id("error-msg").classList.add("hidden");
    fetch("/product/search" + param)
      .then(statusCheck)
      .then(res => res.json())
      .then((res) => {
        let display = id("search-result");
        display.innerHTML = "";
        res['products'].forEach((prod) => {
          let product = makeProduct(prod);
          product.addEventListener("click", getProductDetails);
          id("search-result").appendChild(product);
        });
        id("search-query").value = "";
      })
      .catch((err) => {
        id("search-result").innerHTML = "";
        displayError(err);
      });
  }

  /**
   * Takes data about a product and converts it into an HTML element to display to the user.
   * @param {object} product - data about a product in JS object form
   * @returns {object} - product in HTML element form
   */
  function makeProduct(product) {
    let container = gen("div");
    container.classList.add("product");
    container.id = product.id;
    let img = gen("img");
    img.src = "img/" + product.image;
    img.alt = product.name + " image";
    container.appendChild(img);
    container.appendChild(makeProductText(product));
    return container;
  }

  /**
   * Formats the product data's text.
   * @param {object} product - data about a product
   * @returns {object} - the text component of the product to be displayed
   */
  function makeProductText(product) {
    let text = gen("div");
    text.classList.add("product-text");
    let name = gen("p");
    name.classList.add("product-name");
    name.textContent = product.name;
    let price = gen("p");
    price.classList.add("product-price");
    price.textContent = "$" + product.price;
    text.appendChild(name);
    text.appendChild(price);
    return text;
  }

  /**
   * Retrieves more detail about a specific product based on the product id. Displays the product to
   * the user and switches view.
   */
  function getProductDetails() {
    fetch("/product/get/" + this.id)
      .then(statusCheck)
      .then(res => res.json())
      .then((res) => {
        qs(".product-detail").id = this.id;
        qs("#product-image img").src = "img/" + res.image;
        qs("#product-image img").alt = "Image of " + res.name;
        id("product-detail-name").textContent = res.name;
        id("product-description").textContent = res.description;
        qs("#product-detail-bottom p").textContent = "$" + res.price;
        toggleDisplay();
      })
      .catch(displayError);
  }

  /**
   * Add a product to the user's cart based on the product id. Returns a cart cookie containing a
   * string epresenting the JSON notation of a JS object array.
   */
  function addCart() {
    fetch("/cart/add/" + qs(".product-detail").id)
      .then(statusCheck)
      .then(res => res.text())
      .then((res) => {
        id("cart-msg").classList.remove("hidden");
        id("cart-msg").textContent = res;
      })
      .catch(displayError);
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
   * Toggles search display between products list and detailed product display.
   */
  function toggleDisplay() {
    id("error-msg").classList.add("hidden");
    id("cart-msg").classList.add("hidden");
    id("search-area").classList.toggle("hidden");
    id("product-display").classList.toggle("hidden");
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
   * Returns all elements matching selector.
   * @param {string} selector - CSS query selector
   * @returns {object[]} - array of DOM object associated selector.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
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