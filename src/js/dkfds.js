'use strict';
const domready = require('domready');
const forEach = require('array-foreach');
const select = require('./utils/select');
const modal = require('./components/modal');
const table = require('./components/table');
const dropdown = require('./components/dropdown');
const radioToggleContent = require('./components/radio-toggle-content');
const checkboxToggleContent = require('./components/checkbox-toggle-content');


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

  const jsSelectorDropdown = '.js-dropdown';
  forEach(select(jsSelectorDropdown), dropdownElement => {
    new dropdown(dropdownElement);
  });

  const jsRadioToggleGroup = '.js-radio-toggle-group';
  forEach(select(jsRadioToggleGroup), toggleElement => {
    new radioToggleContent(toggleElement);
  });

  const jsCheckboxToggleContent = '.js-checkbox-toggle-content';
  forEach(select(jsCheckboxToggleContent), toggleElement => {
    new checkboxToggleContent(toggleElement);
  });

});

module.exports = dkfds;
