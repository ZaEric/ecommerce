/**
 * Eric Wan
 * CSE 154 AB
 * FP
 * This is the account js page. Handles user login and account creation process.
 */
"use strict";
(function() {

  const REDIRECT_WAIT = 2000;

  window.addEventListener("load", init);

  /**
   * Sets up event listener depending on whether the html page is login of account creation.
   */
  function init() {
    let form = qs("form[name='account']");
    if (id("login-btn")) {
      form.addEventListener("submit", handleLogin);
    }
    if (id("create-btn")) {
      form.addEventListener("submit", handleRegister);
    }
  }

  /**
   * Handles any login attempts from the user by checking the user inputs with the database.
   * Logs user in and redirects to main page is successful, otherwise notify user of the error.
   * @param {object} ele - the form element this event listener is attached to
   */
  function handleLogin(ele) {
    ele.preventDefault();
    let uname = qs("input[name='uname']").value;
    let pwrd = qs("input[name='pwrd']").value;
    let data = new FormData();
    data.append("uname", uname);
    data.append("pwrd", pwrd);
    fetch("/account/login", {method: "POST", body: data})
      .then(statusCheck)
      .then(res => res.text())
      .then((res) => {
        displayMessage(res, false);
        handleSuccess();
      })
      .catch(err => displayMessage(err.message));
  }

  /**
   * Takes input from user to create account. Redirects user to main page is successful, otherwise
   * notifies user of the error.
   * @param {object} ele - form element of the event listener
   */
  function handleRegister(ele) {
    ele.preventDefault();
    let email = qs("input[name='email']").value;
    let uname = qs("input[name='uname']").value;
    let pwrd = qs("input[name='pwrd']").value;
    let cpwrd = qs("input[name='cpwrd']").value;
    if (pwrd != cpwrd) {
      displayMessage("Passwords are not the same.");
    } else {
      let data = new FormData();
      data.append("email", email);
      data.append("uname", uname);
      data.append("pwrd", pwrd);
      fetch("/account/create", {method: "POST", body: data})
        .then(statusCheck)
        .then(res => res.text())
        .then((res) => {
          displayMessage(res, false);
          handleSuccess();
        })
        .catch(err => displayMessage(err.message));
    }
  }

  /**
   * Notifies user by displaying a message of any errors made during login / register process or a
   * success message if login / register process is successful.
   * @param {string} msg - error msg to be displayed to user
   * @param {boolean} [error=true] - true if error, false if its a success message instead
   */
  function displayMessage(msg, error=true) {
    if (!error) {
      id("display-msg").classList.remove("error-msg");
      id("display-msg").classList.add("success-msg");
    }
    id("display-msg").classList.remove("hidden");
    qs("#display-msg p").textContent = msg;
  }

  /**
   * Basically freezes the page by disabling inputs and links, then redirect back to home page
   * after a momentary pause.
   */
  function handleSuccess() {
    document.body.classList.add("loading-cursor");
    qs("fieldset").disabled = true;
    qs("a").classList.add("link-disable");
    setTimeout(() => {
      window.location.replace("index.html");
    }, REDIRECT_WAIT);
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

})();