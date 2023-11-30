'use strict';
import Dropdown from './dropdown';
const forEach = require('array-foreach');
const select = require('../utils/select').default;

//const NAV_DESKTOP = `.navigation-header`;
const MOBILE_DRAWER = `.mobile-drawer`;
const NAV_LINKS = `.navigation-menu-mobile a`;
const OPENERS = `.js-menu-open`;
const CLOSE_BUTTON = `.js-menu-close`;
const OVERLAY = `.overlay`;
const CLOSERS = `${CLOSE_BUTTON}, .overlay`;
const TOGGLES = [MOBILE_DRAWER, OVERLAY].join(', ');

const ACTIVE_CLASS = 'mobile-nav-active';
const VISIBLE_CLASS = 'is-visible';

/**
 * Add mobile menu functionality
 */
class Navigation {
    /**
     * Set events
     */
    init() {
        window.addEventListener('resize', mobileMenu, false);
        mobileMenu();

        if (document.getElementsByClassName('mainmenu').length > 0) {
            /* Add an invisible more button to the main menu navigation on desktop */
            createMoreMenu();
            /* Determine when the more button should be visible */
            window.addEventListener('resize', moreMenu, false);
            moreMenu();
        }
    }

    /**
     * Remove events
     */
    teardown() {
        window.removeEventListener('resize', mobileMenu, false);

        if (document.getElementsByClassName('mainmenu').length > 0) {
            document.querySelectorAll('.navigation-menu .more-option')[0].remove;
            window.removeEventListener('resize', moreMenu, false);
        }
    }
}

const createMoreMenu = function () {
    let moreMenu = document.createElement('li');
    moreMenu.classList.add('more-option');
    moreMenu.classList.add('d-none');
    moreMenu.innerHTML = '<div class="submenu"><button class="more-button button-overflow-menu js-dropdown" data-js-target="fds-more-menu" aria-haspopup="true" aria-expanded="false"><span>Mere</span></button><div class="overflow-menu-inner collapsed" id="fds-more-menu" aria-hidden="true"><ul class="overflow-list"></ul></div></div>';
    let moreMenuList = moreMenu.getElementsByClassName('overflow-list')[0];
    let mainMenu = document.querySelectorAll('.navigation-menu .mainmenu')[0];
    let mainMenuItems = document.querySelectorAll('.navigation-menu .mainmenu > li');
    for (let i = 0; i < mainMenuItems.length; i++) {
        if (mainMenuItems[i].getElementsByClassName('submenu').length > 0) {
            let subMenu = document.createElement('li');
            let subMenuText = mainMenuItems[i].getElementsByClassName('button-overflow-menu')[0].getElementsByTagName('SPAN')[0].innerText;
            subMenu.innerHTML = '<ul><li><span class="d-inline-block pr-305 pl-305 small-text">' + subMenuText + '</span></li></ul>';
            let subElements = mainMenuItems[i].getElementsByTagName('LI');
            for (let j = 0; j < subElements.length; j++) {
                subMenu.getElementsByTagName('UL')[0].append(subElements[j].cloneNode(true));
            }
            moreMenuList.append(subMenu);
        }
        else {
            moreMenuList.append(mainMenuItems[i].cloneNode(true));
        }
    }
    mainMenu.append(moreMenu);
    new Dropdown(document.getElementsByClassName('more-button')[0]).init();
}

