'use strict';
const toggle = require('../utils/toggle');
const isElementInViewport = require('../utils/is-in-viewport');
const BUTTON = `.accordion-button[aria-controls]`;
const EXPANDED = 'aria-expanded';
const MULTISELECTABLE = 'aria-multiselectable';
const MULTISELECTABLE_CLASS = 'accordion-multiselectable';
const BULK_FUNCTION_OPEN_TEXT = "Åbn alle";
const BULK_FUNCTION_CLOSE_TEXT = "Luk alle";
const BULK_FUNCTION_ACTION_ATTRIBUTE = "data-accordion-bulk-expand";

class Accordion{
  constructor (accordion){
    if(!accordion){
      throw new Error(`Missing accordion group element`);
    }
    this.accordion = accordion;
    let prevSibling = accordion.previousElementSibling ;
    if(prevSibling !== null && prevSibling.classList.contains('accordion-bulk-button')){
      this.bulkFunctionButton = prevSibling;
    }
    this.buttons = accordion.querySelectorAll(BUTTON);
    if(this.buttons.length == 0){
      throw new Error(`Missing accordion buttons`);
    } else{
      this.eventClose = document.createEvent('Event');
      this.eventClose.initEvent('fds.accordion.close', true, true);
      this.eventOpen = document.createEvent('Event');
      this.eventOpen.initEvent('fds.accordion.open', true, true);
      this.init();
    }
  }

  init (){
    for (var i = 0; i < this.buttons.length; i++){
      let currentButton = this.buttons[i];
      
      // Verify state on button and state on panel
      let expanded = currentButton.getAttribute(EXPANDED) === 'true';
      toggleButton(currentButton, expanded);

      const that = this;
      currentButton.removeEventListener('click', that.eventOnClick, false);
      currentButton.addEventListener('click', that.eventOnClick, false);
      this.enableBulkFunction();
    }
  }

  enableBulkFunction(){
    if(this.bulkFunctionButton !== undefined){
      this.bulkFunctionButton.addEventListener('click', function(){
        let accordion = this.nextElementSibling;
        let buttons = accordion.querySelectorAll(BUTTON);
        if(!accordion.classList.contains('accordion')){  
          throw new Error(`Could not find accordion.`);
        }
        if(buttons.length == 0){
          throw new Error(`Missing accordion buttons`);
        }
         
        let expand = true;
        if(this.getAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE) === "false") {
          expand = false;
        }
        for (var i = 0; i < buttons.length; i++){
          toggleButton(buttons[i], expand);
        }
        
        this.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, !expand);
        if(!expand === true){
          this.innerText = BULK_FUNCTION_OPEN_TEXT;
        } else{
          this.innerText = BULK_FUNCTION_CLOSE_TEXT;
        }
      });
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
  } else if(button.parentNode.parentNode.parentNode.classList.contains('accordion')){
    accordion = button.parentNode.parentNode.parentNode;
  }

  let eventClose = document.createEvent('Event');
  eventClose.initEvent('fds.accordion.close', true, true);
  let eventOpen = document.createEvent('Event');
  eventOpen.initEvent('fds.accordion.open', true, true);
  expanded = toggle(button, expanded);

  if(expanded){
    button.dispatchEvent(eventOpen);
  } else{
    button.dispatchEvent(eventClose);
  }

  let multiselectable = false;
  if(accordion !== null && (accordion.getAttribute(MULTISELECTABLE) === 'true' || accordion.classList.contains(MULTISELECTABLE_CLASS))){
    multiselectable = true;
    let bulkFunction = accordion.previousElementSibling;
    if(bulkFunction !== null && bulkFunction.classList.contains('accordion-bulk-button')){
      let status = bulkFunction.getAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE);
      let buttons = accordion.querySelectorAll(BUTTON);
      let buttonsOpen = accordion.querySelectorAll(BUTTON+'[aria-expanded="true"]');
      let buttonsClosed = accordion.querySelectorAll(BUTTON+'[aria-expanded="false"]');
      let newStatus = true;
      if(buttons.length === buttonsOpen.length){
        newStatus = false;
      }
      if(buttons.length === buttonsClosed.length){
        newStatus = true;
      }
      bulkFunction.setAttribute(BULK_FUNCTION_ACTION_ATTRIBUTE, newStatus);
      if(newStatus === true){
        bulkFunction.innerText = BULK_FUNCTION_OPEN_TEXT;
      } else{
        bulkFunction.innerText = BULK_FUNCTION_CLOSE_TEXT;
      }

    }
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
