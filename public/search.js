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

  function init() {
    let radios = qsa("input[name='product-display']");
    radios.forEach((radio) => {
      radio.addEventListener("change", toggleProductDisplay)
    });
    id("filter-select").addEventListener("change", filterProducts);
    qs(".search-btn").addEventListener("submit", searchProducts);
    searchProducts(window.location.search);
  }

  function toggleProductDisplay() {
    id("search-result").classList.toggle("cozy");
    id("search-result").classList.toggle("compact");
  }

  function filterProducts() {
    let filter = this.value;
    let products = qsa(".product");
    products.forEach((product) => {
      if (filter === "none") {
        product.classList.remove("hidden");
      }
      else {
        if (!product.classList.contains(filter)) {
          product.classList.add("hidden");
        } else {
          product.classList.remove("hidden");
        }
      }
    });
  }

  function searchProducts(query) {
    let searchParams = new URLSearchParams(query);
    let search = searchParams.get('search');
    // get stuff from database with search
    // qs("#search-result").innerHTML = "";
    // create products, append to search-result
  }

  function makeProduct(product) {
    // parse item info from database
    let container = gen("div");
    container.classList.add("product");
    container.classList.add("none"); // product category
    let img = gen("img");
    img.src = "blah";
    img.alt = "blah";
    container.appendChild(img);
    let text = gen("div");
    text.classList.add("product-text");
    text.appendChild(gen("p").textContent="name");
    text.appendChild(gen("p").textContent="price");
    container.appendChild(text);
    return container;
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