const moreMenu = function () {
    /* Get relevant information about widths for later checks and calculations */
    let mainMenuItems = document.querySelectorAll('.navigation-menu .mainmenu > li');
    let containerPadding = parseInt(window.getComputedStyle(document.querySelectorAll('.navigation-menu .navigation-menu-inner')[0]).paddingLeft) + 
                           parseInt(window.getComputedStyle(document.querySelectorAll('.navigation-menu .navigation-menu-inner')[0]).paddingRight);
    let mainMenuNegativeMargin = parseInt(window.getComputedStyle(document.querySelectorAll('.navigation-menu .mainmenu')[0]).marginLeft);
    let containerWidth = getVisibleWidth(document.querySelectorAll('.navigation-menu .navigation-menu-inner')[0]) - containerPadding - mainMenuNegativeMargin; 
    let moreOption = document.querySelectorAll('.navigation-menu .more-option')[0];
    let searchWidth = 0;
    let widths = [];
    if (document.querySelectorAll('.navigation-menu.contains-search').length > 0) {
        searchWidth = getVisibleWidth(document.querySelectorAll('.navigation-menu .search')[0]);
    }
    let totalWidth = searchWidth;
    for (let i = 0; i < mainMenuItems.length; i++) {
        let w = getVisibleWidth(mainMenuItems[i]);
        widths.push(w);
        /* The 'more button' should have its width added to the 'widths' array but not included in the 'totalWidth' */
        if (i < mainMenuItems.length - 1) {
            totalWidth = totalWidth + w;
        }
    }

    let moreMenuItems = document.querySelectorAll('.navigation-menu .mainmenu .more-option .submenu .overflow-list > li');

    /* Hide 'more button' if there's room for all main menu items */
    if (totalWidth < containerWidth) {
        for (let i = 0; i < mainMenuItems.length - 1; i++) {
            mainMenuItems[i].classList.remove('d-none');
            moreMenuItems[i].classList.add('d-none');
        }
        moreOption.classList.add('d-none');
    }
    /* If there's not enough room, calculate which main menu items to show */
    else {
        let previousItemWidths = 0;
        let itemCount = -1;
        /* Find the amount of buttons to show */
        for (let i = 0; i < mainMenuItems.length - 1; i++) {
            let moreButtonWidth = widths[mainMenuItems.length-1];
            let currentItemWidth = widths[i];
            if ((previousItemWidths + currentItemWidth + moreButtonWidth + searchWidth) >= containerWidth) {
                /* There's not enough room for the next main menu item - stop item counting */
                break;
            }
            else {
                previousItemWidths = previousItemWidths + widths[i];
                itemCount = i;
            }
        }
        /* Ensure each main menu item gets the correct display property */
        for (let i = 0; i < mainMenuItems.length - 1; i++) {
            if (i <= itemCount) {
                mainMenuItems[i].classList.remove('d-none');
                moreMenuItems[i].classList.add('d-none');
            }
            else {
                mainMenuItems[i].classList.add('d-none');
                moreMenuItems[i].classList.remove('d-none');
            }
        }
        moreOption.classList.remove('d-none');
    }
}

/* Get the width of an element, even if the element isn't visible */
const getVisibleWidth = function (element) {
    let width = 0;
    if (element.classList.contains('d-none')) {
        element.classList.remove('d-none');
        width = element.getBoundingClientRect().width;
        element.classList.add('d-none')
    }
    else {
        width = element.getBoundingClientRect().width;
    }
    return Math.round(width);
}

/**
 * Add functionality to mobile menu
 */
const mobileMenu = function () {
    let mobile = false;

    // Find all menu buttons on page and add toggleNav function
    let openers = document.querySelectorAll(OPENERS);
    for (let o = 0; o < openers.length; o++) {
        if (window.getComputedStyle(openers[o], null).display !== 'none') {
            openers[o].addEventListener('click', toggleNav);
            mobile = true;
        }
    }

    // if mobile
    if (mobile) {

        // Add click listeners to all close elements (e.g. close button and overlay)
        let closers = document.querySelectorAll(CLOSERS);
        for (let c = 0; c < closers.length; c++) {
            closers[c].addEventListener('click', toggleNav);
        }

        let navLinks = document.querySelectorAll(NAV_LINKS);
        for (let n = 0; n < navLinks.length; n++) {
            navLinks[n].addEventListener('click', function () {
                // If a navigation link is clicked inside the mobile menu, ensure that the menu gets hidden
                if (isActive()) {
                    toggleNav.call(this, false);
                }
            });
        }

        const trapContainers = document.querySelectorAll(MOBILE_DRAWER);
        for (let i = 0; i < trapContainers.length; i++) {
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
    let firstTabStop = focusableElements[0];

    function trapTabKey(e) {
        var key = event.which || event.keyCode;
        // Check for TAB key press
        if (key === 9) {

            let lastTabStop = null;
            for (let i = 0; i < focusableElements.length; i++) {
                let number = focusableElements.length - 1;
                let element = focusableElements[number - i];
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
        enable() {
            // Focus first child
            firstTabStop.focus();
            // Listen for and trap the keyboard
            document.addEventListener('keydown', trapTabKey);
        },

        release() {
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