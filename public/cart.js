/**
 * Eric Wan
 * CSE 154 AB
 * FP
 * This is the cart js page. Handles the retrieval of cart products and attempts to make a purchase
 * from a user on ZaShop.
 */
"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Gets the products on the user's cart and retrieves the users current balance on load. Sets up
   * event listener for the check out button.
   */
  function init() {
    getCart();
    displayBalance();
    id("checkout-btn").addEventListener("click", purchaseCart);
  }

  /**
   * Retrieves all the items currently in cart and displays it to the user.
   */
  function getCart() {
    id("products-list").innerHTML = "";
    fetch('/cart/all')
      .then(statusCheck)
      .then(res => res.json())
      .then((res) => {
        let totalCost = 0;
        res['products'].forEach((product) => {
          id("products-list").appendChild(formatProduct(product));
          totalCost += parseInt(product.price) * product.count;
        });
        id("total-cost").textContent = "Total Cost: $" + totalCost;
        if (totalCost === 0) {
          id("checkout-btn").disabled = true;
        }
      })
      .catch(displayError);
  }

  /**
   * Gets the current balanace of user.
   */
  function displayBalance() {
    fetch("/account/balance")
      .then(statusCheck)
      .then(res => res.text())
      .then(res => {id("current-bal").textContent = "Current balance: $" + res})
      .catch(displayError);
  }

  /**
   * Creates and formats product to be displayed under the My Cart view based on product data.
   * @param {object} product - product data to be processed
   * @returns {object} - html version of product to be displayed
   */
  function formatProduct(product) {
    let container = gen("div");
    container.classList.add("product");
    let img = gen("img");
    img.src = "img/" + product.image;
    img.alt = "Image of " + product.name;
    container.appendChild(img);
    container.appendChild(formatText(product));
    return container;
  }

  /**
   * Helper function that create the text content area of the product.
   * @param {object} product - product data to be processed
   * @returns {object} - text content version of a product
   */
  function formatText(product) {
    let textContainer = gen("div");
    textContainer.classList.add("product-text");
    let name = gen("p");
    name.textContent = product.name;
    textContainer.appendChild(name);
    textContainer.appendChild(formatMeta(product));
    return textContainer;
  }

  /**
   * Helper function that creates the metadata part of the text content.
   * @param {object} product - product data to be processed
   * @returns {object} - metadata in html form
   */
  function formatMeta(product) {
    let metaContainer = gen("div");
    metaContainer.classList.add("product-meta");
    let count = gen("p");
    let price = gen("p");
    count.textContent = "x " + product.count;
    price.textContent = "$" + product.price;
    metaContainer.appendChild(count);
    metaContainer.appendChild(price);
    return metaContainer;
  }

  /**
   * Sends a request to make a purchase from cart. Displays the transaction id if successful, and
   * clears cart.
   */
  function purchaseCart() {
    fetch('/cart/purchase')
      .then(statusCheck)
      .then(res => res.text())
      .then((res) => {
        id("success-msg").textContent = res;
        id("success-msg").classList.remove("hidden");
        id("checkout-btn").disabled = true;
        clearCart();
      })
      .catch(displayError);
  }

  /**
   * Clears the cart by removing the cookies.
   */
  async function clearCart() {
    await cookieStore.delete('cart');
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
   * Displays any errors returned by fetch requests to the user.
   * @param {error} err - error from fetch request
   */
  function displayError(err) {
    id("error-msg").classList.remove("hidden");
    id("error-msg").textContent = err.message;
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
   * Returns a new element with the tagname given
   * @param {string} tagName - HTML tag
   * @returns {object} - an HTML element with the given tag
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();