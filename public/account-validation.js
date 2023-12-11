/**
 * Eric Wan
 * CSE 154 AB
 * FP
 * Checks if a user is logged in by looking at browser cookies. Handles logouts.
 */
"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Sets up event listner of logout button and checks if user is logged in on load.
   */
  function init () {
    checkLogin();
    id("logout-nav").addEventListener("click", handleLogOut);
  }

  /**
   * Checks if user is logged in by looking at the client's cookies.
   */
  async function checkLogin() {
    const session = await cookieStore.get('session');
    console.log(session);
    if (session) {
      loginToggle();
    }
  }

  /**
   * Toggle the nav bar display for logged in and logged out. Logged in users shouldn't see
   * create account and login options, while logged out users shouldn't see my account and logout.
   */
  function loginToggle() {
    id("createaccount-nav").classList.toggle("hidden");
    id("login-nav").classList.toggle("hidden");
    id("myaccount-nav").classList.toggle("hidden");
    id("logout-nav").classList.toggle("hidden");
  }

  /**
   * Logs the user out by removing the session cookie and reloading the page.
   */
  async function handleLogOut() {
    console.log("logout pressed");
    await cookieStore.delete('session');
    window.location.reload();
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

})();