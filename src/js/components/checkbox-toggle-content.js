'use strict';
import '../polyfills/Function/prototype/bind';

const TOGGLE_TARGET_ATTRIBUTE = 'data-aria-controls';

/**
 * Adds click functionality to checkbox collapse component
 * @param {HTMLInputElement} checkboxElement 
 */
function CheckboxToggleContent(checkboxElement){
    this.checkboxElement = checkboxElement;
    this.targetElement = null;
}

/**
 * Set events on checkbox state change
 */
CheckboxToggleContent.prototype.init = function(){
    this.checkboxElement.addEventListener('change', this.toggle.bind(this));
    this.toggle();
}

/**
 * Toggle checkbox content
 */
CheckboxToggleContent.prototype.toggle = function(){
    var $module = this;
    var targetAttr = this.checkboxElement.getAttribute(TOGGLE_TARGET_ATTRIBUTE)
    var targetEl = document.getElementById(targetAttr);
    if(targetEl === null || targetEl === undefined){
        throw new Error(`Could not find panel element. Verify value of attribute `+ TOGGLE_TARGET_ATTRIBUTE);
    }
    if(this.checkboxElement.checked){
        $module.expand(this.checkboxElement, targetEl);
    }else{
        $module.collapse(this.checkboxElement, targetEl);
    }
}

/**
 * Expand content
 * @param {HTMLInputElement} checkboxElement Checkbox input element 
 * @param {HTMLElement} contentElement Content container element 
 */
CheckboxToggleContent.prototype.expand = function(checkboxElement, contentElement){
    if(checkboxElement !== null && checkboxElement !== undefined && contentElement !== null && contentElement !== undefined){
        checkboxElement.setAttribute('data-aria-expanded', 'true');
        contentElement.classList.remove('collapsed');
        contentElement.setAttribute('aria-hidden', 'false');
        let eventOpen = new Event('fds.collapse.expanded');
        checkboxElement.dispatchEvent(eventOpen);
    }
}

/**
 * Collapse content
 * @param {HTMLInputElement} checkboxElement Checkbox input element 
 * @param {HTMLElement} contentElement Content container element 
 */
CheckboxToggleContent.prototype.collapse = function(triggerEl, targetEl){
    if(triggerEl !== null && triggerEl !== undefined && targetEl !== null && targetEl !== undefined){
        triggerEl.setAttribute('data-aria-expanded', 'false');
        targetEl.classList.add('collapsed');
        targetEl.setAttribute('aria-hidden', 'true');
        
        let eventClose = new Event('fds.collapse.collapsed');
        triggerEl.dispatchEvent(eventClose);
    }
}

export default CheckboxToggleContent;
