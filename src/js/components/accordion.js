'use strict';
const toggle = require('../utils/toggle');
const isElementInViewport = require('../utils/is-in-viewport');
const BUTTON = `.accordion-button[aria-controls]`;
const EXPANDED = 'aria-expanded';
const MULTISELECTABLE = 'aria-multiselectable';

class Accordion{
  constructor (accordion){
    this.accordion = accordion;
    this.buttons = accordion.querySelectorAll(BUTTON);
    this.eventClose = new Event('fds.accordion.close');
    this.eventOpen = new Event('fds.accordion.open');
    this.init();
  }

  init (){
    for (var i = 0; i < this.buttons.length; i++){
      let currentButton = this.buttons[i];

      let expanded = currentButton.getAttribute(EXPANDED) === 'true';
      toggleButton(currentButton, expanded);

      const that = this;
      currentButton.removeEventListener('click', that.eventOnClick, false);
      currentButton.addEventListener('click', that.eventOnClick, false);

    }
  }


  eventOnClick (event){
    event.stopPropagation();
    let button = this;
    event.preventDefault();
    toggleButton(button);
    if (button.getAttribute(EXPANDED) === 'true') {
      // We were just expanded, but if another accordion was also just
      // collapsed, we may no longer be in the viewport. This ensures
      // that we are still visible, so the user isn't confused.
      if (!isElementInViewport(button)) button.scrollIntoView();
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
}

var toggleButton  = function (button, expanded) {
  let accordion = null;
  if(button.parentNode.parentNode.classList.contains('accordion')){
    accordion = button.parentNode.parentNode;
  }

  let eventClose = new Event('fds.accordion.close');
  let eventOpen = new Event('fds.accordion.open');
  expanded = toggle(button, expanded);

  if(expanded){
    button.dispatchEvent(eventOpen);
  } else{
    button.dispatchEvent(eventClose);
  }

  // XXX multiselectable is opt-in, to preserve legacy behavior
  let multiselectable = false;
  if(accordion !== null && accordion.getAttribute(MULTISELECTABLE) === 'true'){
    multiselectable = true;
  }

  if (expanded && !multiselectable) {
    let buttons = [ button ];
    if(accordion !== null) {
      buttons = accordion.querySelectorAll(BUTTON);
    }
    for(let i = 0; i < buttons.length; i++) {
      let currentButtton = buttons[i];
      if (currentButtton !== button) {
        toggle(currentButtton, false);
        currentButtton.dispatchEvent(eventClose);
      }
    }
  }
};


module.exports = Accordion;
