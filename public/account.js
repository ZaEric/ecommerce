/**
 * Eric Wan
 * CSE 154 AB
 * FP
 * This is the account js page. Handles login in the user and creating accounts.
 */
"use strict";
(function () {

  window.addEventListener("load", init);

  function init() {
    let form = qs("form[name='account']")
    if (id("login-btn")) {
      form.setAttribute("onsubmit", "return handleLogin()")
    }
    if (id("create-btn")) {
      form.setAttribute("onsubmit", "return handleRegister()")
    }

  }

  /**
   * Authenticates login process by checking with database.
   * @returns - nothing, return used to exit early
   */
  function handleLogin() {
    let uname = qs("input[name='uname']").value;
    let pwrd = qs("input[name='pwrd']").value;
    // check database to see if uname exists
    // if uname not valid
    // displayError("Username does not exist.");
    // if pwrd incorrect
    // displayError("Incorrect password.");
    alert("success!"); // placeholder fn
  }

  /**
   * Takes input from user to create account.
   * @returns - nothing, return used to exit early
   */
  function handleRegister() {
    let email = qs("input[name='email']").value;
    let uname = qs("input[name='uname']").value;
    let pwrd = qs("input[name='pwrd']").value;
    let cpwrd = qs("input[name='cpwrd']").value;
    if (pwrd != cpwrd) {
      displayError("Passwords not the same.")
    }
    // do account creation stuff
    alert("success!"); // placeholder fn
  }

  /**
   * Checks if all inputs are filled out.
   * @returns {boolean} - True if all inputs filled out, false o.w.
   */
  function checkInputs() {
    let inputs = qsa("input[type=text]");
    inputs.forEach((input) => {
      if (input.value.length === 0) {
        displayError("Missing input!");
        return false;
      }
    });
    return true;
  }

  /**
   * Notifies user of any errors made during login / account creation process.
   * @param {string} msg - error msg to be displayed to user
   */
  function displayError(msg) {
    id("error-msg").classList.remove("hidden");
    qs(".error-msg p").textContent = msg;
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

})();