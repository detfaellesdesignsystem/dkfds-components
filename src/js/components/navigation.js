'use strict';
const forEach = require('array-foreach');
const select = require('../utils/select');
const dropdown = require('./dropdown');

const NAV = `.nav`;
const NAV_LINKS = `${NAV} a`;
const OPENERS = `.js-menu-open`;
const CLOSE_BUTTON = `.js-menu-close`;
const OVERLAY = `.overlay`;
const CLOSERS = `${CLOSE_BUTTON}, .overlay`;
const TOGGLES = [ NAV, OVERLAY ].join(', ');

const ACTIVE_CLASS = 'mobile_nav-active';
const VISIBLE_CLASS = 'is-visible';

const isActive = () => document.body.classList.contains(ACTIVE_CLASS);

const _focusTrap = (trapContainer) => {
  // Find all focusable children
  const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  const focusableElements = trapContainer.querySelectorAll(focusableElementsString);
  const firstTabStop = focusableElements[ 0 ];
  const lastTabStop = focusableElements[ focusableElements.length - 1 ];

  function trapTabKey (e) {
    // Check for TAB key press
    if (e.keyCode === 9) {

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

  // Focus first child
  firstTabStop.focus();

  return {
    enable () {
      // Listen for and trap the keyboard
      trapContainer.addEventListener('keydown', trapTabKey);
    },

    release () {
      trapContainer.removeEventListener('keydown', trapTabKey);
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

const resize = () => {
  const closer = document.body.querySelector(CLOSE_BUTTON);

  if (isActive() && closer && closer.getBoundingClientRect().width === 0) {
    // The mobile nav is active, but the close box isn't visible, which
    // means the user's viewport has been resized so that it is no longer
    // in mobile mode. Let's make the page state consistent by
    // deactivating the mobile nav.
    toggleNav.call(closer, false);
  }
};

class Navigation {
  constructor (){
    let openers = document.querySelectorAll(OPENERS);
    for(let o = 0; o < openers.length; o++) {
      openers[ o ].addEventListener('click', toggleNav);
    }

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

    this.init();
  }

  init () {
    const trapContainers = document.querySelectorAll(NAV);
    for(let i = 0; i < trapContainers.length; i++){
        focusTrap = _focusTrap(trapContainers[i]);
    }

    resize();
    window.addEventListener('resize', resize, false);
  }

  teardown () {
    window.removeEventListener('resize', resize, false);
  }
}

module.exports = Navigation;
