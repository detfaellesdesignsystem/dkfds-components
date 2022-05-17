'use strict';
const forEach = require('array-foreach');
const select = require('../utils/select');

const NAV = `.nav`;
const NAV_LINKS = `${NAV} a`;
const OPENERS = `.js-menu-open`;
const CLOSE_BUTTON = `.js-menu-close`;
const OVERLAY = `.overlay`;
const CLOSERS = `${CLOSE_BUTTON}, .overlay`;
const TOGGLES = [ NAV, OVERLAY ].join(', ');

const ACTIVE_CLASS = 'mobile_nav-active';
const VISIBLE_CLASS = 'is-visible';

/**
 * Add mobile menu functionality
 */
class Navigation {
  /**
   * Set events
   */
  init () {
    window.addEventListener('resize', mobileMenu, false);
    mobileMenu();
  }

  /**
   * Remove events
   */
  teardown () {
    window.removeEventListener('resize', mobileMenu, false);
  }
}

/**
 * Add functionality to mobile menu
 */
const mobileMenu = function() {
  let mobile = false;
  let openers = document.querySelectorAll(OPENERS);
  for(let o = 0; o < openers.length; o++) {
    if(window.getComputedStyle(openers[o], null).display !== 'none') {
      openers[o].addEventListener('click', toggleNav);
      mobile = true;
    }
  }

  // if mobile
  if(mobile){
    let closers = document.querySelectorAll(CLOSERS);
    for(let c = 0; c < closers.length; c++) {
      closers[ c ].addEventListener('click', toggleNav);
    }

    let navLinks = document.querySelectorAll(NAV_LINKS);
    for(let n = 0; n < navLinks.length; n++) {
      navLinks[ n ].addEventListener('click', function(){
        // A navigation link has been clicked! We want to collapse any
        // hierarchical navigation UI it's a part of, so that the user
        // can focus on whatever they've just selected.

        // Some navigation links are inside dropdowns; when they're
        // clicked, we want to collapse those dropdowns.


        // If the mobile navigation menu is active, we want to hide it.
        if (isActive()) {
          toggleNav.call(this, false);
        }
      });
    }

    const trapContainers = document.querySelectorAll(NAV);
    for(let i = 0; i < trapContainers.length; i++){
      focusTrap = _focusTrap(trapContainers[i]);
    }

  }

  const closer = document.body.querySelector(CLOSE_BUTTON);

  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // The mobile nav is active, but the close box isn't visible, which
    // means the user's viewport has been resized so that it is no longer
    // in mobile mode. Let's make the page state consistent by
    // deactivating the mobile nav.
    toggleNav.call(closer, false);
  }
};

/**
 * Check if mobile menu is active
 * @returns true if mobile menu is active and false if not active
 */
const isActive = () => document.body.classList.contains(ACTIVE_CLASS);

/**
 * Trap focus in mobile menu if active
 * @param {HTMLElement} trapContainer 
 */
const _focusTrap = (trapContainer) => {

  // Find all focusable children
  const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  let focusableElements = trapContainer.querySelectorAll(focusableElementsString);
  let firstTabStop = focusableElements[ 0 ];

  function trapTabKey (e) {
    var key = event.which || event.keyCode;
    // Check for TAB key press
    if (key === 9) {

      let lastTabStop = null;
      for(let i = 0; i < focusableElements.length; i++){
        let number = focusableElements.length - 1;
        let element = focusableElements[ number - i ];
        if (element.offsetWidth > 0 && element.offsetHeight > 0) {
          lastTabStop = element;
          break;
        }
      }

      // SHIFT + TAB
      if (e.shiftKey) {
        if (document.activeElement === firstTabStop) {
          e.preventDefault();
          lastTabStop.focus();
        }

      // TAB
      } else {
        if (document.activeElement === lastTabStop) {
          e.preventDefault();
          firstTabStop.focus();
        }
      }
    }

    // ESCAPE
    if (e.key === 'Escape') {
      toggleNav.call(this, false);
    }
  }

  return {
    enable () {
        // Focus first child
        firstTabStop.focus();
      // Listen for and trap the keyboard
      document.addEventListener('keydown', trapTabKey);
    },

    release () {
      document.removeEventListener('keydown', trapTabKey);
    },
  };
};

let focusTrap;

const toggleNav = function (active) {
  const body = document.body;
  if (typeof active !== 'boolean') {
    active = !isActive();
  }
  body.classList.toggle(ACTIVE_CLASS, active);

  forEach(select(TOGGLES), el => {
    el.classList.toggle(VISIBLE_CLASS, active);
  });
  if (active) {
    focusTrap.enable();
  } else {
    focusTrap.release();
  }

  const closeButton = body.querySelector(CLOSE_BUTTON);
  const menuButton = body.querySelector(OPENERS);

  if (active && closeButton) {
    // The mobile nav was just activated, so focus on the close button,
    // which is just before all the nav elements in the tab order.
    closeButton.focus();
  } else if (!active && document.activeElement === closeButton &&
             menuButton) {
    // The mobile nav was just deactivated, and focus was on the close
    // button, which is no longer visible. We don't want the focus to
    // disappear into the void, so focus on the menu button if it's
    // visible (this may have been what the user was just focused on,
    // if they triggered the mobile nav by mistake).
    menuButton.focus();
  }

  return active;
};

export default Navigation;