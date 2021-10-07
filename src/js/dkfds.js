'use strict';
const Collapse = require('./components/collapse');
const RadioToggleGroup = require('./components/radio-toggle-content');
const CheckboxToggleContent = require('./components/checkbox-toggle-content');
const Dropdown = require('./components/dropdown');
const Accordion = require('./components/accordion');
const Toast = require('./components/toast');
const ResponsiveTable = require('./components/table');
const TableSelectableRows = require('./components/selectable-table');
const Tabnav = require('./components/tabnav');
//const Details = require('./components/details');
const Tooltip = require('./components/tooltip');
const SetTabIndex = require('./components/skipnav');
const Navigation = require('./components/navigation');
const InputRegexMask = require('./components/regex-input-mask');
import Details from './components/details';
import Modal from './components/modal';
import DropdownSort from './components/dropdown-sort';
import ErrorSummary from './components/error-summary';
const datePicker = require('./components/date-picker');
/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

var init = function (options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {}

  // Allow the user to initialise FDS in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document

  datePicker.on(scope);

  const details = scope.querySelectorAll('.js-details');
  for(let d = 0; d < details.length; d++){
    new Details(details[ d ]).init();
  }

  const jsSelectorRegex = scope.querySelectorAll('input[data-input-regex]');
  for(let c = 0; c < jsSelectorRegex.length; c++){
    new InputRegexMask(jsSelectorRegex[ c ]);
  }
  const jsSelectorTabindex = scope.querySelectorAll('.skipnav[href^="#"]');
  for(let c = 0; c < jsSelectorTabindex.length; c++){
    new SetTabIndex(jsSelectorTabindex[ c ]);
  }
  const jsSelectorTooltip = scope.getElementsByClassName('js-tooltip');
  for(let c = 0; c < jsSelectorTooltip.length; c++){
    new Tooltip(jsSelectorTooltip[ c ]);
  }
  const jsSelectorTabnav = scope.getElementsByClassName('tabnav');
  for(let c = 0; c < jsSelectorTabnav.length; c++){
    new Tabnav(jsSelectorTabnav[ c ]);
  }

  const jsSelectorAccordion = scope.getElementsByClassName('accordion');
  for(let c = 0; c < jsSelectorAccordion.length; c++){
    new Accordion(jsSelectorAccordion[ c ]);
  }
  const jsSelectorAccordionBordered = scope.querySelectorAll('.accordion-bordered:not(.accordion)');
  for(let c = 0; c < jsSelectorAccordionBordered.length; c++){
    new Accordion(jsSelectorAccordionBordered[ c ]);
  }

  const jsSelectableTable = scope.querySelectorAll('table.table--selectable');
  for(let c = 0; c < jsSelectableTable.length; c++){
    new TableSelectableRows(jsSelectableTable[ c ]).init();
  }

  const jsSelectorTable = scope.querySelectorAll('table:not(.dataTable)');
  for(let c = 0; c < jsSelectorTable.length; c++){
    new ResponsiveTable(jsSelectorTable[ c ]);
  }

  const jsSelectorCollapse = scope.getElementsByClassName('js-collapse');
  for(let c = 0; c < jsSelectorCollapse.length; c++){
    new Collapse(jsSelectorCollapse[ c ]);
  }

  const jsSelectorRadioCollapse = scope.getElementsByClassName('js-radio-toggle-group');
  for(let c = 0; c < jsSelectorRadioCollapse.length; c++){
    new RadioToggleGroup(jsSelectorRadioCollapse[ c ]);
  }

  const jsSelectorCheckboxCollapse = scope.getElementsByClassName('js-checkbox-toggle-content');
  for(let c = 0; c < jsSelectorCheckboxCollapse.length; c++){
    new CheckboxToggleContent(jsSelectorCheckboxCollapse[ c ]);
  }

  const jsSelectorDropdownSort = scope.getElementsByClassName('overflow-menu--sort');
  for(let c = 0; c < jsSelectorDropdownSort.length; c++){
    new DropdownSort(jsSelectorDropdownSort[ c ]).init();
  }

  const jsSelectorDropdown = scope.getElementsByClassName('js-dropdown');
  for(let c = 0; c < jsSelectorDropdown.length; c++){
    new Dropdown(jsSelectorDropdown[ c ]);
  }

  var modals = scope.querySelectorAll('.fds-modal');
  for(let d = 0; d < modals.length; d++) {
    new Modal(modals[d]).init();
  }

  // Find first error summary module to enhance.
  var $errorSummary = scope.querySelector('[data-module="error-summary"]')
  new ErrorSummary($errorSummary).init()

  new Navigation();

};

module.exports = { init, Collapse, RadioToggleGroup, CheckboxToggleContent, Dropdown, DropdownSort, ResponsiveTable, Accordion, Tabnav, Tooltip, SetTabIndex, Navigation, InputRegexMask, Modal, Details, datePicker, Toast, TableSelectableRows, ErrorSummary};
