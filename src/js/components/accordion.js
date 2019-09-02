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

    this.init();
  }

  init (){
    for (var i = 0; i < this.buttons.length; i++){
      let currentButton = this.buttons[i];

      let expanded = currentButton.getAttribute(EXPANDED) === 'true';
      this.toggleButton(currentButton, expanded);

      const that = this;
      currentButton.addEventListener('click', function(event){
        that.eventOnClick(event, this);
      });

    }
  }


  eventOnClick (event, button){
    event.preventDefault();
    this.toggleButton(button);
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
  toggleButton (button, expanded) {
    if (!this.accordion) {
      throw new Error(BUTTON+' is missing outer ACCORDION');
    }

    expanded = toggle(button, expanded);
    // XXX multiselectable is opt-in, to preserve legacy behavior
    const multiselectable = this.accordion.getAttribute(MULTISELECTABLE) === 'true';

    if (expanded && !multiselectable) {
      for(let i = 0; i < this.buttons.length; i++) {
        let currentButtton = this.buttons[i];
          if (currentButtton !== button) {
            toggle(currentButtton, false);
          }

      }
    }
  }
  /**
   * @param {HTMLButtonElement} button
   * @return {boolean} true
   */
  showButton (button){
    toggleButton(button, true);
  }

  /**
   * @param {HTMLButtonElement} button
   * @return {boolean} false
   */
  hideButton (button) {
    toggleButton(button, false);
  }
}

module.exports = Accordion;
