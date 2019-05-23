'use strict';
const closest = require('../utils/closest');

class dropdown {
  constructor (el){
    this.jsDropdownTrigger = '.js-dropdown';
    this.jsDropdownTarget = 'data-js-target';

    //option: make dropdown behave as the collapse component when on small screens (used by submenus in the header and step-dropdown).
    this.navResponsiveBreakpoint = 992; //same as $nav-responsive-breakpoint from the scss.
    this.tringuideBreakpoint = 768; //same as $nav-responsive-breakpoint from the scss.
    this.jsResponsiveCollapseModifier = '.js-dropdown--responsive-collapse';
    this.responsiveCollapseEnabled = false;
    this.responsiveListCollapseEnabled = true;

    this.triggerEl = null;
    this.targetEl = null;

    this.init(el);

    if(this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined){
      let that = this;

      //Clicked outside dropdown -> close it
      document.getElementsByTagName('body')[ 0 ].addEventListener('click', function (event){
        that.outsideClose(event);
      });

      //Clicked on dropdown open button --> toggle it
      this.triggerEl.addEventListener('click', function (event){
        event.preventDefault();
        event.stopPropagation();//prevents ouside click listener from triggering.
        that.toggleDropdown();
      });

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
          if (that.doResponsiveStepguideCollapse()) {
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
            if (that.doResponsiveStepguideCollapse()) {
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
          that.closeAll();
        }
      };
    }
  }


  init (el){
    this.triggerEl = el;
    if(this.triggerEl !== null && this.triggerEl !== undefined){
      let targetAttr = this.triggerEl.getAttribute(this.jsDropdownTarget);
      if(targetAttr !== null && targetAttr !== undefined){
        let targetEl = document.getElementById(targetAttr.replace('#', ''));
        if(targetEl !== null && targetEl !== undefined){
          this.targetEl = targetEl;
        }
      }
    }

    if(this.triggerEl.classList.contains('js-dropdown--responsive-collapse')){
      this.responsiveCollapseEnabled = true;
    }

    if(this.triggerEl.parentNode.classList.contains('overflow-menu--md-no-responsive')){
      this.responsiveListCollapseEnabled = true;
    }

  }

  closeAll (){
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
          if (!currentOverflowMenuEL.closest('.navbar')) {
            triggerEl.setAttribute('aria-expanded', 'false');
            targetEl.classList.add('collapsed');
            targetEl.setAttribute('aria-hidden', 'true');
          }
        } else {
          triggerEl.setAttribute('aria-expanded', 'false');
          targetEl.classList.add('collapsed');
          targetEl.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }

  toggleDropdown (forceClose) {
    if(this.triggerEl !== null && this.triggerEl !== undefined && this.targetEl !== null && this.targetEl !== undefined){
      //change state
      if(this.triggerEl.getAttribute('aria-expanded') === 'true' || forceClose){
        //close
        this.triggerEl.setAttribute('aria-expanded', 'false');
        this.targetEl.classList.add('collapsed');
        this.targetEl.setAttribute('aria-hidden', 'true');
      }else{
        this.closeAll();
        //open
        this.triggerEl.setAttribute('aria-expanded', 'true');
        this.targetEl.classList.remove('collapsed');
        this.targetEl.setAttribute('aria-hidden', 'false');
      }
    }
  }


  outsideClose (event){
    if(!this.doResponsiveCollapse()){
      //closes dropdown when clicked outside.
      let dropdownElm = closest(event.target, this.targetEl.id);
      if((dropdownElm === null || dropdownElm === undefined) && (event.target !== this.triggerEl)){
        //clicked outside trigger, force close
        this.toggleDropdown(true);
      }
    }
  }

  doResponsiveCollapse (){
    //returns true if responsive collapse is enabled and we are on a small screen.
    if((this.responsiveCollapseEnabled || this.responsiveListCollapseEnabled) && window.innerWidth <= this.navResponsiveBreakpoint){
      return true;
    }
    return false;
  }
  doResponsiveStepguideCollapse (){
    //returns true if responsive collapse is enabled and we are on a small screen.
    if((this.responsiveListCollapseEnabled) && window.innerWidth <= this.tringuideBreakpoint){
      return true;
    }
    return false;
  }
}

module.exports = dropdown;
