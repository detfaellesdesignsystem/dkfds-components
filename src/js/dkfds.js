'use strict';
const domready = require('domready');
const collapse = require('./components/collapse');
const radioToggleGroup = require('./components/radio-toggle-content');
const checkboxToggleContent = require('./components/checkbox-toggle-content');
const dropdown = require('./components/dropdown');
const Accordion = require('./components/accordion');
const modal = require('./components/modal');
const ResponsiveTables = require('./components/table');
const tooltip = require('./components/tooltip');

/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

const dkfds = require('./config');

const components = require('./components');
dkfds.components = components;

domready(() => {
  const target = document.body;
  for (let name in components) {
    const behavior = components[ name ];
    behavior.on(target);
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
    new ResponsiveTables(jsSelectorTable[ c ]);
  }

  const jsSelectorCollapse = document.getElementsByClassName('js-collapse');
  for(let c = 0; c < jsSelectorCollapse.length; c++){
    new collapse(jsSelectorCollapse[ c ]);
  }

  const jsSelectorRadioCollapse = document.getElementsByClassName('js-radio-toggle-group');
  for(let c = 0; c < jsSelectorRadioCollapse.length; c++){
    new radioToggleGroup(jsSelectorRadioCollapse[ c ]);
  }

  const jsSelectorCheckboxCollapse = document.getElementsByClassName('js-checkbox-toggle-content');
  for(let c = 0; c < jsSelectorCheckboxCollapse.length; c++){
    new checkboxToggleContent(jsSelectorCheckboxCollapse[ c ]);
  }
  const jsSelectorDropdown = document.getElementsByClassName('js-dropdown');
  for(let c = 0; c < jsSelectorDropdown.length; c++){
    new dropdown(jsSelectorDropdown[ c ]);
  }

});

module.exports = { collapse, radioToggleGroup, checkboxToggleContent, dropdown, ResponsiveTables, Accordion };
