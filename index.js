/**
 * Eric Wan
 * CSE 154 AB
 * FP
 * This is the index js file that handles ZaShop behavior for index page.
 */
"use strict";
(function() {

  // window.addEventListener("load", init);

  // function init() {
  //   let radios = qsa("input[name='product-display']");
  //   radios.forEach((radio) => {
  //     radio.addEventListener("change", toggleProductDisplay)
  //   });
  //   id("filter-select").addEventListener("change", filterProducts);
  //   qs(".search-btn").addEventListener("submit", searchProducts);
  //   console.log(window.location.search);
  // }

  // function toggleProductDisplay() {
  //   id("search-result").classList.toggle("cozy");
  //   id("search-result").classList.toggle("compact");
  // }

  // function filterProducts() {
  //   let filter = this.value;
  //   let products = qsa(". product");
  //   products.forEach((product) => {
  //     if (filter === "none") {
  //       product.classList.remove("hidden");
  //     }
  //     else {
  //       if (!product.classList.contains(filter)) {
  //         product.classList.add("hidden");
  //       } else {
  //         product.classList.remove("hidden");
  //       }
  //     }
  //   });
  // }

  // function searchProducts() {
  //   console.log("check");
  // }

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