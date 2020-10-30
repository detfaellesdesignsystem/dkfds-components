'use strict';
const Collapse = require('./components/collapse');
const RadioToggleGroup = require('./components/radio-toggle-content');
const CheckboxToggleContent = require('./components/checkbox-toggle-content');
const Dropdown = require('./components/dropdown');
const Accordion = require('./components/accordion');
const ResponsiveTable = require('./components/table');
const Tabnav = require('./components/tabnav');
//const Details = require('./components/details');
const Tooltip = require('./components/tooltip');
const SetTabIndex = require('./components/skipnav');
const Navigation = require('./components/navigation');
const InputRegexMask = require('./components/regex-input-mask');
import Details from './components/details'
import Modal from './components/modal'
/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

var init = function () {

  var modals = document.querySelectorAll('.fds-modal');
  for(let d = 0; d < modals.length; d++) {
    new Modal(modals[d]).init();
  }

  const details = document.querySelectorAll('.js-details');
  for(let d = 0; d < details.length; d++){
    new Details(details[ d ]).init();
  }

  const jsSelectorRegex = document.querySelectorAll('input[data-input-regex]');
  for(let c = 0; c < jsSelectorRegex.length; c++){
    new InputRegexMask(jsSelectorRegex[ c ]);
  }
  const jsSelectorTabindex = document.querySelectorAll('.skipnav[href^="#"]');
  for(let c = 0; c < jsSelectorTabindex.length; c++){
    new SetTabIndex(jsSelectorTabindex[ c ]);
  }
  const jsSelectorTooltip = document.getElementsByClassName('js-tooltip');
  for(let c = 0; c < jsSelectorTooltip.length; c++){
    new Tooltip(jsSelectorTooltip[ c ]);
  }
  const jsSelectorTabnav = document.getElementsByClassName('tabnav');
  for(let c = 0; c < jsSelectorTabnav.length; c++){
    new Tabnav(jsSelectorTabnav[ c ]);
  }

  const jsSelectorAccordion = document.getElementsByClassName('accordion');
  for(let c = 0; c < jsSelectorAccordion.length; c++){
    new Accordion(jsSelectorAccordion[ c ]);
  }
  const jsSelectorAccordionBordered = document.querySelectorAll('.accordion-bordered:not(.accordion)');
  for(let c = 0; c < jsSelectorAccordionBordered.length; c++){
    new Accordion(jsSelectorAccordionBordered[ c ]);
  }

  const jsSelectorTable = document.querySelectorAll('table:not(.dataTable)');
  for(let c = 0; c < jsSelectorTable.length; c++){
    new ResponsiveTable(jsSelectorTable[ c ]);
  }

  const jsSelectorCollapse = document.getElementsByClassName('js-collapse');
  for(let c = 0; c < jsSelectorCollapse.length; c++){
    new Collapse(jsSelectorCollapse[ c ]);
  }

  const jsSelectorRadioCollapse = document.getElementsByClassName('js-radio-toggle-group');
  for(let c = 0; c < jsSelectorRadioCollapse.length; c++){
    new RadioToggleGroup(jsSelectorRadioCollapse[ c ]);
  }

  const jsSelectorCheckboxCollapse = document.getElementsByClassName('js-checkbox-toggle-content');
  for(let c = 0; c < jsSelectorCheckboxCollapse.length; c++){
    new CheckboxToggleContent(jsSelectorCheckboxCollapse[ c ]);
  }

  const jsSelectorDropdown = document.getElementsByClassName('js-dropdown');
  for(let c = 0; c < jsSelectorDropdown.length; c++){
    new Dropdown(jsSelectorDropdown[ c ]);
  }


  new Navigation();

};

module.exports = { init, Collapse, RadioToggleGroup, CheckboxToggleContent, Dropdown, ResponsiveTable, Accordion, Tabnav, Tooltip, SetTabIndex, Navigation, InputRegexMask, Modal };
