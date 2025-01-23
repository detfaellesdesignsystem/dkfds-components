'use strict';

/**
 * 
 * @param {HTMLTableElement} table Table Element
 */
function TableSelectableRows (table) {
  this.table = table;
}

/**
 * Initialize eventlisteners for checkboxes in table
 */
TableSelectableRows.prototype.init = function(){
  this.groupCheckbox = this.getGroupCheckbox();
  this.tbodyCheckboxList = this.getCheckboxList();
  if(this.tbodyCheckboxList.length !== 0){
    for(let c = 0; c < this.tbodyCheckboxList.length; c++){
      let checkbox = this.tbodyCheckboxList[c];
      let tableDataCell = checkbox.parentNode.parentNode;
      /* Only add listener to checkboxes in the first column. Checkboxes in other columns
         are not part of the selectable rows. */
      if (tableDataCell.matches('td:first-child')) {
        checkbox.removeEventListener('change', updateGroupCheck);
        checkbox.addEventListener('change', updateGroupCheck);
      }
    }
  }
  if(this.groupCheckbox !== false){
    this.groupCheckbox.removeEventListener('change', updateCheckboxList);
    this.groupCheckbox.addEventListener('change', updateCheckboxList);
  }
}
  
/**
 * Get group checkbox in table header
 * @returns element on true - false if not found
 */
TableSelectableRows.prototype.getGroupCheckbox = function(){
  let checkbox = this.table.getElementsByTagName('thead')[0].getElementsByClassName('form-checkbox');
  if(checkbox.length === 0){
    return false;
  }
  return checkbox[0];
}
/**
 * Get table body checkboxes
 * @returns HTMLCollection
 */
TableSelectableRows.prototype.getCheckboxList = function(){
  return this.table.getElementsByTagName('tbody')[0].getElementsByClassName('form-checkbox');
}

/**
 * Update checkboxes in table body when group checkbox is changed
 * @param {Event} e 
 */
function updateCheckboxList(e){
  let checkbox = e.target;
  checkbox.removeAttribute('aria-checked');
  let table = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
  let tableSelectableRows = new TableSelectableRows(table);
  let checkboxList = tableSelectableRows.getCheckboxList();
  let checkedNumber = 0;
  if(checkbox.checked){
    for(let c = 0; c < checkboxList.length; c++){
      let formGroupCheckbox = checkboxList[c].parentNode;
      let tableDataCell = formGroupCheckbox.parentNode;
      /* Only check checkboxes in the first column. Checkboxes in other columns
         are not part of the selectable rows. */
      if (tableDataCell.matches('td:first-child')) {
        checkboxList[c].checked = true;
        tableDataCell.parentNode.classList.add('table-row-selected');
      }
    }

    checkedNumber = checkboxList.length;
  } else{
    for(let c = 0; c < checkboxList.length; c++){
      let formGroupCheckbox = checkboxList[c].parentNode;
      let tableDataCell = formGroupCheckbox.parentNode;
      /* Only uncheck checkboxes in the first column. Checkboxes in other columns
         are not part of the selectable rows. */
      if (tableDataCell.matches('td:first-child')) {
        checkboxList[c].checked = false;
        tableDataCell.parentNode.classList.remove('table-row-selected');
      }
    }
  }
  
  const event = new CustomEvent("fds.table.selectable.updated", {
    bubbles: true,
    cancelable: true,
    detail: {checkedNumber}
  });
  table.dispatchEvent(event);
}

/**
 * Update group checkbox when checkbox in table body is changed
 * @param {Event} e 
 */
function updateGroupCheck(e){
  // update label for event checkbox
  if(e.target.checked){
    e.target.parentNode.parentNode.parentNode.classList.add('table-row-selected');
  } else{
    e.target.parentNode.parentNode.parentNode.classList.remove('table-row-selected');
  }
  let table = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
  let tableSelectableRows = new TableSelectableRows(table);
  let groupCheckbox = tableSelectableRows.getGroupCheckbox();
  if(groupCheckbox !== false){
    let checkboxList = tableSelectableRows.getCheckboxList();

    // how many row has been selected
    let checkedNumber = 0;
    let totalCheckboxes = 0;
    for(let c = 0; c < checkboxList.length; c++){
      let loopedCheckbox = checkboxList[c];
      let tableDataCell = loopedCheckbox.parentNode.parentNode;
      if(loopedCheckbox.checked && tableDataCell.matches('td:first-child')){
        checkedNumber++;
        totalCheckboxes++;
      }
      else if (tableDataCell.matches('td:first-child')) {
        totalCheckboxes++;
      }
    }
    
    if(checkedNumber === totalCheckboxes){ // if all rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.indeterminate = false;
      groupCheckbox.checked = true;
    } else if(checkedNumber == 0){ // if no rows has been selected
      groupCheckbox.removeAttribute('aria-checked');
      groupCheckbox.indeterminate = false;
      groupCheckbox.checked = false;
    } else{ // if some but not all rows has been selected
      groupCheckbox.setAttribute('aria-checked', 'mixed');
      groupCheckbox.indeterminate = true;
    }
    const event = new CustomEvent("fds.table.selectable.updated", {
      bubbles: true,
      cancelable: true,
      detail: {checkedNumber}
    });
    table.dispatchEvent(event);
  }
}

export default TableSelectableRows;