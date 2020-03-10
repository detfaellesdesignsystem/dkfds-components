'use strict';
let breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};
class Tabnav {

  constructor (tabnav) {
    this.tabnav = tabnav;
    this.tabs = this.tabnav.querySelectorAll('button.tabnav-item');

    // if no hash is set on load, set active tab
    if (!setActiveHashTab()) {
      // set first tab as active
      let tab = this.tabs[ 0 ];

      // check no other tabs as been set at default
      let alreadyActive = getActiveTabs(this.tabnav);
      if (alreadyActive.length === 0) {
        tab = alreadyActive[ 0 ];
      }

      // activate and deactivate tabs
      activateTab(tab, false);
    }

    // add eventlisteners on buttons
    for(let t = 0; t < this.tabs.length; t ++){
      addListeners(this.tabs[ t ]);
    }
  }
}

// For easy reference
var keys = {
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  delete: 46
};

// Add or substract depending on key pressed
var direction = {
  37: -1,
  38: -1,
  39: 1,
  40: 1
};


function addListeners (tab) {
  tab.addEventListener('click', clickEventListener);
  tab.addEventListener('keydown', keydownEventListener);
  tab.addEventListener('keyup', keyupEventListener);
}

// When a tab is clicked, activateTab is fired to activate it
function clickEventListener (event) {
  var tab = this;
  activateTab(tab, false);
}


// Handle keydown on tabs
function keydownEventListener (event) {
  let key = event.keyCode;

  switch (key) {
    case keys.end:
      event.preventDefault();
      // Activate last tab
      focusLastTab(event.target);
      break;
    case keys.home:
      event.preventDefault();
      // Activate first tab
      focusFirstTab(event.target);
      break;
    // Up and down are in keydown
    // because we need to prevent page scroll >:)
    case keys.up:
    case keys.down:
      determineOrientation(event);
      break;
  }
}

// Handle keyup on tabs
function keyupEventListener (event) {
  let key = event.keyCode;

  switch (key) {
    case keys.left:
    case keys.right:
      determineOrientation(event);
      break;
    case keys.delete:
      break;
    case keys.enter:
    case keys.space:
      activateTab(event.target, true);
      break;
  }
}



// When a tablist aria-orientation is set to vertical,
// only up and down arrow should function.
// In all other cases only left and right arrow function.
function determineOrientation (event) {
  let key = event.keyCode;

  let w=window,
    d=document,
    e=d.documentElement,
    g=d.getElementsByTagName('body')[ 0 ],
    x=w.innerWidth||e.clientWidth||g.clientWidth,
    y=w.innerHeight||e.clientHeight||g.clientHeight;

  let vertical = x < breakpoints.md;
  let proceed = false;

  if (vertical) {
    if (key === keys.up || key === keys.down) {
      event.preventDefault();
      proceed = true;
    }
  }
  else {
    if (key === keys.left || key === keys.right) {
      proceed = true;
    }
  }
  if (proceed) {
    switchTabOnArrowPress(event);
  }
}

// Either focus the next, previous, first, or last tab
// depending on key pressed
function switchTabOnArrowPress (event) {
  var pressed = event.keyCode;
  if (direction[ pressed ]) {
    let target = event.target;
    let tabs = getAllTabsInList(target);
    let index = getIndexOfElementInList(target, tabs);
    if (index !== -1) {
      if (tabs[ index + direction[ pressed ] ]) {
        tabs[ index + direction[ pressed ] ].focus();
      }
      else if (pressed === keys.left || pressed === keys.up) {
        focusLastTab(target);
      }
      else if (pressed === keys.right || pressed == keys.down) {
        focusFirstTab(target);
      }
    }
  }
}

/**
 * Get all active tabs in list
 * @param tabnav parent .tabnav element
 * @returns returns list of active tabs if any
 */
function getActiveTabs (tabnav) {
  return tabnav.querySelectorAll('button.tabnav-item[aria-selected=true]');
}

/**
 * Get a list of all button tabs in current tablist
 * @param tab Button tab element
 * @returns {*} return array of tabs
 */
function getAllTabsInList (tab) {
  let parentNode = tab.parentNode;
  if (parentNode.classList.contains('tabnav')) {
    return parentNode.querySelectorAll('button.tabnav-item');
  }
  return [];
}

function getIndexOfElementInList (element, list){
  let index = -1;
  for (let i = 0; i < list.length; i++ ){
    if(list[ i ] === element){
      index = i;
      break;
    }
  }

  return index;
}

/**
 * Checks if there is a tab hash in the url and activates the tab accordingly
 * @returns {boolean} returns true if tab has been set - returns false if no tab has been set to active
 */
function setActiveHashTab () {
  let hash = location.hash.replace('#', '');
  if (hash !== '') {
    let tab = document.querySelector('button.tabnav-item[aria-controls="#' + hash + '"]');
    if (tab !== null) {
      activateTab(tab, false);
      return true;
    }
  }
  return false;
}

/***
 * Activate/show tab and hide others
 * @param tab button element
 */
function activateTab (tab, setFocus) {
  deactivateAllTabsExcept(tab);

  let tabpanelID = tab.getAttribute('aria-controls');
  let tabpanel = document.getElementById(tabpanelID);

  tab.setAttribute('aria-selected', 'true');
  tabpanel.setAttribute('aria-hidden', 'false');
  tab.removeAttribute('tabindex');

  // Set focus when required
  if (setFocus) {
    tab.focus();
  }

  outputEvent(tab, 'fds.tabnav.changed');
  outputEvent(tab.parentNode, 'fds.tabnav.open');
}

/**
 * Deactivate all tabs in list except the one passed
 * @param activeTab button tab element
 */
function deactivateAllTabsExcept (activeTab) {
  let tabs = getAllTabsInList(activeTab);

  for (let i = 0; i < tabs.length; i++) {
    let tab = tabs[ i ];
    if (tab === activeTab) {
      continue;
    }

    if (tab.getAttribute('aria-selected') === 'true') {
      outputEvent(tab, 'fds.tabnav.close');
    }

    tab.setAttribute('tabindex', '-1');
    tab.setAttribute('aria-selected', 'false');
    document.getElementById(tab.getAttribute('aria-controls')).setAttribute('aria-hidden', 'true');
  }
}

/**
 * output an event on the passed element
 * @param element
 * @param eventName
 */
function outputEvent (element, eventName) {
  let event = document.createEvent('Event');
  event.initEvent(eventName, true, true);
  element.dispatchEvent(event);
}

// Make a guess
function focusFirstTab (tab) {
  getAllTabsInList(tab)[ 0 ].focus();
}

// Make a guess
function focusLastTab (tab) {
  let tabs = getAllTabsInList(tab);
  tabs[ tabs.length - 1 ].focus();
}


module.exports = Tabnav;
