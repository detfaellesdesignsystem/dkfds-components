'use strict';
const Dropdown = require('./dropdown');
function DropdownSort (container){
    this.container = container;
    this.button = container.getElementsByClassName('button-overflow-menu')[0];

    // if no value is selected, choose first option
    if(!this.container.querySelector('.overflow-list li[aria-selected="true"]')){
        this.container.querySelectorAll('.overflow-list li')[0].setAttribute('aria-selected', "true");
    }

    updateSelectedValue(this.container);
}
DropdownSort.prototype.init = function(){
    this.overflowMenu = new Dropdown(this.button);

    let sortingOptions = this.container.querySelectorAll('.overflow-list li button');
    for(let s = 0; s < sortingOptions.length; s++){
        let option = sortingOptions[s];
        option.addEventListener('click', onOptionClick);
    }
}
let updateSelectedValue = function(container){
    let selectedItem = container.querySelector('.overflow-list li[aria-selected="true"]');
    container.getElementsByClassName('button-overflow-menu')[0].getElementsByClassName('selected-value')[0].innerText = selectedItem.innerText;
}

let onOptionClick = function(event){
    let li = this.parentNode;
    li.parentNode.querySelector('li[aria-selected="true"]').removeAttribute('aria-selected');
    li.setAttribute('aria-selected', 'true');

    let button = li.parentNode.parentNode.parentNode.getElementsByClassName('button-overflow-menu')[0];
    let eventSelected = new Event('fds.dropdown.selected');
    eventSelected.detail = this;
    button.dispatchEvent(eventSelected);
    updateSelectedValue(li.parentNode.parentNode.parentNode);

    
    let overflowMenu = new Dropdown(button);
    overflowMenu.hide();
}

export default DropdownSort;
