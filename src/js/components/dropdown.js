'use strict';
const closest = require('../utils/closest');
const toggle = require('../utils/toggle');
const BUTTON = '.js-dropdown';
const TARGET = 'data-js-target';
const eventCloseName = 'fds.dropdown.close';
const eventOpenName = 'fds.dropdown.open';

const navResponsiveBreakpoint = 992; //same as $nav-responsive-breakpoint from the scss.
const tringuideBreakpoint = 768; //same as $nav-responsive-breakpoint from the scss.

class Dropdown {
  constructor (el){
    this.jsDropdownTrigger = '.js-dropdown';

    //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).
    this.jsResponsiveCollapseModifier = '.js-dropdown--responsive-collapse';
    this.refsponsiveCollapseEnabled = false;
    this.responsiveListCollapseEnabled = false;


    this.triggerEl = null;
    this.targetEl = null;

    this.init(el);

    if(this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined){
      let that = this;


      if(this.triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive')){
        this.responsiveListCollapseEnabled = true;
      }

      //Clicked outside dropdown -> close it
      document.getElementsByTagName('body')[ 0 ].removeEventListener('click', outsideClose);
      document.getElementsByTagName('body')[ 0 ].addEventListener('click', outsideClose);
      //Clicked on dropdown open button --> toggle it
      this.triggerEl.removeEventListener('click', toggleDropdown);
      this.triggerEl.addEventListener('click', toggleDropdown);

      // set aria-hidden correctly for screenreaders (Tringuide responsive)
      if(this.responsiveListCollapseEnabled) {
        var element = this.triggerEl;
        if (window.IntersectionObserver) {
          // trigger event when button changes visibility
          var observer = new IntersectionObserver(function (entries) {
            // button is visible
            if (entries[0].intersectionRatio) {
              if (element.getAttribute('aria-expanded') === 'false') {
                that.targetEl.setAttribute('aria-hidden', true);
              }
            } else {
              // button is not visible
              if (that.targetEl.getAttribute('aria-hidden') === 'true') {
                that.targetEl.setAttribute('aria-hidden', false);
              }
            }
          }, {
            root: document.body
          });
          observer.observe(element);
        } else {
          // IE: IntersectionObserver is not supported, so we listen for window resize and grid breakpoint instead
          if (doResponsiveStepguideCollapse(that.triggerEl)) {
            // small screen
            if (element.getAttribute('aria-expanded') === 'false') {
              that.targetEl.setAttribute('aria-hidden', true);
            } else{
              that.targetEl.setAttribute('aria-hidden', false);
            }
          } else {
            // Large screen
            that.targetEl.setAttribute('aria-hidden', false);
          }
          window.addEventListener('resize', function () {
            if (doResponsiveStepguideCollapse(that.triggerEl)) {
              if (element.getAttribute('aria-expanded') === 'false') {
                that.targetEl.setAttribute('aria-hidden', true);
              } else{
                that.targetEl.setAttribute('aria-hidden', false);
              }
            } else {
              that.targetEl.setAttribute('aria-hidden', false);
            }
          });
        }
      }

      document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode === 27) {
          closeAll();
        }
      };
    }
  }

  init (el){
    this.triggerEl = el;
    if(this.triggerEl !== null && this.triggerEl !== undefined){
      let targetAttr = this.triggerEl.getAttribute(TARGET);
      if(targetAttr !== null && targetAttr !== undefined){
        let targetEl = document.getElementById(targetAttr.replace('#', ''));
        if(targetEl !== null && targetEl !== undefined){
          this.targetEl = targetEl;
        }
      }
    }
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
const toggleButton = (button, expanded) => {
  toggle(button, expanded);
};

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param {HTMLElement} accordion
 * @return {array<HTMLButtonElement>}
 */
var getButtons = function (parent) {
  return parent.querySelectorAll(BUTTON);
};
var closeAll = function (){

  var eventClose = document.createEvent('Event');
  eventClose.initEvent(eventCloseName, true, true);

  const body = document.querySelector('body');

  let overflowMenuEl = document.getElementsByClassName('overflow-menu');
  let triggerEl = null;
  let targetEl = null;
  for (let oi = 0; oi < overflowMenuEl.length; oi++) {
    let currentOverflowMenuEL = overflowMenuEl[ oi ];
    for (let a = 0; a < currentOverflowMenuEL.childNodes.length; a++) {
      if (currentOverflowMenuEL.childNodes[ a ].tagName !== undefined) {
        if (currentOverflowMenuEL.childNodes[ a ].classList.contains('js-dropdown')) {
          triggerEl = currentOverflowMenuEL.childNodes[ a ];
        } else if (currentOverflowMenuEL.childNodes[ a ].classList.contains('overflow-menu-inner')) {
          targetEl = currentOverflowMenuEL.childNodes[ a ];
        }
      }
    }
    if (targetEl !== null && triggerEl !== null) {
      if (body.classList.contains('mobile_nav-active')) {
        if (!closest(currentOverflowMenuEL, '.navbar')) {

          if(triggerEl.getAttribute('aria-expanded') === true){
            triggerEl.dispatchEvent(eventClose);
          }
          triggerEl.setAttribute('aria-expanded', 'false');
          targetEl.classList.add('collapsed');
          targetEl.setAttribute('aria-hidden', 'true');
        }
      } else {
        if(triggerEl.getAttribute('aria-expanded') === true){
          triggerEl.dispatchEvent(eventClose);
        }
        triggerEl.setAttribute('aria-expanded', 'false');
        targetEl.classList.add('collapsed');
        targetEl.setAttribute('aria-hidden', 'true');

      }
    }
  }
};
var offset = function (el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
};

var toggleDropdown = function (event, forceClose = false) {
  event.stopPropagation();
  event.preventDefault();

  var eventClose = document.createEvent('Event');
  eventClose.initEvent(eventCloseName, true, true);

  var eventOpen = document.createEvent('Event');
  eventOpen.initEvent(eventOpenName, true, true);
  let triggerEl = this;
  let targetEl = null;
  if(triggerEl !== null && triggerEl !== undefined){
    let targetAttr = triggerEl.getAttribute(TARGET);
    if(targetAttr !== null && targetAttr !== undefined){
      targetEl = document.getElementById(targetAttr.replace('#', ''));
    }
  }
  if(triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined){
    //change state

    targetEl.style.left = null;
    targetEl.style.right = null;

    var rect = triggerEl.getBoundingClientRect();
    if(triggerEl.getAttribute('aria-expanded') === 'true' || forceClose){
      //close
      triggerEl.setAttribute('aria-expanded', 'false');
      targetEl.classList.add('collapsed');
      targetEl.setAttribute('aria-hidden', 'true');
      triggerEl.dispatchEvent(eventClose);
    }else{
      closeAll();
      //open
      triggerEl.setAttribute('aria-expanded', 'true');
      targetEl.classList.remove('collapsed');
      targetEl.setAttribute('aria-hidden', 'false');
      triggerEl.dispatchEvent(eventOpen);
      var targetOffset = offset(targetEl);

      if(targetOffset.left < 0){
        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';
      }
      var right = targetOffset.left + targetEl.offsetWidth;
      if(right > window.innerWidth){
        targetEl.style.left = 'auto';
        targetEl.style.right = '0px';
      }

      var offsetAgain = offset(targetEl);

      if(offsetAgain.left < 0){

        targetEl.style.left = '0px';
        targetEl.style.right = 'auto';
      }
      right = offsetAgain.left + targetEl.offsetWidth;
      if(right > window.innerWidth){

        targetEl.style.left = 'auto';
        targetEl.style.right = '0px';
      }
    }

  }
};


/**
 * @param {HTMLButtonElement} button
 * @return {boolean} true
 */
var show = function (button){
  toggleButton(button, true);
};



/**
 * @param {HTMLButtonElement} button
 * @return {boolean} false
 */
var hide = function (button) {
  toggleButton(button, false);
};


let outsideClose = function (evt){
  let openDropdowns = document.querySelectorAll('.js-dropdown[aria-expanded=true]');
  for(var i = 0; i < openDropdowns.length; i++) {
    let triggerEl = openDropdowns[ i ];
    let targetEl = null;
    let targetAttr = triggerEl.getAttribute(TARGET);
    if(targetAttr !== null && targetAttr !== undefined){
      targetEl = document.getElementById(targetAttr.replace('#', ''));
    }
    if (!doResponsiveCollapse(triggerEl)) {
      //closes dropdown when clicked outside
      if (evt.target !== triggerEl) {
        //clicked outside trigger, force close
        triggerEl.setAttribute('aria-expanded', 'false');
        targetEl.classList.add('collapsed');
        targetEl.setAttribute('aria-hidden', 'true');

        var eventClose = document.createEvent('Event');
        eventClose.initEvent(eventCloseName, true, true);
        triggerEl.dispatchEvent(eventClose);
      }
    }
  }
};


let doResponsiveCollapse = function (triggerEl){
  let responsiveCollapseEnabled = false;
  let responsiveListCollapseEnabled = false;

  if(triggerEl.classList.contains('js-dropdown--responsive-collapse')){
    responsiveCollapseEnabled = true;
  }

  if(triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive')){
    responsiveListCollapseEnabled = true;
  }

  //returns true if responsive collapse is enabled and we are on a small screen.
  if((responsiveCollapseEnabled || responsiveListCollapseEnabled) && window.innerWidth <= navResponsiveBreakpoint){
    return true;
  }
  return false;
};

let doResponsiveStepguideCollapse = function (triggerEl){
  let responsiveListCollapseEnabled = false;

  if(triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive')){
    responsiveListCollapseEnabled = true;
  }

  //returns true if responsive collapse is enabled and we are on a small screen.
  if((responsiveListCollapseEnabled) && window.innerWidth <= tringuideBreakpoint){
    return true;
  }
  return false;
};


module.exports = Dropdown;
