'use strict';
const TOGGLE_ATTRIBUTE = 'data-controls';

/**
 * Adds click functionality to radiobutton collapse list
 * @param {HTMLElement} containerElement 
 */
function RadioToggleGroup(containerElement){
    this.radioGroup = containerElement;
    this.radioEls = null;
    this.targetEl = null;
}

/**
 * Set events
 */
RadioToggleGroup.prototype.init = function (){
    this.radioEls = this.radioGroup.querySelectorAll('input[type="radio"]');
    if(this.radioEls.length === 0){
        throw new Error('No radiobuttons found in radiobutton group.');
    }
    var that = this;

    for(let i = 0; i < this.radioEls.length; i++){
        var radio = this.radioEls[ i ];
        
        radio.addEventListener('change', function (){
            for(let a = 0; a < that.radioEls.length; a++ ){
                that.toggle(that.radioEls[ a ]);
            }
        });
        this.toggle(radio);
    }
}

/**
 * Toggle radiobutton content
 * @param {HTMLInputElement} radioInputElement 
 */
RadioToggleGroup.prototype.toggle = function (radioInputElement){
    var contentId = radioInputElement.getAttribute(TOGGLE_ATTRIBUTE);
    if(contentId !== null && contentId !== undefined && contentId !== ""){
        var contentElement = document.querySelector(contentId);
        if(contentElement === null || contentElement === undefined){
            throw new Error(`Could not find panel element. Verify value of attribute `+ TOGGLE_ATTRIBUTE);
        }
        if(radioInputElement.checked){
            this.expand(radioInputElement, contentElement);
        }else{
            this.collapse(radioInputElement, contentElement);
        }
    }
}

/**
 * Expand radio button content
 * @param {} radioInputElement Radio Input element
 * @param {*} contentElement Content element
 */
RadioToggleGroup.prototype.expand = function (radioInputElement, contentElement){
    if(radioInputElement !== null && radioInputElement !== undefined && contentElement !== null && contentElement !== undefined){
        radioInputElement.setAttribute('data-expanded', 'true');
        contentElement.setAttribute('aria-hidden', 'false');
        let eventOpen = new Event('fds.radio.expanded');
        radioInputElement.dispatchEvent(eventOpen);
    }
}
/**
 * Collapse radio button content
 * @param {} radioInputElement Radio Input element
 * @param {*} contentElement Content element
 */
RadioToggleGroup.prototype.collapse = function(radioInputElement, contentElement){
    if(radioInputElement !== null && radioInputElement !== undefined && contentElement !== null && contentElement !== undefined){
        radioInputElement.setAttribute('data-expanded', 'false');
        contentElement.setAttribute('aria-hidden', 'true');
        let eventClose = new Event('fds.radio.collapsed');
        radioInputElement.dispatchEvent(eventClose);
    }
}

export default RadioToggleGroup;