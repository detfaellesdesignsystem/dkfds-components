'use strict';
import Dropdown from './dropdown';
const forEach = require('array-foreach');
const select = require('../utils/select').default;

const MOBILE_DRAWER = `.mobile-drawer`;
const NAV_LINKS = `.navigation-menu-mobile a`;
const MODALS = '[data-module="modal"]';
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

        if (document.querySelectorAll('.navigation-menu .mainmenu').length > 0) {
            /* Add an invisible more button to the main menu navigation on desktop */
            createMoreMenu();

            /* Sometimes, it's possible to correctly calculate the width of the menu items
               very early during page load - if it fails, all widths are the same. If possible,
               update the more menu as soon as possible for a better user experience. */
            let widths = [];
            let mainMenuItems = document.querySelectorAll('.navigation-menu .mainmenu > li');
            for (let i = 0; i < mainMenuItems.length - 1; i++) {
                let w = getVisibleWidth(mainMenuItems[i]);
                widths.push(w);
            }
            let allWidthsEqual = (new Set(widths).size === 1); // The same value can't appear twice in a Set. If the size is 1, all widths in the array were equal.
            if (!allWidthsEqual) {
                updateMoreMenu();
            }

            /* Update more menu on window resize */
            window.addEventListener('resize', updateMoreMenu, false);

            // Observe DOM changes to the main menu
            let config = {
                attributes: false,
                attributeOldValue: false,
                characterData: false,
                characterDataOldValue: false,
                childList: true,
                subtree: false
            };
            const observerTarget = document.querySelector('.navigation-menu .mainmenu');
            const callback = function (mutationsList, observer) {
                updateMoreMenu();
            };
            const observer = new MutationObserver(callback);
            observer.observe(observerTarget, config);
            
            /* Ensure the more menu is correctly displayed when all resources have loaded */
            window.onload = (event) => {
                updateMoreMenu();
            };

            // If the document is already loaded, fire updateMoreMenu
            if (document.readyState === 'complete') {
                updateMoreMenu();
            }
        }
    }

    /**
     * Remove events
     */
    teardown() {
        window.removeEventListener('resize', mobileMenu, false);

        if (document.getElementsByClassName('mainmenu').length > 0) {
            document.querySelectorAll('.navigation-menu .more-option')[0].remove;
            window.removeEventListener('resize', updateMoreMenu, false);
        }
    }
}

const createMoreMenu = function () {
    let mainMenu = document.querySelectorAll('.navigation-menu .mainmenu')[0];
    let moreMenu = document.createElement('li');
    moreMenu.classList.add('more-option');
    moreMenu.classList.add('d-none');
    moreMenu.innerHTML = '<div class="submenu"><button class="more-button button-overflow-menu js-dropdown" data-js-target="fds-more-menu" aria-expanded="false" aria-controls="fds-more-menu"><span>Mere</span></button><div class="overflow-menu-inner collapsed" id="fds-more-menu"><ul class="overflow-list"></ul></div></div>';
    mainMenu.append(moreMenu);
    new Dropdown(document.getElementsByClassName('more-button')[0]).init();
}

const updateMoreMenu = function () {
    let mainMenuItems = document.querySelectorAll('.navigation-menu .mainmenu > li');
    let moreMenu = mainMenuItems[mainMenuItems.length - 1];
    let moreMenuList = document.querySelectorAll('.navigation-menu .more-option .overflow-list')[0];

    /* Calculate available space for main menu items */
    let menuWidth = Math.floor(document.querySelectorAll('.navigation-menu .navigation-menu-inner')[0].getBoundingClientRect().width);
    let searchWidth = 0;
    let paddingMoreMenu = 0;
    if (document.querySelectorAll('.navigation-menu.contains-search').length > 0) {
        searchWidth = getVisibleWidth(document.querySelectorAll('.navigation-menu .search')[0]);
    }
    else {
        paddingMoreMenu = parseInt(window.getComputedStyle(document.querySelectorAll('.navigation-menu .more-option .more-button')[0]).paddingRight);
    }
    let containerPadding = parseInt(window.getComputedStyle(document.querySelectorAll('.navigation-menu .navigation-menu-inner')[0]).paddingRight);
    let availableSpace = menuWidth - searchWidth - containerPadding + paddingMoreMenu;

    /* Find the max amount of main menu items, it is possible to show */
    let widthNeeded = 0;
    for (let i = 0; i < mainMenuItems.length - 1; i++) {
        widthNeeded = widthNeeded + getVisibleWidth(mainMenuItems[i]);
        if (widthNeeded >= availableSpace) {
            break;
        }
    }

    if (widthNeeded < availableSpace) {
        /* More menu not needed */
        for (let l = 0; l < mainMenuItems.length - 1; l++) {
            mainMenuItems[l].classList.remove('d-none');
        }
        moreMenu.classList.add('d-none');
    }
    else {
        let widthNeededWithMoreMenu = getVisibleWidth(moreMenu);
        moreMenuList.innerHTML = "";
        for (let j = 0; j < mainMenuItems.length - 1; j++) {
            widthNeededWithMoreMenu = widthNeededWithMoreMenu + getVisibleWidth(mainMenuItems[j]);
            if (widthNeededWithMoreMenu >= availableSpace) {
                mainMenuItems[j].classList.remove('d-none'); // Make visible temporarily for cloning to the more menu
                if (mainMenuItems[j].getElementsByClassName('submenu').length > 0) {
                    /* The menu items contains subitems */
                    let subMenu = document.createElement('li');
                    if (mainMenuItems[j].getElementsByClassName('active').length > 0) {
                        subMenu.classList.add('active');
                    }
                    let subMenuText = mainMenuItems[j].getElementsByClassName('button-overflow-menu')[0].getElementsByTagName('SPAN')[0].innerText;
                    subMenu.innerHTML = `<span class="sub-title" aria-hidden="true">${subMenuText}</span><ul aria-label="${subMenuText}"></ul>`;
                    let subElements = mainMenuItems[j].getElementsByTagName('LI');
                    for (let k = 0; k < subElements.length; k++) {
                        subMenu.getElementsByTagName('UL')[0].append(subElements[k].cloneNode(true));
                    }
                    moreMenuList.append(subMenu);
                }
                else {
                    /* No subitems - cloning can be done without any issues */
                    moreMenuList.append(mainMenuItems[j].cloneNode(true));
                }
                mainMenuItems[j].classList.add('d-none'); // Hide once cloning is done
            }
            else {
                /* There's room for the main menu item - ensure it is visible */
                mainMenuItems[j].classList.remove('d-none');
            }
        }
        moreMenu.classList.remove('d-none');
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
    return Math.ceil(width);
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

        let modals = document.querySelectorAll(MODALS);
        for (let m = 0; m < modals.length; m++) {
            // All modals should close the mobile menu
            modals[m].addEventListener('click', function () {
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
    } else if (!active && menuButton) {
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