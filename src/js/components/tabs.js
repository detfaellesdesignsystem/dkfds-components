'use strict';

// Add or substract depending on key pressed
var direction = {
    'ArrowLeft': -1,
    'ArrowRight': 1,
};

/**
 * Adds functionality to tab container component without URL change
 * @param {HTMLElement} tabContainer Tab container
 */
function Tabs(tabContainer) {
    if (!tabContainer) {
        throw new Error(`Missing tab-container element`);
    }
    this.tabContainer = tabContainer;
    this.tabs = this.tabContainer.querySelectorAll('.tab-button');
}

/**
 * Set event on component
 */
Tabs.prototype.init = function () {
    let tabPanels = this.tabContainer.querySelectorAll('.tab-panel');
    if (this.tabs.length < 2 || tabPanels.length < 2) {
        throw new Error(`tab-container must have at least two tabs (tab-button) and tabpanels (tab-panel).`);
    }

    let selectedTabs = 0;
    for (let i = 0; i < this.tabs.length; i++) {
        let tabHasAriaSelected = this.tabs[i].hasAttribute('aria-selected');
        if (tabHasAriaSelected) {
            if (this.tabs[i].getAttribute('aria-selected') === "true") {
                selectedTabs++;
            }
        }
    }
    if (selectedTabs === 0) {
        throw new Error(`tab-container does not have any selected tabs.`);
    }
    else if (selectedTabs > 1) {
        throw new Error(`tab-container must only have one selected tab.`);
    }

    let $module = this;
    // add eventlisteners on buttons
    for (let t = 0; t < this.tabs.length; t++) {
        this.tabs[t].addEventListener('click', function () { $module.activateTab(this, false) });
        this.tabs[t].addEventListener('keydown', keydownEventListener);
    }
}

/***
 * Show tab and hide others
 * @param {HTMLButtonElement} tab button element
 * @param {boolean} setFocus True if tab button should be focused
 */
Tabs.prototype.activateTab = function (tab, setFocus) {
    let tabs = getAllTabsInList(tab);

    if (tab.getAttribute('aria-selected') !== null) {

        // hide all tabs except selected
        for (let i = 0; i < this.tabs.length; i++) {
            if (tabs[i] === tab) {
                continue;
            }

            if (tabs[i].getAttribute('aria-selected') === 'true') {
                let eventHidden = new Event('fds.tab.hidden');
                tabs[i].dispatchEvent(eventHidden);
            }

            tabs[i].setAttribute('aria-selected', 'false');
            tabs[i].setAttribute('tabindex', '-1');
            let tabpanelID = tabs[i].getAttribute('aria-controls');
            let tabpanel = document.getElementById(tabpanelID)
            if (tabpanel === null) {
                throw new Error(`Could not find tabpanel from ID.`);
            }
            tabpanel.setAttribute('hidden', '');
        }

        // Set selected tab to active
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        let tabpanelID = tab.getAttribute('aria-controls');
        let tabpanel = document.getElementById(tabpanelID);
        if (tabpanel === null) {
            throw new Error(`Could not find tabpanel to set active.`);
        }
        tabpanel.removeAttribute('hidden');

        // Set focus when required
        if (setFocus) {
            tab.focus();
        }

        let eventChanged = new Event('fds.tab.changed');
        this.tabContainer.dispatchEvent(eventChanged);

        let eventSelected = new Event('fds.tab.selected');
        tab.dispatchEvent(eventSelected);
    }
}

function keydownEventListener(event) {
    let key = event.key;
    if (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'Home' || key === 'End') {
        event.preventDefault();
        if (event.repeat) {
            return;
        }
        switchTabOnKeyPress(event);
    }
}

/**
 * Either focus the next, previous, first, or last tab
 * depending on key pressed
 */
function switchTabOnKeyPress(event) {
    let pressed = event.key;
    let target = event.target;
    let greatGrandparentNode = target.parentNode.parentNode.parentNode;
    let tabs = getAllTabsInList(target);
    if (direction[pressed]) {
        let index = getIndexOfElementInList(target, tabs);
        if (index !== -1) {
            if (tabs[index + direction[pressed]]) {
                new Tabs(greatGrandparentNode).activateTab(tabs[index + direction[pressed]], true);
            }
            else if (pressed === 'ArrowLeft') {
                new Tabs(greatGrandparentNode).activateTab(tabs[tabs.length - 1], true);
            }
            else if (pressed === 'ArrowRight') {
                new Tabs(greatGrandparentNode).activateTab(tabs[0], true);
            }
        }
    } else if (pressed === 'Home') {
        new Tabs(greatGrandparentNode).activateTab(tabs[0], true);
    } else if (pressed === 'End') {
        new Tabs(greatGrandparentNode).activateTab(tabs[tabs.length - 1], true);
    }
}

/**
 * Get a list of all button tabs in current tablist
 * @param tab Button tab element
 * @returns {*} return array of tabs
 */
function getAllTabsInList(tab) {
    let greatGrandparentNode = tab.parentNode.parentNode.parentNode;
    if (greatGrandparentNode.classList.contains('tab-container')) {
        return greatGrandparentNode.querySelectorAll('.tab-button');
    } else {
        return [];
    }
}

/**
 * Get index of element in list
 * @param {HTMLElement} element 
 * @param {HTMLCollection} list 
 * @returns {index}
 */
function getIndexOfElementInList(element, list) {
    let index = -1;
    for (let i = 0; i < list.length; i++) {
        if (list[i] === element) {
            index = i;
            break;
        }
    }
    return index;
}

export default Tabs;