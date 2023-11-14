'use strict';
import Accordion from './components/accordion';
import Alert from './components/alert';
import BackToTop from './components/back-to-top';
import CharacterLimit from './components/character-limit';
import CheckboxToggleContent from './components/checkbox-toggle-content';
import Dropdown from './components/dropdown';
import DropdownSort from './components/dropdown-sort';
import ErrorSummary from './components/error-summary';
import Modal from './components/modal';
import Navigation from './components/navigation';
import MenuDropdown from './components/navigation-drawer-overflow';
import RadioToggleGroup from './components/radio-toggle-content';
import ResponsiveTable from './components/table';
import Tabnav from  './components/tabnav';
import TableSelectableRows from './components/selectable-table';
import Toast from './components/toast';
import Tooltip from './components/tooltip';
const datePicker = require('./components/date-picker').default;
/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require('./polyfills');

/**
 * Init all components
 * @param {JSON} options {scope: HTMLElement} - Init all components within scope (default is document)
 */
var init = function (options) {
  // Set the options to an empty object by default if no options are passed.
  options = typeof options !== 'undefined' ? options : {}

  // Allow the user to initialise FDS in only certain sections of the page
  // Defaults to the entire document if nothing is set.
  var scope = typeof options.scope !== 'undefined' ? options.scope : document

  /*
  ---------------------
  Accordions
  ---------------------
  */
  const jsSelectorAccordion = scope.getElementsByClassName('accordion');
  for(let c = 0; c < jsSelectorAccordion.length; c++){
    new Accordion(jsSelectorAccordion[ c ]).init();
  }
  const jsSelectorAccordionBordered = scope.querySelectorAll('.accordion-bordered:not(.accordion)');
  for(let c = 0; c < jsSelectorAccordionBordered.length; c++){
    new Accordion(jsSelectorAccordionBordered[ c ]).init();
  }

  /*
  ---------------------
  Alerts
  ---------------------
  */

  const alertsWithCloseButton = scope.querySelectorAll('.alert.has-close');
  for(let c = 0; c < alertsWithCloseButton.length; c++){
    new Alert(alertsWithCloseButton[ c ]).init();
  }

  /*
  ---------------------
  Back to top button
  ---------------------
  */

  const backToTopButtons = scope.getElementsByClassName('back-to-top-button');
  for(let c = 0; c < backToTopButtons.length; c++){
    new BackToTop(backToTopButtons[ c ]).init();
  }

  /*
  ---------------------
  Character limit
  ---------------------
  */
  const jsCharacterLimit = scope.getElementsByClassName('form-limit');
  for(let c = 0; c < jsCharacterLimit.length; c++){

    new CharacterLimit(jsCharacterLimit[ c ]).init();
  }
  
  /*
  ---------------------
  Checkbox collapse
  ---------------------
  */
  const jsSelectorCheckboxCollapse = scope.getElementsByClassName('js-checkbox-toggle-content');
  for(let c = 0; c < jsSelectorCheckboxCollapse.length; c++){
    new CheckboxToggleContent(jsSelectorCheckboxCollapse[ c ]).init();
  }

  /*
  ---------------------
  Overflow menu
  ---------------------
  */
  const jsSelectorDropdown = scope.getElementsByClassName('js-dropdown');
  for(let c = 0; c < jsSelectorDropdown.length; c++){
    new Dropdown(jsSelectorDropdown[ c ]).init();
  }

  
  /*
  ---------------------
  Overflow menu sort
  ---------------------
  */
  const jsSelectorDropdownSort = scope.getElementsByClassName('overflow-menu--sort');
  for(let c = 0; c < jsSelectorDropdownSort.length; c++){
    new DropdownSort(jsSelectorDropdownSort[ c ]).init();
  }

  /*
  ---------------------
  Datepicker
  ---------------------
  */
  datePicker.on(scope);
  
  /*
  ---------------------
  Error summary
  ---------------------
  */
  var $errorSummary = scope.querySelector('[data-module="error-summary"]');
  new ErrorSummary($errorSummary).init();

  /*
  ---------------------
  Modal
  ---------------------
  */
  const modals = scope.querySelectorAll('.fds-modal');
  for(let d = 0; d < modals.length; d++) {
    new Modal(modals[d]).init();
  }
  
  /*
  ---------------------
  Navigation
  ---------------------
  */
  new Navigation().init();

  /*
  ---------------------
  Navigation Drawer Overflow Menus
  ---------------------
  */
  const jsSelectorMenuDropdown = scope.getElementsByClassName('js-menudropdown');
  for(let c = 0; c < jsSelectorMenuDropdown.length; c++){
    new MenuDropdown(jsSelectorMenuDropdown[ c ]).init();
  }

  /*
  ---------------------
  Radiobutton group collapse
  ---------------------
  */
  const jsSelectorRadioCollapse = scope.getElementsByClassName('js-radio-toggle-group');
  for(let c = 0; c < jsSelectorRadioCollapse.length; c++){
    new RadioToggleGroup(jsSelectorRadioCollapse[ c ]).init();
  }

  /*
  ---------------------
  Responsive tables
  ---------------------
  */
  const jsSelectorTable = scope.querySelectorAll('table.table--responsive-headers, table.table-sm-responsive-headers, table.table-md-responsive-headers, table.table-lg-responsive-headers');
  for(let c = 0; c < jsSelectorTable.length; c++){
    new ResponsiveTable(jsSelectorTable[ c ]);
  }

  /*
  ---------------------
  Selectable rows in table
  ---------------------
  */
  const jsSelectableTable = scope.querySelectorAll('table.table--selectable');
  for(let c = 0; c < jsSelectableTable.length; c++){
    new TableSelectableRows(jsSelectableTable[ c ]).init();
  }

  /*
  ---------------------
  Tabnav
  ---------------------
  */
  const jsSelectorTabnav = scope.getElementsByClassName('tabnav');
  for(let c = 0; c < jsSelectorTabnav.length; c++){
    new Tabnav(jsSelectorTabnav[ c ]).init();
  }

  /*
  ---------------------
  Tooltip
  ---------------------
  */
  const jsSelectorTooltip = scope.getElementsByClassName('js-tooltip');
  for(let c = 0; c < jsSelectorTooltip.length; c++){
    new Tooltip(jsSelectorTooltip[ c ]).init();
  }
  
};

export { init, Accordion, Alert, BackToTop, CharacterLimit, CheckboxToggleContent, Dropdown, DropdownSort, datePicker, ErrorSummary, Modal, Navigation, MenuDropdown, RadioToggleGroup, ResponsiveTable, TableSelectableRows, Tabnav, Toast, Tooltip };