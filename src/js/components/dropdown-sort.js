'use strict';
import Dropdown from './dropdown';
import '../polyfills/Function/prototype/bind';

/**
 * Add functionality to sorting variant of Overflow menu component
 * @param {HTMLElement} container .overflow-menu element
 */
function DropdownSort (container){
    this.container = container;
    this.button = container.getElementsByClassName('button-overflow-menu')[0];

    // if no value is selected, choose first option
    if(!this.container.querySelector('.overflow-list li button[aria-current="true"]')){
        this.container.querySelectorAll('.overflow-list li button')[0].setAttribute('aria-current', "true");
    }

    this.updateSelectedValue();
}

/**
 * Add click events on overflow menu and options in menu
 */
DropdownSort.prototype.init = function(){
    this.overflowMenu = new Dropdown(this.button).init();

    let sortingOptions = this.container.querySelectorAll('.overflow-list li button');
    for(let s = 0; s < sortingOptions.length; s++){
        let option = sortingOptions[s];
        option.addEventListener('click', this.onOptionClick.bind(this));
    }
}

/**
 * Update button text to selected value
 */
DropdownSort.prototype.updateSelectedValue = function(){
    let selectedItem = this.container.querySelector('.overflow-list li button[aria-current="true"]');
    this.container.getElementsByClassName('button-overflow-menu')[0].getElementsByClassName('selected-value')[0].innerText = selectedItem.innerText;
}

/**
 * Triggers when choosing option in menu
 * @param {PointerEvent} e
 */
DropdownSort.prototype.onOptionClick = function(e){
    let li = e.target.parentNode;
    li.parentNode.querySelector('li button[aria-current="true"]').removeAttribute('aria-current');
    li.querySelectorAll('.overflow-list li button')[0].setAttribute('aria-current', 'true');

    let button = li.parentNode.parentNode.parentNode.getElementsByClassName('button-overflow-menu')[0];
    let eventSelected = new Event('fds.dropdown.selected');
    eventSelected.detail = this.target;
    button.dispatchEvent(eventSelected);
    this.updateSelectedValue();

    // hide menu
    let overflowMenu = new Dropdown(button);
    overflowMenu.hide();
}

export default DropdownSort;
