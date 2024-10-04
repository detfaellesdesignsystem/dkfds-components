'use strict';
const TARGET = 'data-js-target';

/**
 * Add functionality to overflow buttons in mobile menu
 * @param {HTMLButtonElement} buttonElement Mobile menu button
 */
function MenuDropdown (buttonElement) {
  this.buttonElement = buttonElement;
  this.targetEl = null;

  if(this.buttonElement === null ||this.buttonElement === undefined){
    throw new Error(`Could not find button for overflow menu component.`);
  }
  let targetAttr = this.buttonElement.getAttribute(TARGET);
  if(targetAttr === null || targetAttr === undefined){
    throw new Error('Attribute could not be found on overflow menu component: ' + TARGET);
  }
  let targetEl = document.getElementById(targetAttr.replace('#', ''));
  if(targetEl === null || targetEl === undefined){
    throw new Error('Panel for overflow menu component could not be found.');
  }
  this.targetEl = targetEl;

  /* Close the submenu if the menu items or the menu button no longer have focus.
     Only applied to the desktop submenus, not the mobile submenus. */
  document.addEventListener('focusin', event => {
    let isMobileMenu = this.buttonElement.classList.contains('button-mobile-menu');
    if (!isMobileMenu) {
      let listElements = this.targetEl.querySelectorAll('li');
      let isListElementFocused = [...listElements].includes(event.target.parentElement);
      let isToggleButtonFocused = this.buttonElement === event.target;
      if (!isListElementFocused && !isToggleButtonFocused) {
        toggle(this.buttonElement, true);
      }
    }
  });
}

/**
 * Set click events
 */
MenuDropdown.prototype.init = function (){
  if(this.buttonElement !== null && this.buttonElement !== undefined && this.targetEl !== null && this.targetEl !== undefined){

    //Clicked on dropdown open button --> toggle it
    this.buttonElement.removeEventListener('click', toggleDropdown);
    this.buttonElement.addEventListener('click', toggleDropdown);
  }
}

/**
 * Hide overflow menu
 */
MenuDropdown.prototype.hide = function(){
  toggle(this.buttonElement);
}

/**
 * Show overflow menu
 */
MenuDropdown.prototype.show = function(){
  toggle(this.buttonElement);
}

let toggleDropdown = function (event, forceClose = false) {
  event.stopPropagation();
  event.preventDefault();

  toggle(this, forceClose);
};

let toggle = function(button, forceClose = false){
  let triggerEl = button;
  let targetEl = null;
  if(triggerEl !== null && triggerEl !== undefined){
    let targetAttr = triggerEl.getAttribute(TARGET);
    if(targetAttr !== null && targetAttr !== undefined){
      targetEl = document.getElementById(targetAttr.replace('#', ''));
    }
  }
  if(triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined){
    if(triggerEl.getAttribute('aria-expanded') === 'true' || forceClose){
      //close
      triggerEl.setAttribute('aria-expanded', 'false');
      targetEl.setAttribute('aria-hidden', 'true');      
      let eventClose = new Event('fds.menudropdown.close');
      triggerEl.dispatchEvent(eventClose);
    }else{
      //open
      triggerEl.setAttribute('aria-expanded', 'true');
      targetEl.setAttribute('aria-hidden', 'false');
      let eventOpen = new Event('fds.menudropdown.open');
      triggerEl.dispatchEvent(eventOpen);
    }

  }
}

export default MenuDropdown;