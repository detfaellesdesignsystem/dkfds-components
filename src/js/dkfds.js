'use strict';
const domready = require('domready');
const forEach = require('array-foreach');
const select = require('./utils/select');
import {collapse as collapseModule } from './components/collapse';
import {dropdown as dropdownModule } from './components/dropdown';
import {checkboxToggleContent as checkboxToggleContentModule } from './components/checkbox-toggle-content';
import {radioToggleContent as radioToggleContentModule } from './components/radio-toggle-content';
const modal = require('./components/modal');
const table = require('./components/table');
const tooltip = require('./components/tooltip');

function collapse (element){
  new collapseModule(element);
}
function dropdown (element){
  new dropdownModule(element);
}
function checkboxToggleContent (element){
  new checkboxToggleContentModule(element);
}
function radioToggleContent (element){
  new radioToggleContentModule(element);
}


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
    console.log(name);
  }

  const jsSelectorDropdown = '.js-dropdown';
  forEach(select(jsSelectorDropdown), dropdownElement => {
    new dropdownModule(dropdownElement);
  });

  const jsRadioToggleGroup = '.js-radio-toggle-group';
  forEach(select(jsRadioToggleGroup), toggleElement => {
    new radioToggleContentModule(toggleElement);
  });

  const jsCheckboxToggleContent = '.js-checkbox-toggle-content';
  forEach(select(jsCheckboxToggleContent), toggleElement => {
    new checkboxToggleContentModule(toggleElement);
  });

});

module.exports = { collapse, dropdown, checkboxToggleContent, radioToggleContent };
