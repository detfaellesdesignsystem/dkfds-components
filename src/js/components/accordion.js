'use strict';
import '../polyfills/Function/prototype/bind';
const toggle = require('../utils/toggle');
const isElementInViewport = require('../utils/is-in-viewport');
const BUTTON = `.accordion-button[aria-controls]`;
const EXPANDED = 'aria-expanded';
const BULK_FUNCTION_ACTION_ATTRIBUTE = "data-accordion-bulk-expand";
const TEXT_ACCORDION = {
    "open_all": "Åbn alle",
    "close_all": "Luk alle"
}

/**
 * Adds click functionality to accordion list
 * @param {HTMLElement} $accordion the accordion ul element
 * @param {JSON} strings Translate labels: {"open_all": "Åbn alle", "close_all": "Luk alle"}
 */
function Accordion($accordion, strings = TEXT_ACCORDION) {
    if (!$accordion) {
        throw new Error(`Missing accordion group element`);
    }
    this.accordion = $accordion;
    this.text = strings;
}

/**
 * Set eventlisteners on click elements in accordion list
 */
Accordion.prototype.init = function () {
    this.buttons = this.accordion.querySelectorAll(BUTTON);
    if (this.buttons.length == 0) {
        throw new Error(`Missing accordion buttons`);
    }

    // loop buttons in list
    for (var i = 0; i < this.buttons.length; i++) {
        let currentButton = this.buttons[i];

        // Verify state on button and state on panel
        let expanded = currentButton.getAttribute(EXPANDED) === 'true';
        this.toggleButton(currentButton, expanded);

        // Set click event on accordion buttons
        currentButton.removeEventListener('click', this.eventOnClick.bind(this, currentButton), false);
        currentButton.addEventListener('click', this.eventOnClick.bind(this, currentButton), false);
    }
    // Set click event on bulk button if present
    let prevSibling = this.accordion.previousElementSibling;
    if (prevSibling !== null && prevSibling.classList.contains('accordion-bulk-button')) {
        this.bulkFunctionButton = prevSibling;
        this.bulkFunctionButton.addEventListener('click', this.bulkEvent.bind(this));
    }
}

/**
 * Bulk event handler: Triggered when clicking on .accordion-bulk-button
 */
Accordion.prototype.bulkEvent = function () {
    var $module = this;
    if (!$module.accordion.classList.contains('accordion')) {
        throw new Error(`Could not find accordion.`);
    }
    if ($module.buttons.length == 0) {
        throw new Error(`Missing accordion buttons`);
    }

    let expand = true;
    if ($module.bulkFunctionButton.getAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE) === "false") {
        expand = false;
    }
    for (var i = 0; i < $module.buttons.length; i++) {
        $module.toggleButton($module.buttons[i], expand, true);
    }

    $module.bulkFunctionButton.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, !expand);
    if (!expand === true) {
        $module.bulkFunctionButton.innerText = this.text.open_all;
    } else {
        $module.bulkFunctionButton.innerText = this.text.close_all;
    }
}

/**
 * Accordion button event handler: Toggles accordion
 * @param {HTMLButtonElement} $button 
 * @param {PointerEvent} e 
 */
Accordion.prototype.eventOnClick = function ($button, e) {
    var $module = this;
    e.stopPropagation();
    e.preventDefault();
    $module.toggleButton($button);
    if ($button.getAttribute(EXPANDED) === 'true') {
        // We were just expanded, but if another accordion was also just
        // collapsed, we may no longer be in the viewport. This ensures
        // that we are still visible, so the user isn't confused.
        if (!isElementInViewport($button)) $button.scrollIntoView();
    }
}

/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */
Accordion.prototype.toggleButton = function (button, expanded, bulk = false) {
    let accordion = null;
    if (button.parentNode.parentNode.classList.contains('accordion')) {
        accordion = button.parentNode.parentNode;
    } else if (button.parentNode.parentNode.parentNode.classList.contains('accordion')) {
        accordion = button.parentNode.parentNode.parentNode;
    }
    expanded = toggle(button, expanded);
    if (expanded) {
        let eventOpen = new Event('fds.accordion.open');
        button.dispatchEvent(eventOpen);
    } else {
        let eventClose = new Event('fds.accordion.close');
        button.dispatchEvent(eventClose);
    }

    if (accordion !== null) {
        let bulkFunction = accordion.previousElementSibling;
        if (bulkFunction !== null && bulkFunction.classList.contains('accordion-bulk-button')) {
            let buttons = accordion.querySelectorAll(BUTTON);
            if (bulk === false) {
                let buttonsOpen = accordion.querySelectorAll(BUTTON + '[aria-expanded="true"]');
                let newStatus = true;

                if (buttons.length === buttonsOpen.length) {
                    newStatus = false;
                }

                bulkFunction.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, newStatus);
                if (newStatus === true) {
                    bulkFunction.innerText = this.text.open_all;
                } else {
                    bulkFunction.innerText = this.text.close_all;
                }
            }
        }
    }
};

export default Accordion;