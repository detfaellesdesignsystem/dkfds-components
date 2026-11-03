(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["DKFDSWebComponents"] = factory();
	else
		root["DKFDSWebComponents"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	const __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  registerAccordion: () => (/* reexport */ fds_accordion),
  registerAccordionGroup: () => (/* reexport */ fds_accordion_group),
  registerAlert: () => (/* reexport */ fds_alert),
  registerCharacterLimit: () => (/* reexport */ fds_character_limit),
  registerCheckbox: () => (/* reexport */ fds_checkbox),
  registerCheckboxGroup: () => (/* reexport */ fds_checkbox_group),
  registerCustomElements: () => (/* binding */ registerCustomElements),
  registerDateInput: () => (/* reexport */ fds_date_input),
  registerDatePicker: () => (/* reexport */ fds_date_picker),
  registerDatePickerGrid: () => (/* reexport */ fds_date_picker_grid),
  registerDropdownMenu: () => (/* reexport */ fds_dropdown_menu),
  registerErrorMessage: () => (/* reexport */ fds_error_message),
  registerErrorSummary: () => (/* reexport */ fds_error_summary),
  registerHelpText: () => (/* reexport */ fds_help_text),
  registerInput: () => (/* reexport */ fds_input),
  registerInputAffix: () => (/* reexport */ input_affix),
  registerMainMenu: () => (/* reexport */ fds_main_menu),
  registerModal: () => (/* reexport */ fds_modal),
  registerModalCloser: () => (/* reexport */ fds_modal_closer),
  registerModalOpener: () => (/* reexport */ fds_modal_opener),
  registerMultiselect: () => (/* reexport */ fds_multiselect),
  registerMultiselectDialog: () => (/* reexport */ fds_multiselect_dialog),
  registerMultiselectOpener: () => (/* reexport */ fds_multiselect_opener),
  registerMultiselectOption: () => (/* reexport */ fds_multiselect_option),
  registerMultiselectOptions: () => (/* reexport */ fds_multiselect_options),
  registerMultiselectSelectAll: () => (/* reexport */ fds_multiselect_select_all),
  registerPortalInfo: () => (/* reexport */ fds_portal_info),
  registerRadioButton: () => (/* reexport */ fds_radio_button),
  registerRadioButtonGroup: () => (/* reexport */ fds_radio_button_group),
  registerSelect: () => (/* reexport */ fds_select),
  registerSolutionInfo: () => (/* reexport */ fds_solution_info),
  registerTab: () => (/* reexport */ fds_tab),
  registerTabPanel: () => (/* reexport */ fds_tab_panel),
  registerTabs: () => (/* reexport */ fds_tabs),
  registerTextarea: () => (/* reexport */ fds_textarea),
  registerToggleSwitch: () => (/* reexport */ fds_toggle_switch),
  registerTooltip: () => (/* reexport */ fds_tooltip),
  registerTooltipIcon: () => (/* reexport */ fds_tooltip_icon)
});

;// ./src/js/utils/generate-unique-id.js
function generateUniqueId() {
  return crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}
function generateUniqueIdWithPrefix(str) {
  return str + crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
}
function generateAndVerifyUniqueId(str) {
  let uniqueId = generateUniqueIdWithPrefix(str);
  let attempts = 10; // Precaution to prevent long loops - more than 10 failed attempts should be extremely rare

  while (document.getElementById(uniqueId) && attempts > 0) {
    uniqueId = generateUniqueIdWithPrefix(str);
    attempts--;
  }
  return uniqueId;
}
;// ./src/js/web-components/accordion/fds-accordion.js

class FDSAccordion extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['heading', 'heading-level', 'expanded', 'content-id', 'variant-text', 'variant-icon', 'ready'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get heading() {
    return this.getAttribute('heading');
  }
  set heading(val) {
    this.setAttribute('heading', val);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized;
  #handleAccordionClick;
  #accordionObserver = null;

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #getHeadingElement() {
    return this.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
  }
  #getContentElement() {
    return this.querySelector(':scope > .accordion-content');
  }
  #normalizeHeadingLevel(headingLevel) {
    const normalizedHeadingLevel = (headingLevel || 'h3').toLowerCase();
    return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(normalizedHeadingLevel) ? normalizedHeadingLevel : 'h3';
  }
  #ensureDOM() {
    const headingLevel = this.#normalizeHeadingLevel(this.getAttribute('heading-level'));
    let headingElement = this.#getHeadingElement();
    let contentElement = this.querySelector(':scope > div');

    // Attribute mode:
    // No heading markup provided, so create canonical structure from attributes
    if (!headingElement) {
      headingElement = document.createElement(headingLevel);
      const buttonElement = document.createElement('button');
      buttonElement.classList.add('accordion-button');
      buttonElement.setAttribute('type', 'button');
      const titleElement = document.createElement('span');
      titleElement.classList.add('accordion-title');
      titleElement.textContent = this.getAttribute('heading') || '';
      buttonElement.appendChild(titleElement);
      headingElement.appendChild(buttonElement);
      if (!contentElement) {
        contentElement = document.createElement('div');
        this.appendChild(contentElement);
      }
      contentElement.classList.add('accordion-content');
      this.prepend(headingElement);
      return true;
    }

    // Enhance mode:
    // Heading exists, so the supported prerendered structure must already be present
    const buttonElement = headingElement.querySelector(':scope > button');
    if (!buttonElement) {
      console.warn('<fds-accordion> Missing direct child button inside heading.');
      return false;
    }
    const titleElement = buttonElement.querySelector(':scope > span');
    if (!titleElement) {
      console.warn('<fds-accordion> Missing direct child span inside button.');
      return false;
    }
    if (!contentElement) {
      console.warn('<fds-accordion> Missing direct child div for accordion content.');
      return false;
    }
    buttonElement.classList.add('accordion-button');
    buttonElement.setAttribute('type', 'button');
    titleElement.classList.add('accordion-title');
    contentElement.classList.add('accordion-content');
    return true;
  }
  #updateHeading(heading) {
    this.querySelector('.accordion-title').textContent = heading;
  }
  #updateHeadingLevel(headingLevel) {
    const normalizedHeadingLevel = this.#normalizeHeadingLevel(headingLevel);
    let headingElement = this.#getHeadingElement();
    if (!headingElement || headingElement.tagName.toLowerCase() === normalizedHeadingLevel) return;
    const newHeadingLevel = document.createElement(normalizedHeadingLevel);
    newHeadingLevel.append(...headingElement.childNodes);
    headingElement.replaceWith(newHeadingLevel);
  }
  #setExpandedState(isExpanded) {
    const button = this.#getHeadingElement()?.querySelector('button.accordion-button');
    const content = this.#getContentElement();
    if (!button || !content) return;
    button.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    content.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
  }
  #updateExpanded(expanded) {
    const isExpanded = expanded !== null && expanded !== 'false';
    this.#setExpandedState(isExpanded);
  }
  #updateContentId(contentId) {
    this.#getHeadingElement().querySelector('.accordion-button').setAttribute('aria-controls', contentId);
    this.#getContentElement().setAttribute('id', contentId);
  }
  #ensureContentId() {
    const headingElement = this.#getHeadingElement();
    const contentElement = this.#getContentElement();
    if (!headingElement || !contentElement) return;
    const buttonHeadingId = headingElement.querySelector('.accordion-button').getAttribute('aria-controls');
    const contentId = contentElement.getAttribute('id');
    if (this.hasAttribute('content-id')) {
      this.#updateContentId(this.getAttribute('content-id'));
    } else if (contentId && buttonHeadingId === contentId) {
      return;
    } else if (contentId) {
      this.#updateContentId(contentId);
    } else if (buttonHeadingId) {
      this.#updateContentId(buttonHeadingId);
    } else {
      this.#updateContentId(generateAndVerifyUniqueId('acc'));
    }
  }
  #updateVariant(text, icon) {
    const button = this.#getHeadingElement().querySelector('button.accordion-button');
    if (text && icon) {
      let variantEl = button.querySelector('.accordion-icon');
      if (!variantEl) {
        variantEl = document.createElement('span');
        variantEl.classList.add('accordion-icon');
        button.appendChild(variantEl);
      }
      variantEl.innerHTML = '';
      const textEl = document.createElement('span');
      textEl.classList.add('icon_text');
      textEl.textContent = text;
      variantEl.appendChild(textEl);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('icon-svg');
      svg.setAttribute('focusable', 'false');
      svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttributeNS(null, 'href', `#${icon}`);
      svg.appendChild(use);
      variantEl.appendChild(svg);
    } else if (button.querySelector('.accordion-icon')) {
      button.querySelector('.accordion-icon').remove();
    }
  }

  //Apply all current attributes to the DOM
  //Ensures that attr values take precedence if they conflict with pre-generated HTML.
  #syncAll() {
    if (this.hasAttribute('heading')) {
      this.#updateHeading(this.getAttribute('heading'));
    }
    if (this.hasAttribute('heading-level')) {
      this.#updateHeadingLevel(this.getAttribute('heading-level'));
    }
    this.#updateExpanded(this.getAttribute('expanded'));
    this.#ensureContentId();
    if (this.hasAttribute('variant-text') || this.hasAttribute('variant-icon')) {
      this.#updateVariant(this.getAttribute('variant-text'), this.getAttribute('variant-icon'));
    } else {
      this.#updateVariant('', '');
    }
  }
  #setupObserver() {
    if (this.#accordionObserver) return;
    this.#accordionObserver = new MutationObserver(this.#handleMutations);
    const config = {
      subtree: true,
      childList: true
    };
    this.#accordionObserver.observe(this, config);
  }
  #handleMutations = records => {
    const button = this.#getHeadingElement()?.querySelector('button.accordion-button');
    if (button) {
      button.addEventListener('click', this.#handleAccordionClick, false);
    }
  };

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.#initialized = false;

    /* Set up instance fields for event handling */

    this.#handleAccordionClick = () => {
      this.toggleAccordion();
    };
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    if (this.#initialized) return;
    this.#setupObserver();
    if (this.innerHTML === '') return; // Accordions must have content. If no content is found at all, don't init as some frameworks have experienced problems otherwise.

    const isValid = this.#ensureDOM();
    if (!isValid) return;
    this.#syncAll();
    const button = this.#getHeadingElement()?.querySelector('button.accordion-button');
    if (button) {
      button.addEventListener('click', this.#handleAccordionClick, false);
    }
    this.#initialized = true;
  }
  expandAccordion() {
    this.#setExpandedState(true);
    if (this.getAttribute('expanded') !== 'true') {
      this.setAttribute('expanded', 'true');
    }
    this.dispatchEvent(new CustomEvent('fds-accordion-expanded', {
      bubbles: true
    }));
  }
  collapseAccordion() {
    this.#setExpandedState(false);
    if (this.getAttribute('expanded') !== 'false') {
      this.setAttribute('expanded', 'false');
    }
    this.dispatchEvent(new CustomEvent('fds-accordion-collapsed', {
      bubbles: true
    }));
  }
  toggleAccordion() {
    this.isExpanded() ? this.collapseAccordion() : this.expandAccordion();
  }
  isExpanded() {
    return this.hasAttribute('expanded') && this.getAttribute('expanded') !== 'false';
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.getAttribute('ready') === 'false') return;
    this.init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    const button = this.#getHeadingElement()?.querySelector('button.accordion-button');
    if (button) {
      button.removeEventListener('click', this.#handleAccordionClick, false);
    }
    this.#initialized = false;
    if (this.#accordionObserver) {
      this.#accordionObserver.disconnect();
      this.#accordionObserver = null;
    }
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute === 'ready') {
      if (!this.#initialized && this.isConnected && newValue !== 'false') {
        this.init();
      }
      return;
    }
    if (!this.#initialized) return;
    if (attribute === 'heading') {
      this.#updateHeading(newValue);
    }
    if (attribute === 'heading-level') {
      this.#updateHeadingLevel(newValue);
    }
    if (attribute === 'expanded' && oldValue !== newValue) {
      this.#updateExpanded(newValue);
    }
    if (attribute === 'content-id') {
      if (newValue !== null && newValue !== '') {
        this.#updateContentId(newValue);
      }
    }
    if (attribute === 'variant-text') {
      if (this.hasAttribute('variant-icon')) {
        this.#updateVariant(newValue, this.getAttribute('variant-icon'));
      } else {
        this.#updateVariant(newValue, '');
      }
    }
    if (attribute === 'variant-icon') {
      if (this.hasAttribute('variant-text')) {
        this.#updateVariant(this.getAttribute('variant-text'), newValue);
      } else {
        this.#updateVariant('', newValue);
      }
    }
  }

  // #endregion
}
function registerAccordion() {
  if (customElements.get('fds-accordion') === undefined) {
    window.customElements.define('fds-accordion', FDSAccordion);
  }
}
/* harmony default export */ const fds_accordion = (registerAccordion);
;// ./src/js/web-components/accordion/fds-accordion-group.js
class FDSAccordionGroup extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['heading-level', 'has-bulk-button', 'open-all-text', 'close-all-text'];

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #rendered;
  #listenersAttached;
  #bulkButton;
  #handleBulkClick;
  #handleAccordionExpanded;
  #handleAccordionCollapsed;

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #getBulkButton() {
    if (this.#bulkButton) return this.#bulkButton;
    this.#bulkButton = this.querySelector(':scope > .bulk-button');
    return this.#bulkButton;
  }
  #renderBulkButton() {
    if (!this.#getBulkButton()) {
      const bulkButton = document.createElement('button');
      bulkButton.classList.add('bulk-button');
      this.prepend(bulkButton);
      this.#bulkButton = bulkButton;
    }
  }
  #render() {
    if (this.#rendered) return;
    const hasRenderedBulkButton = this.querySelectorAll('button.bulk-button').length > 0;
    const hasBulkButtonFromAttr = this.getAttribute('has-bulk-button') !== null && this.getAttribute('has-bulk-button') !== 'false';
    if (hasBulkButtonFromAttr && !hasRenderedBulkButton) {
      this.#renderBulkButton();
    }
    this.#updateBulkButtonText();
    this.#rendered = true;
  }
  #getAllAccordions() {
    return Array.from(this.querySelectorAll(':scope > fds-accordion'));
  }
  #areAllExpanded() {
    return this.#getAllAccordions().every(acc => {
      const expandedAttr = acc.getAttribute('expanded');
      if (expandedAttr != null) return expandedAttr === 'true';
      const button = acc.querySelector('button.accordion-button');
      return button?.getAttribute('aria-expanded') === 'true';
    });
  }
  #updateHeadingLevel(headingLevel) {
    const valid = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    if (!valid.includes(headingLevel)) return;
    this.#getAllAccordions().forEach(acc => acc.setAttribute('heading-level', headingLevel));
  }
  #updateHasBulkButton(attrValue) {
    const mustHasBulkButton = attrValue !== null && attrValue !== 'false';
    const hasBulkButton = this.#getBulkButton();
    if (mustHasBulkButton) {
      this.#renderBulkButton();
      this.#getBulkButton()?.removeEventListener('click', this.#handleBulkClick);
      this.#getBulkButton()?.addEventListener('click', this.#handleBulkClick);
    } else if (!mustHasBulkButton && hasBulkButton) {
      this.#getBulkButton()?.removeEventListener('click', this.#handleBulkClick);
      this.#getBulkButton()?.remove();
      this.#bulkButton = null;
    }
    this.#updateBulkButtonText();
  }
  #updateBulkButtonText() {
    const button = this.#getBulkButton();
    if (!button) return;
    const openText = this.getAttribute('open-all-text') || 'Åbn alle';
    const closeText = this.getAttribute('close-all-text') || 'Luk alle';
    const allExpanded = this.#areAllExpanded();
    button.textContent = allExpanded ? closeText : openText;
    allExpanded ? button.classList.add('close') : button.classList.remove('close');
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.#rendered = false;
    this.#listenersAttached = false;
    this.#bulkButton = null;
    this.#handleBulkClick = () => this.toggleAllAccordions();
    this.#handleAccordionExpanded = e => {
      e.stopPropagation();
      this.#updateBulkButtonText();
    };
    this.#handleAccordionCollapsed = e => {
      e.stopPropagation();
      this.#updateBulkButtonText();
    };
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  toggleAllAccordions() {
    const accordions = this.#getAllAccordions();
    const shouldExpandAll = !this.#areAllExpanded();
    const newValue = shouldExpandAll ? 'true' : 'false';
    accordions.forEach(acc => acc.setAttribute('expanded', newValue));
    this.#updateBulkButtonText();
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.#rendered) return;
    this.#render();
    if (this.#listenersAttached) return;
    this.addEventListener('fds-accordion-expanded', this.#handleAccordionExpanded);
    this.addEventListener('fds-accordion-collapsed', this.#handleAccordionCollapsed);
    if (this.#getBulkButton()) {
      this.#getBulkButton().addEventListener('click', this.#handleBulkClick);
    }
    this.#listenersAttached = true;
    if (this.hasAttribute('heading-level')) {
      this.#updateHeadingLevel(this.getAttribute('heading-level'));
    }
    this.#updateBulkButtonText();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#rendered = false;
    if (!this.#listenersAttached) return;
    this.removeEventListener('fds-accordion-expanded', this.#handleAccordionExpanded);
    this.removeEventListener('fds-accordion-collapsed', this.#handleAccordionCollapsed);
    if (this.#getBulkButton()) {
      this.#getBulkButton().removeEventListener('click', this.#handleBulkClick);
    }
    this.#listenersAttached = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#rendered) return;
    if (attribute === 'heading-level') {
      this.#updateHeadingLevel(newValue);
    }
    if (attribute === 'has-bulk-button') {
      this.#updateHasBulkButton(newValue);
    }
    if (attribute === 'open-all-text' || attribute === 'close-all-text') {
      this.#updateBulkButtonText();
    }
  }

  // #endregion
}
function registerAccordionGroup() {
  if (customElements.get('fds-accordion-group') === undefined) {
    window.customElements.define('fds-accordion-group', FDSAccordionGroup);
  }
}
/* harmony default export */ const fds_accordion_group = (registerAccordionGroup);
;// ./src/js/web-components/custom-element-utils.js


/**
 * Configuration object for a MutationObserver.
 * Tracked attributes: `hidden`, `aria-hidden`, `id`, `class`, `disabled`, `required`.
 *
 * @type {MutationObserverInit}
 */
const mutationObserverConfig = {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ['hidden', 'aria-hidden', 'id', 'class', 'disabled', 'required', 'aria-required'],
  attributeOldValue: false,
  characterData: false,
  characterDataOldValue: false
};

/**
 * Associates a label element with an (input) element.
 * If the element lacks an ID, a unique one is generated using the given prefix.
 * If no element is provided, the `for` attribute is removed from the label.
 *
 * @param {HTMLLabelElement} label - The label element to associate.
 * @param {HTMLElement} element - The element to associate the label with.
 * @param {string} prefix - The prefix used when generating a unique ID for the element.
 */
function associateLabelWithElement(label, element, prefix) {
  if (!label) return;
  if (element) {
    if (!element.id) {
      element.id = generateAndVerifyUniqueId(prefix);
    }
    label.htmlFor = element.id;
  } else {
    label.removeAttribute('for');
  }
}

/**
 * Creates an SVG icon element with a single path.
 * The SVG is given a fixed viewBox of '0 -960 960 960'.
 *
 * @param {string} pathD - The `d` attribute value defining the shape of the SVG path.
 * @returns {SVGSVGElement} The constructed SVG element containing the specified path.
 */
function createSvgIcon(pathD) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('viewBox', '0 -960 960 960');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('icon-svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathD);
  svg.appendChild(path);
  return svg;
}

/**
 * Shows or hides a required status indicator in a label element based on the given value.
 * If value is null, the indicator is removed. If value is an empty string, a default
 * text is used based on whether the element is required or not.
 *
 * @param {HTMLLabelElement} label - The label element to update.
 * @param {HTMLElement|HTMLFieldSetElement} element - The form element or fieldset to check for required status.
 * @param {string|null} value - The value to display in the status indicator.
 */
function showRequiredStatus(label, element, value) {
  if (!label || !element) return;
  let statusIndicator = label.querySelector(':scope > span.weight-normal');
  if (value === null && statusIndicator) {
    statusIndicator.remove();
    return;
  }
  if (!statusIndicator) {
    const span = document.createElement('span');
    span.className = 'weight-normal';
    label.appendChild(span);
    statusIndicator = span;
  }
  const isRequired = isElementRequired(element);
  let text = value;
  if (value === '' && isRequired) text = 'skal udfyldes';
  if (value === '' && !isRequired) text = 'frivilligt';
  const nextText = isRequired ? ` (*${text})` : ` (${text})`;
  if (statusIndicator.textContent !== nextText) {
    statusIndicator.textContent = nextText;
  }
}

/**
 * Determines whether a form element or fieldset is considered required.
 * For fieldsets, returns true if any child form element is required.
 *
 * @param {HTMLElement|HTMLFieldSetElement} element - The element to check.
 * @returns {boolean} Whether the element (or any child within a fieldset) is required.
 */
function isElementRequired(element) {
  if (element instanceof HTMLFieldSetElement) {
    const fields = element.querySelectorAll('input, select, textarea');
    return Array.from(fields).some(field => field.hasAttribute('required') || field.hasAttribute('aria-required') && field.getAttribute('aria-required') !== 'false');
  }
  return element.hasAttribute('required') || element.hasAttribute('aria-required') && element.getAttribute('aria-required') !== 'false';
}

/**
 * Notifies the error summary that error messages have been disconnected/removed.
 * The parent wrapper dispatches 'error-message-callback' events for each error message found.
 *
 * @param {HTMLElement} element - The element to query for error messages.
 */
function notifySummaryOnDisconnect(element) {
  if (!document.querySelector('fds-error-summary[auto]')) return;
  element.querySelectorAll('fds-error-message[id]').forEach(errorMessage => {
    document.dispatchEvent(new CustomEvent('error-message-callback', {
      detail: {
        errorId: errorMessage.id,
        isRemoved: true
      }
    }));
  });
}

/**
 * Notifies the error summary of visibility changes in error messages.
 * The parent wrapper dispatches 'error-message-visibility-changed' events for each error message found.
 *
 * @param {HTMLElement} element - The element to query for error messages.
 */
function notifySummaryOnVisibilityChange(element) {
  if (!document.querySelector('fds-error-summary[auto]')) return;
  element.querySelectorAll('fds-error-message[id]').forEach(errorMessage => {
    document.dispatchEvent(new CustomEvent('error-message-visibility-changed', {
      detail: {
        errorId: errorMessage.id
      }
    }));
  });
}

/**
 * Determines whether an element is visible to screen readers.
 *
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} True if the element is visible to screen readers, false otherwise.
 */
function isVisibleToScreenReader(element) {
  return !element.closest('.d-none, [hidden]:not([hidden="false"]), [aria-hidden="true"]');
}

/**
 * Matches the disabled class of a label element to the disabled attribute of a form element.
 *
 * @param {HTMLLabelElement} label - The label element to update.
 * @param {HTMLElement} element - The form element to match the disabled state from.
 */
function setDisabledClass(label, element) {
  if (!label || !element) return;
  label.classList.toggle('disabled', element.hasAttribute('disabled'));
}

/**
 * Sets the `aria-describedby` attribute on a form element or fieldset based on
 * the IDs of visible error messages, help texts, and an optional character limit element.
 *
 * @param {HTMLElement|HTMLFieldSetElement} element - The form element or fieldset to update.
 * @param {NodeList} errorMessages - Error message elements to consider.
 * @param {NodeList} helpTexts - Help text elements to consider.
 * @param {HTMLElement|null} [characterLimit=null] - Optional character limit element to consider.
 */
function setAriaDescribedBy(element, errorMessages, helpTexts) {
  let characterLimit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  if (!element) return;
  const ids = [...errorMessages, ...helpTexts, characterLimit].filter(el => el && el.id && isVisibleToScreenReader(el)).map(el => el.id);
  ids.length > 0 ? element.setAttribute('aria-describedby', ids.join(' ')) : element.removeAttribute('aria-describedby');
}

/**
 * Sets or removes the `aria-invalid` attribute on a form element
 * based on whether any error messages are visible to screen readers.
 *
 * @param {HTMLElement} element - The form element to update.
 * @param {NodeList} errorMessages - Error message elements to evaluate.
 */
function setInvalid(element, errorMessages) {
  if (!element) return;
  const invalid = Array.from(errorMessages).some(el => isVisibleToScreenReader(el));
  invalid ? element.setAttribute('aria-invalid', 'true') : element.removeAttribute('aria-invalid');
}

/**
 * Determines if an element is visible and focusable.
 *
 * @param {HTMLElement} element - The element to check.
 * @returns {boolean} True if the element is visible and focusable, false otherwise.
 */
function isVisibleAndFocusable(element) {
  return element.offsetParent !== null && !element.disabled && element.tabIndex >= 0;
}
;// ./src/js/web-components/input/fds-input.js


class FDSInput extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['show-required-status', 'input-maxwidth'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get showRequiredStatus() {
    return this.getAttribute('show-required-status');
  }
  set showRequiredStatus(value) {
    value === null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #inputObserver = null;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleMutations = records => {
    for (const {
      attributeName,
      target,
      addedNodes,
      removedNodes
    } of records) {
      // A relevant child element was added or removed.
      const relevantTagNames = ['LABEL', 'INPUT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT', 'FDS-CHARACTER-LIMIT'];
      const allNodes = [...addedNodes, ...removedNodes];
      if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
        const label = this.querySelector('label');
        const input = this.querySelector('input');
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');
        const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');
        associateLabelWithElement(label, input, 'inp');
        setAriaDescribedBy(input, errorMessages, helpTexts, characterLimit);
        setInvalid(input, errorMessages);
        if (this.hasAttribute('show-required-status')) {
          showRequiredStatus(label, input, this.getAttribute('show-required-status'));
        }
        break;
      }

      // The input's required attribute changed
      if (attributeName === 'required' && target?.tagName === 'INPUT') {
        if (this.hasAttribute('show-required-status')) {
          const label = this.querySelector('label');
          showRequiredStatus(label, target, this.getAttribute('show-required-status'));
        }
      }
      // Attributes which might affect aria-describedby
      else if (attributeName === 'id' || attributeName === 'hidden' || attributeName === 'aria-hidden' || attributeName === 'class') {
        const label = this.querySelector('label');
        const input = this.querySelector('input');
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');
        const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');
        associateLabelWithElement(label, input, 'inp');
        setAriaDescribedBy(input, errorMessages, helpTexts, characterLimit);
        setInvalid(input, errorMessages);
        if (attributeName === 'hidden' && target === this) {
          notifySummaryOnVisibilityChange(this);
        }
      }
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupObserver() {
    if (this.#inputObserver) return;
    this.#inputObserver = new MutationObserver(this.#handleMutations);
    this.#inputObserver.observe(this, mutationObserverConfig);
  }
  #init() {
    this.#setupObserver();
    const label = this.querySelector('label');
    const input = this.querySelector('input');
    const errorMessages = this.querySelectorAll('fds-error-message');
    const helpTexts = this.querySelectorAll('fds-help-text');
    const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');
    associateLabelWithElement(label, input, 'inp');
    setAriaDescribedBy(input, errorMessages, helpTexts, characterLimit);
    setInvalid(input, errorMessages);
    if (this.hasAttribute('show-required-status')) {
      showRequiredStatus(label, input, this.getAttribute('show-required-status'));
    }
    this.#initialized = true;
  }
  #setMaxwidth(value) {
    const input = this.querySelector('input');
    if (!input) return;
    if (value !== '') {
      const maxwidthClass = [...input.classList].find(cls => cls.startsWith('input-width-') || cls.startsWith('input-char-'));
      input.classList.remove(maxwidthClass);
      if (['xxs', 'xs', 's', 'm', 'l', 'xl'].includes(value)) {
        input.classList.add(`input-width-${value}`);
      } else if (/^\d+$/.test(value)) {
        input.classList.add(`input-char-${value}`);
      }
    }
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.#initialized) {
      this.#init();
    }
    if (this.hasAttribute('input-maxwidth')) {
      this.#setMaxwidth(this.getAttribute('input-maxwidth'));
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    notifySummaryOnDisconnect(this);
    this.#initialized = false;
    if (this.#inputObserver) {
      this.#inputObserver.disconnect();
      this.#inputObserver = null;
    }
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (attribute === 'show-required-status' && oldValue !== newValue) {
      const label = this.querySelector('label');
      const input = this.querySelector('input');
      showRequiredStatus(label, input, newValue);
    }
    if (attribute === 'input-maxwidth' && oldValue !== newValue) {
      if (this.hasAttribute('input-maxwidth')) {
        this.#setMaxwidth(newValue);
      }
      // The attribute has previously been used but has now been removed from the element.
      // Remove all classes set by the attribute from when it was used.
      else {
        const input = this.querySelector('input');
        if (!input) return;
        const maxwidthClass = [...input.classList].find(cls => cls.startsWith('input-width-') || cls.startsWith('input-char-'));
        input.classList.remove(maxwidthClass);
      }
    }
  }

  // #endregion
}
function registerInput() {
  if (customElements.get('fds-input') === undefined) {
    window.customElements.define('fds-input', FDSInput);
  }
}
/* harmony default export */ const fds_input = (registerInput);
;// ./src/js/web-components/help-text/fds-help-text.js

class FDSHelpText extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['id', 'hidden'];

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #rendered;
  #parentWrapper;

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #render() {
    if (this.#rendered) return;
    this.classList.add('help-text');
    this.#rendered = true;
  }
  #shouldBeHidden(hiddenValue) {
    return hiddenValue === 'true' || hiddenValue === '';
  }
  #setAriaHidden() {
    this.setAttribute('aria-hidden', 'true');
  }
  #removeAriaHidden() {
    this.removeAttribute('aria-hidden');
  }
  #notifyParent() {
    this.#parentWrapper?.dispatchEvent(new CustomEvent('help-text-visibility-changed', {
      bubbles: true,
      detail: {
        helptextId: this.id,
        isHidden: this.#shouldBeHidden(this.getAttribute('hidden'))
      }
    }));
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.#rendered = false;
    this.#parentWrapper = null;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.#rendered) return;
    this.#render();
    if (!this.id) {
      this.id = generateAndVerifyUniqueId('help');
    }

    // Handle initial hidden state
    if (this.#shouldBeHidden(this.getAttribute('hidden'))) {
      this.#setAriaHidden();
    }

    // During disconnect, the custom element may lose connection to the wrapper.
    // Save the wrapper and use it to dispatch events - otherwise, the events may be lost.
    this.#parentWrapper = this.closest('fds-input, fds-checkbox, fds-checkbox-group, fds-radio-button, fds-radio-button-group, fds-date-input, fds-multiselect');
    this.#parentWrapper?.dispatchEvent(new Event('help-text-callback'));
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#parentWrapper?.dispatchEvent(new Event('help-text-callback'));
    this.#parentWrapper = null;
    this.#rendered = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#rendered) return;
    if (attribute === 'hidden' && oldValue !== newValue) {
      if (this.#shouldBeHidden(newValue)) {
        this.#setAriaHidden();
      } else {
        this.#removeAriaHidden();
      }
      this.#notifyParent();
    }
    this.#parentWrapper?.dispatchEvent(new Event('help-text-callback'));
  }

  // #endregion
}
function registerHelpText() {
  if (customElements.get('fds-help-text') === undefined) {
    window.customElements.define('fds-help-text', FDSHelpText);
  }
}
/* harmony default export */ const fds_help_text = (registerHelpText);
;// ./src/js/web-components/character-limit/fds-character-limit.js

class FDSCharacterLimit extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['limit', 'one-character-remaining-text', 'several-characters-remaining-text', 'one-character-too-many-text', 'several-characters-too-many-text', 'max-limit-text', 'limit-id'];

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #messages = {
    'one_character_remaining': "Du har {value} tegn tilbage",
    'several_characters_remaining': "Du har {value} tegn tilbage",
    'one_character_too_many': "Du har {value} tegn for meget",
    'several_characters_too_many': "Du har {value} tegn for meget",
    'max_limit': "Du kan indtaste op til {value} tegn"
  };
  #spanSrMaxLimit = (() => document.createElement('span'))();
  #spanSrUpdate = (() => document.createElement('span'))();
  #spanVisualUpdate = (() => document.createElement('span'))();
  #parentWrapper = null;
  #field = null;
  #intervalID = null;
  #lastKeyUpTimestamp = null;
  #oldValue = null;
  #forceSRUpdate = false;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleKeyUp = event => {
    // Update the visible message immediately
    this.#updateVisibleMessage(this.#charactersLeft());

    // Safe the timestamp so the SR message won't update until the user has stopped typing
    this.#lastKeyUpTimestamp = Date.now();

    // The user typed something so the SR message must be updated
    this.#forceSRUpdate = true;
  };
  #handleFocus = event => {
    // Clear any previous timers
    if (this.#intervalID !== null) {
      window.clearInterval(this.#intervalID);
      this.#intervalID = null;
    }
    if (!this.#field) return;
    this.#spanVisualUpdate.setAttribute('aria-hidden', 'true');
    this.#spanSrUpdate.setAttribute('aria-hidden', 'false');

    // Set a timer to prevent SR users from being spammed with audio notifications while typing
    this.#intervalID = window.setInterval(() => {
      if (!this.#lastKeyUpTimestamp || Date.now() - 500 >= this.#lastKeyUpTimestamp) {
        const inputValueChanged = this.#oldValue !== this.#field.value;
        const messageInconsistency = this.#spanSrUpdate.textContent !== this.#spanVisualUpdate.textContent;
        if (inputValueChanged || messageInconsistency || this.#forceSRUpdate) {
          this.#forceSRUpdate = false;
          this.#oldValue = this.#field.value;
          this.#updateMessages(this.#charactersLeft());
        }
      }
    }, 1000);
  };
  #handleBlur = event => {
    // Stop the input timer
    if (this.#intervalID !== null) {
      window.clearInterval(this.#intervalID);
      this.#intervalID = null;
    }
    if (!this.#field) return;
    this.#updateVisibleMessage(this.#charactersLeft());
    this.#spanSrUpdate.textContent = '';
    this.#spanSrUpdate.setAttribute('aria-hidden', 'true');
    this.#spanVisualUpdate.setAttribute('aria-hidden', 'false');
  };
  #handlePageshow = event => {
    this.#updateVisibleMessage(this.#charactersLeft());
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #charactersLeft() {
    if (!this.#field) return;
    const parsedLimit = parseInt(this.getAttribute('limit'), 10);
    if (!Number.isNaN(parsedLimit)) {
      return parsedLimit - this.#field.value.length;
    } else {
      return null;
    }
  }
  #getMessage(charactersLeft) {
    let msg = '';
    if (charactersLeft === -1) {
      const exceeded = Math.abs(charactersLeft);
      msg = this.#messages.one_character_too_many.replace(/{value}/, exceeded);
    } else if (charactersLeft === 1) {
      msg = this.#messages.one_character_remaining.replace(/{value}/, charactersLeft);
    } else if (charactersLeft >= 0) {
      msg = this.#messages.several_characters_remaining.replace(/{value}/, charactersLeft);
    } else {
      const exceeded = Math.abs(charactersLeft);
      msg = this.#messages.several_characters_too_many.replace(/{value}/, exceeded);
    }
    return msg;
  }
  #updateVisibleMessage(charactersLeft) {
    this.#spanVisualUpdate.textContent = this.#getMessage(charactersLeft);
    if (charactersLeft < 0) {
      this.#spanVisualUpdate.classList.add('limit-exceeded');
    } else {
      this.#spanVisualUpdate.classList.remove('limit-exceeded');
    }
  }
  #updateSRMessage(charactersLeft) {
    this.#spanSrUpdate.textContent = this.#getMessage(charactersLeft);
  }
  #updateMessages(charactersLeft) {
    this.#updateVisibleMessage(charactersLeft);
    this.#updateSRMessage(charactersLeft);
  }
  #updateId(value) {
    if (value) {
      this.#spanSrMaxLimit.id = value;
    } else {
      this.#spanSrMaxLimit.id = generateAndVerifyUniqueId('lim');
    }
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.hasAttribute('limit')) return;
    if (this.children.length === 3) {
      const [spanSrMaxLimit, spanSrUpdate, spanVisualUpdate] = this.children;
      this.#spanSrMaxLimit = spanSrMaxLimit;
      this.#spanSrUpdate = spanSrUpdate;
      this.#spanVisualUpdate = spanVisualUpdate;
    } else {
      this.appendChild(this.#spanSrMaxLimit);
      this.appendChild(this.#spanSrUpdate);
      this.appendChild(this.#spanVisualUpdate);
    }
    this.#parentWrapper = this.closest('fds-input, fds-textarea');
    this.#field = this.#parentWrapper?.querySelector('input, textarea');
    if (!this.#field) return;
    const charactersLeft = this.#charactersLeft();

    // Update the default text used in the component
    if (this.hasAttribute('one-character-remaining-text')) {
      this.#messages.one_character_remaining = this.getAttribute('one-character-remaining-text');
    }
    if (this.hasAttribute('several-characters-remaining-text')) {
      this.#messages.several_characters_remaining = this.getAttribute('several-characters-remaining-text');
    }
    if (this.hasAttribute('one-character-too-many-text')) {
      this.#messages.one_character_too_many = this.getAttribute('one-character-too-many-text');
    }
    if (this.hasAttribute('several-characters-too-many-text')) {
      this.#messages.several_characters_too_many = this.getAttribute('several-characters-too-many-text');
    }
    if (this.hasAttribute('max-limit-text')) {
      this.#messages.max_limit = this.getAttribute('max-limit-text');
    }

    // <span> announcing the max limit to SR users
    this.#spanSrMaxLimit.classList.add('sr-only');
    this.#spanSrMaxLimit.textContent = this.#messages.max_limit.replace(/{value}/, this.getAttribute('limit'));
    if (!this.hasAttribute('limit-id') && this.getAttribute('limit-id') !== '') {
      this.#spanSrMaxLimit.id = generateAndVerifyUniqueId('lim');
    } else {
      this.#spanSrMaxLimit.id = this.getAttribute('limit-id');
    }

    // <span> visually showing the characters left
    this.#spanVisualUpdate.classList.add('visual-message');
    this.#spanVisualUpdate.setAttribute('aria-hidden', 'false');
    this.#spanVisualUpdate.textContent = this.#getMessage(charactersLeft);

    // <span> announcing characters left to SR users (updates are slightly delayed compared to the visual message)
    this.#spanSrUpdate.classList.add('sr-only');
    this.#spanSrUpdate.textContent = '';
    this.#spanSrUpdate.setAttribute('aria-hidden', true);
    this.#spanSrUpdate.setAttribute('aria-live', 'polite');

    // Add event listeners
    this.#field.addEventListener('keyup', this.#handleKeyUp);
    this.#field.addEventListener('focus', this.#handleFocus);
    this.#field.addEventListener('blur', this.#handleBlur);
    if ('onpageshow' in window) {
      window.addEventListener('pageshow', this.#handlePageshow);
    } else {
      document.addEventListener('DOMContentLoaded', this.#handlePageshow);
    }
    this.#initialized = true;
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#field?.removeEventListener('keyup', this.#handleKeyUp);
    this.#field?.removeEventListener('focus', this.#handleFocus);
    this.#field?.removeEventListener('blur', this.#handleBlur);
    window.removeEventListener('pageshow', this.#handlePageshow);
    document.removeEventListener('DOMContentLoaded', this.#handlePageshow);
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (attribute === 'limit') {
      this.#updateMessages(this.#charactersLeft());
    }
    if (attribute === 'one-character-remaining-text') {
      this.#messages.one_character_remaining = newValue;
      this.#updateMessages(this.#charactersLeft());
    }
    if (attribute === 'several-characters-remaining-text') {
      this.#messages.several_characters_remaining = newValue;
      this.#updateMessages(this.#charactersLeft());
    }
    if (attribute === 'one-character-too-many-text') {
      this.#messages.one_character_too_many = newValue;
      this.#updateMessages(this.#charactersLeft());
    }
    if (attribute === 'several-characters-too-many-text') {
      this.#messages.several_characters_too_many = newValue;
      this.#updateMessages(this.#charactersLeft());
    }
    if (attribute === 'max-limit-text') {
      this.#messages.max_limit = newValue;
      this.#updateMessages(this.#charactersLeft());
    }
    if (attribute === 'limit-id') {
      this.#updateId(newValue);
    }
    this.#parentWrapper?.dispatchEvent(new Event('character-limit-callback'));
  }

  // #endregion
}
function registerCharacterLimit() {
  if (customElements.get('fds-character-limit') === undefined) {
    window.customElements.define('fds-character-limit', FDSCharacterLimit);
  }
}
/* harmony default export */ const fds_character_limit = (registerCharacterLimit);
;// ./src/js/web-components/error-message/fds-error-message.js

class FDSErrorMessage extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['id', 'icon-text', 'hidden', 'targets', 'message'];

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #rendered;
  #iconText;
  #parentWrapper;

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #render() {
    if (this.#rendered) return;
    const hasElements = this.children.length > 0;
    if (!hasElements) {
      const iconText = this.getAttribute('icon-text');
      if (iconText !== null && iconText !== '') {
        this.#iconText = iconText;
      }
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('icon-svg', 'alert-icon');
      svg.setAttribute('aria-label', this.#iconText);
      svg.setAttribute('focusable', 'false');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#error');
      svg.appendChild(use);
      const visibleMessage = document.createElement('span');
      visibleMessage.classList.add('visible-message');
      visibleMessage.textContent = this.getAttribute('message') || this.textContent;
      this.textContent = '';
      this.appendChild(svg);
      this.appendChild(visibleMessage);
    }
    this.#rendered = true;
  }
  #shouldBeHidden(hiddenValue) {
    return hiddenValue === 'true' || hiddenValue === '';
  }
  #notifyParent() {
    this.#parentWrapper?.dispatchEvent(new CustomEvent('error-message-visibility-changed', {
      bubbles: true,
      detail: {
        errorId: this.id,
        targets: this.getTargets(),
        isHidden: this.#shouldBeHidden(this.getAttribute('hidden'))
      }
    }));
  }
  #dispatchErrorMessageCallback() {
    if (!this.#parentWrapper) return;
    this.#parentWrapper.dispatchEvent(new CustomEvent('error-message-callback', {
      bubbles: true,
      detail: {
        errorId: this.id,
        isHidden: this.#shouldBeHidden(this.getAttribute('hidden')),
        targets: this.getTargets()
      }
    }));
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.#rendered = false;
    this.#iconText = 'Fejl';
    this.#parentWrapper = null;
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  getTargets() {
    const targets = this.getAttribute('targets');
    if (!targets) return [];
    return targets.split(',').map(target => target.trim()).filter(target => target);
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.#rendered) return;
    this.#render();
    if (!this.id) {
      this.id = generateAndVerifyUniqueId('error');
    }

    // Save reference to parent wrapper
    this.#parentWrapper = this.closest('fds-input, fds-checkbox, fds-checkbox-group, fds-radio-button-group, fds-date-input, fds-textarea, fds-select, fds-date-picker, fds-multiselect');
    this.#dispatchErrorMessageCallback();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#parentWrapper?.dispatchEvent(new CustomEvent('error-message-callback', {
      bubbles: true,
      detail: {
        errorId: this.id,
        targets: this.getTargets()
      }
    }));
    this.#parentWrapper = null;
    this.#rendered = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#rendered) return;
    if (attribute === 'icon-text' && oldValue !== newValue) {
      this.#iconText = newValue;
      this.querySelector(':scope > .alert-icon').setAttribute('aria-label', this.#iconText);
    }
    if (attribute === 'hidden' && oldValue !== newValue) {
      this.#notifyParent();
    }
    if (attribute === 'message' && oldValue !== newValue) {
      this.querySelector(':scope > .visible-message').textContent = newValue;
    }
    this.#dispatchErrorMessageCallback();
  }

  // #endregion
}
function registerErrorMessage() {
  if (customElements.get('fds-error-message') === undefined) {
    window.customElements.define('fds-error-message', FDSErrorMessage);
  }
}
/* harmony default export */ const fds_error_message = (registerErrorMessage);
;// ./src/js/web-components/checkbox/fds-checkbox.js


class FDSCheckbox extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['show-required-status', 'ready'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get showRequiredStatus() {
    return this.getAttribute('show-required-status');
  }
  set showRequiredStatus(value) {
    value === null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #checkboxObserver = null;
  #input;
  #label;
  #onInputChange;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleMutations = records => {
    for (const {
      attributeName,
      target,
      addedNodes,
      removedNodes
    } of records) {
      const relevantTagNames = ['LABEL', 'INPUT', 'FDS-HELP-TEXT', 'FDS-ERROR-MESSAGE'];
      const allNodes = [...addedNodes, ...removedNodes];
      if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
        this.#input = this.#getInputElement();
        this.#label = this.#getLabelElement();
        this.#setClasses();
        setDisabledClass(this.#label, this.#input);
        this.#updateAccessibilityState();
        if (this.hasAttribute('show-required-status')) {
          showRequiredStatus(this.#label, this.#input, this.getAttribute('show-required-status'));
        }
        break;
      }
      if (attributeName === 'disabled' && target === this.#getInputElement()) {
        setDisabledClass(this.#getLabelElement(), target);
      } else if ((attributeName === 'required' || attributeName === 'aria-required') && target === this.#getInputElement()) {
        if (this.hasAttribute('show-required-status')) {
          showRequiredStatus(this.#getLabelElement(), target, this.getAttribute('show-required-status'));
        }
      } else if (attributeName === 'id' || attributeName === 'hidden' || attributeName === 'aria-hidden' || attributeName === 'class' && target?.tagName !== 'LABEL') {
        this.#updateAccessibilityState();
        if (attributeName === 'hidden' && target === this) {
          notifySummaryOnVisibilityChange(this);
        }
      }
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #getInputElement() {
    return this.querySelector(':scope > input[type="checkbox"]');
  }
  #getLabelElement() {
    return this.querySelector(':scope > label');
  }
  #getHelpTextElements() {
    return this.querySelectorAll(':scope > fds-help-text');
  }
  #getErrorMessages() {
    return this.querySelectorAll(':scope > fds-error-message');
  }
  #setupObserver() {
    if (this.#checkboxObserver) return;
    this.#checkboxObserver = new MutationObserver(this.#handleMutations);
    this.#checkboxObserver.observe(this, mutationObserverConfig);
  }
  #updateAccessibilityState() {
    const label = this.#getLabelElement();
    const input = this.#getInputElement();
    const errorMessages = this.#getErrorMessages();
    const helpTexts = this.#getHelpTextElements();
    associateLabelWithElement(label, input, 'chk');
    setAriaDescribedBy(input, errorMessages, helpTexts);
    setInvalid(input, errorMessages);
  }
  #setClasses() {
    if (!this.#label || !this.#input) return;
    this.#label.classList.add('form-label');
    this.#input.classList.add('form-checkbox');
  }

  /* Collapsible content */

  #handleCollapsibleCheckboxes() {
    const input = this.#input;
    const possibleContent = this.querySelector(':scope > div.checkbox-content');
    if (!input || !possibleContent) return;

    // Ensure the div has the expected classes
    possibleContent.classList.add('checkbox-content');

    // Ensure the content has an ID
    if (!possibleContent.id) {
      possibleContent.id = generateAndVerifyUniqueId('exp');
    }
    const updateState = () => {
      const expanded = input.checked;
      input.setAttribute('data-aria-controls', possibleContent.id);
      input.setAttribute('data-aria-expanded', String(expanded));
      possibleContent.setAttribute('aria-hidden', String(!expanded));
      possibleContent.classList.toggle('collapsed', !expanded);
    };
    if (this.#onInputChange) {
      input.removeEventListener('change', this.#onInputChange);
    }
    this.#onInputChange = updateState;
    updateState();
    input.addEventListener('change', this.#onInputChange);
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    this.#input = this.#getInputElement();
    this.#label = this.#getLabelElement();
    this.#setClasses();
    setDisabledClass(this.#label, this.#input);
    this.#updateAccessibilityState();
    if (this.hasAttribute('show-required-status')) {
      showRequiredStatus(this.#label, this.#input, this.getAttribute('show-required-status'));
    }
    this.#handleCollapsibleCheckboxes();
    this.#setupObserver();
    this.#initialized = true;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.getAttribute('ready') === 'false') return;
    if (!this.#initialized) {
      this.init();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    notifySummaryOnDisconnect(this);
    if (this.#input) {
      this.#input.removeEventListener('change', this.#onInputChange);
    }
    this.#initialized = false;
    if (this.#checkboxObserver) {
      this.#checkboxObserver.disconnect();
      this.#checkboxObserver = null;
    }
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute === 'ready') {
      if (!this.#initialized && this.isConnected && newValue === 'true') {
        this.init();
      }
      return;
    }
    if (!this.#initialized) return;
    if (attribute === 'show-required-status' && oldValue !== newValue) {
      const label = this.#getLabelElement();
      const input = this.#getInputElement();
      showRequiredStatus(label, input, newValue);
    }
  }

  // #endregion
}
function registerCheckbox() {
  if (customElements.get('fds-checkbox') === undefined) {
    window.customElements.define('fds-checkbox', FDSCheckbox);
  }
}
/* harmony default export */ const fds_checkbox = (registerCheckbox);
;// ./src/js/web-components/checkbox/fds-checkbox-group.js

class FDSCheckboxGroup extends HTMLElement {
  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #checkboxGroupObserver = null;
  #fieldset;
  #legend;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleMutations = records => {
    for (const {
      attributeName,
      target,
      addedNodes,
      removedNodes
    } of records) {
      const relevantTagNames = ['FIELDSET', 'LEGEND', 'FDS-HELP-TEXT', 'FDS-ERROR-MESSAGE'];
      const allNodes = [...addedNodes, ...removedNodes];
      if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
        this.#fieldset = this.#getFieldsetElement();
        this.#legend = this.#getLegendElement();
        this.#setClasses();
        this.#setDisabledClass();
        this.#updateAccessibilityState();
        break;
      }
      if (attributeName === 'disabled' && target === this.#getFieldsetElement()) {
        target.classList.toggle('disabled', target.hasAttribute('disabled'));
      } else if (attributeName === 'id' || attributeName === 'hidden' || attributeName === 'aria-hidden' || attributeName === 'class' && !['LEGEND', 'FIELDSET'].includes(target?.tagName)) {
        this.#updateAccessibilityState();
        if (attributeName === 'hidden' && target === this) {
          notifySummaryOnVisibilityChange(this);
        }
      }
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #getFieldsetElement() {
    return this.querySelector('fieldset');
  }
  #getLegendElement() {
    return this.querySelector(':scope > fieldset > legend');
  }
  #getGroupHelpTexts() {
    return this.querySelectorAll(':scope > fieldset > fds-help-text');
  }
  #getErrorMessages() {
    return this.querySelectorAll(':scope > fieldset > fds-error-message');
  }
  #setupObserver() {
    if (this.#checkboxGroupObserver) return;
    this.#checkboxGroupObserver = new MutationObserver(this.#handleMutations);
    this.#checkboxGroupObserver.observe(this, mutationObserverConfig);
  }
  #updateAccessibilityState() {
    const fieldset = this.#getFieldsetElement();
    const errorMessages = this.#getErrorMessages();
    const helpTexts = this.#getGroupHelpTexts();
    setAriaDescribedBy(fieldset, errorMessages, helpTexts);
  }
  #setClasses() {
    this.#legend?.classList.add('form-label');
  }
  #setDisabledClass() {
    const fieldset = this.#getFieldsetElement();
    if (!fieldset) return;
    fieldset.classList.toggle('disabled', fieldset.hasAttribute('disabled'));
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    this.#fieldset = this.#getFieldsetElement();
    this.#legend = this.#getLegendElement();
    this.#setClasses();
    this.#setDisabledClass();
    this.#updateAccessibilityState();
    this.#setupObserver();
    this.#initialized = true;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.#initialized) {
      this.init();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    notifySummaryOnDisconnect(this);
    this.#initialized = false;
    if (this.#checkboxGroupObserver) {
      this.#checkboxGroupObserver.disconnect();
      this.#checkboxGroupObserver = null;
    }
  }

  // #endregion
}
function registerCheckboxGroup() {
  if (!customElements.get('fds-checkbox-group')) {
    customElements.define('fds-checkbox-group', FDSCheckboxGroup);
  }
}
/* harmony default export */ const fds_checkbox_group = (registerCheckboxGroup);
;// ./src/js/web-components/radio-button/fds-radio-button.js


class FDSRadioButton extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['ready'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get checked() {
    return this.#input?.checked ?? false;
  }
  set checked(value) {
    if (!this.#input) return;
    this.#input.checked = Boolean(value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #radioButtonObserver = null;
  #input;
  #label;
  #onInputChange;
  #updateExpandableContent;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleMutations = records => {
    for (const {
      attributeName,
      target,
      addedNodes,
      removedNodes
    } of records) {
      const relevantTagNames = ['LABEL', 'INPUT', 'FDS-HELP-TEXT'];
      const allNodes = [...addedNodes, ...removedNodes];
      if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
        this.#input = this.#getInputElement();
        this.#label = this.#getLabelElement();
        this.#setClasses();
        setDisabledClass(this.#label, this.#input);
        this.#updateAccessibilityState();
        break;
      }
      if (attributeName === 'disabled' && target === this.#getInputElement()) {
        setDisabledClass(this.#getLabelElement(), target);
      } else if (attributeName === 'id' || attributeName === 'hidden' || attributeName === 'aria-hidden' || attributeName === 'class' && target?.tagName !== 'LABEL') {
        this.#updateAccessibilityState();
      }
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #getInputElement() {
    return this.querySelector(':scope > input[type="radio"]');
  }
  #getLabelElement() {
    return this.querySelector(':scope > label');
  }
  #getHelpTextElements() {
    return this.querySelectorAll(':scope > fds-help-text');
  }
  #setupObserver() {
    if (this.#radioButtonObserver) return;
    this.#radioButtonObserver = new MutationObserver(this.#handleMutations);
    this.#radioButtonObserver.observe(this, mutationObserverConfig);
  }
  #updateAccessibilityState() {
    const label = this.#getLabelElement();
    const input = this.#getInputElement();
    const helpTexts = this.#getHelpTextElements();
    associateLabelWithElement(label, input, 'rad');
    setAriaDescribedBy(input, [], helpTexts);
  }
  #setClasses() {
    if (!this.#label || !this.#input) return;
    this.#label.classList.add('form-label');
    this.#input.classList.add('form-radio');
  }
  #handleCollapsibleContent() {
    const input = this.#input;
    const possibleContent = this.querySelector(':scope > div.radio-content');
    if (!input || !possibleContent) return;
    possibleContent.classList.add('radio-content');
    if (!possibleContent.id) {
      possibleContent.id = generateAndVerifyUniqueId('exp');
    }
    const updateState = () => {
      const expanded = input.checked;
      input.setAttribute('data-aria-controls', possibleContent.id);
      input.setAttribute('data-aria-expanded', String(expanded));
      possibleContent.setAttribute('aria-hidden', String(!expanded));
      possibleContent.classList.toggle('collapsed', !expanded);
    };
    this.#updateExpandableContent = updateState;
    updateState();
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  collapseContent() {
    const content = this.querySelector(':scope > div.radio-content');
    if (content && this.#input) {
      this.#input.setAttribute('data-aria-expanded', 'false');
      content.setAttribute('aria-hidden', 'true');
      content.classList.add('collapsed');
    }
  }
  init() {
    this.#input = this.#getInputElement();
    this.#label = this.#getLabelElement();
    this.#setClasses();
    setDisabledClass(this.#label, this.#input);
    this.#updateAccessibilityState();
    this.#handleCollapsibleContent();
    if (this.#input) {
      if (this.#onInputChange) {
        this.#input.removeEventListener('change', this.#onInputChange);
      }
      this.#onInputChange = () => {
        this.#updateExpandableContent?.();
        this.dispatchEvent(new CustomEvent('radio-changed', {
          detail: {
            checked: this.#input.checked
          },
          bubbles: true
        }));
      };
      this.#input.addEventListener('change', this.#onInputChange);
    }
    this.#setupObserver();
    this.#initialized = true;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.getAttribute('ready') === 'false') return;
    if (!this.#initialized) {
      this.init();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    if (this.#input) {
      this.#input.removeEventListener('change', this.#onInputChange);
    }
    this.#initialized = false;
    if (this.#radioButtonObserver) {
      this.#radioButtonObserver.disconnect();
      this.#radioButtonObserver = null;
    }
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute === 'ready') {
      if (!this.#initialized && this.isConnected && newValue === 'true') {
        this.init();
      }
      return;
    }
  }

  // #endregion
}
function registerRadioButton() {
  if (customElements.get('fds-radio-button') === undefined) {
    window.customElements.define('fds-radio-button', FDSRadioButton);
  }
}
/* harmony default export */ const fds_radio_button = (registerRadioButton);
;// ./src/js/web-components/radio-button/fds-radio-button-group.js

class FDSRadioButtonGroup extends HTMLElement {
  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #mutationObserver = null;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleRadioChange = event => {
    const changedRadioButton = event.target.closest('fds-radio-button');
    if (event.detail.checked) {
      const allRadios = this.querySelectorAll('fds-radio-button');
      allRadios.forEach(radio => {
        if (radio !== changedRadioButton) {
          radio.collapseContent?.();
        }
      });
    }
  };
  #handleMutations = records => {
    for (const {
      attributeName,
      target,
      addedNodes,
      removedNodes
    } of records) {
      const relevantTagNames = ['FIELDSET', 'LEGEND', 'FDS-HELP-TEXT', 'FDS-ERROR-MESSAGE'];
      const allNodes = [...addedNodes, ...removedNodes];
      if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
        this.#updateAriaDescribedBy();
        break;
      }
      if (attributeName === 'id' || attributeName === 'hidden' || attributeName === 'aria-hidden' || attributeName === 'class' && !['LEGEND', 'FIELDSET'].includes(target?.tagName)) {
        this.#updateAriaDescribedBy();
        if (attributeName === 'hidden' && target === this) {
          notifySummaryOnVisibilityChange(this);
        }
      }
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #updateAriaDescribedBy() {
    const fieldset = this.querySelector('fieldset');
    const errorMessages = this.querySelectorAll(':scope > fieldset > fds-error-message');
    const helpTexts = this.querySelectorAll(':scope > fieldset > fds-help-text');
    setAriaDescribedBy(fieldset, errorMessages, helpTexts);
  }
  #addEventListener() {
    this.addEventListener('radio-changed', this.#handleRadioChange);
  }
  #removeEventListener() {
    this.removeEventListener('radio-changed', this.#handleRadioChange);
  }
  #connectMutationObserver() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mutationObserverConfig;
    if (this.#mutationObserver) return;
    this.#mutationObserver = new MutationObserver(this.#handleMutations);
    this.#mutationObserver.observe(this, config);
  }
  #disconnectMutationObserver() {
    if (this.#mutationObserver) {
      this.#mutationObserver.disconnect();
      this.#mutationObserver = null;
    }
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    this.#updateAriaDescribedBy();
    this.#addEventListener();
    this.#connectMutationObserver();
    this.#initialized = true;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.#initialized) {
      this.init();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    notifySummaryOnDisconnect(this);
    this.#removeEventListener();
    this.#disconnectMutationObserver();
    this.#initialized = false;
  }

  // #endregion
}
function registerRadioButtonGroup() {
  if (customElements.get('fds-radio-button-group') === undefined) {
    window.customElements.define('fds-radio-button-group', FDSRadioButtonGroup);
  }
}
/* harmony default export */ const fds_radio_button_group = (registerRadioButtonGroup);
;// ./src/js/web-components/date-input/fds-date-input.js

class FDSDateInput extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['show-required-status', 'input-readonly', 'input-required', 'legend', 'input-id'];

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #mutationObserver = null;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleMutations = records => {
    for (const {
      attributeName,
      target,
      addedNodes,
      removedNodes
    } of records) {
      // A relevant child element was added or removed.
      const relevantTagNames = ['LABEL', 'INPUT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
      const allNodes = [...addedNodes, ...removedNodes];
      if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
        const legend = this.querySelector('legend');
        const fieldset = this.querySelector('fieldset');
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');
        const label_day = this.querySelector('[data-attribute="day"] label');
        const label_month = this.querySelector('[data-attribute="month"] label');
        const label_year = this.querySelector('[data-attribute="year"] label');
        const input_day = this.querySelector('[data-attribute="day"] input');
        const input_month = this.querySelector('[data-attribute="month"] input');
        const input_year = this.querySelector('[data-attribute="year"] input');
        associateLabelWithElement(label_day, input_day, 'day');
        associateLabelWithElement(label_month, input_month, 'month');
        associateLabelWithElement(label_year, input_year, 'year');
        setAriaDescribedBy(fieldset, errorMessages, helpTexts);
        this.#setInvalidForInput('day', input_day, errorMessages);
        this.#setInvalidForInput('month', input_month, errorMessages);
        this.#setInvalidForInput('year', input_year, errorMessages);
        if (this.hasAttribute('show-required-status')) {
          showRequiredStatus(legend, fieldset, this.getAttribute('show-required-status'));
        }
        break;
      }

      // The input's required attribute changed
      if (attributeName === 'required' && target?.tagName === 'INPUT') {
        if (this.hasAttribute('show-required-status')) {
          const legend = this.querySelector('legend');
          const fieldset = this.querySelector('fieldset');
          showRequiredStatus(legend, fieldset, this.getAttribute('show-required-status'));
        }
      }
      // Attributes which might affect aria-describedby
      else if (attributeName === 'id' || attributeName === 'hidden' || attributeName === 'aria-hidden' || attributeName === 'class' || attributeName === 'targets') {
        const legend = this.querySelector('legend');
        const fieldset = this.querySelector('fieldset');
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');
        const label_day = this.querySelector('[data-attribute="day"] label');
        const label_month = this.querySelector('[data-attribute="month"] label');
        const label_year = this.querySelector('[data-attribute="year"] label');
        const input_day = this.querySelector('[data-attribute="day"] input');
        const input_month = this.querySelector('[data-attribute="month"] input');
        const input_year = this.querySelector('[data-attribute="year"] input');
        associateLabelWithElement(label_day, input_day, 'day');
        associateLabelWithElement(label_month, input_month, 'month');
        associateLabelWithElement(label_year, input_year, 'year');
        setAriaDescribedBy(fieldset, errorMessages, helpTexts);
        this.#setInvalidForInput('day', input_day, errorMessages);
        this.#setInvalidForInput('month', input_month, errorMessages);
        this.#setInvalidForInput('year', input_year, errorMessages);
        if (attributeName === 'hidden' && target === this) {
          notifySummaryOnVisibilityChange(this);
        }
      }
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    // Fieldset
    let fieldset = this.querySelector('fieldset');
    if (fieldset === null) {
      fieldset = document.createElement('fieldset');
      this.appendChild(fieldset);
    }

    // Legend
    let legend = fieldset.querySelector('legend');
    if (legend === null) {
      legend = document.createElement('legend');
      fieldset.appendChild(legend);
    }
    if (legend.textContent === '') {
      legend.textContent = 'Indtast dato';
    }

    // Div wrapper
    let divWrapper = fieldset.querySelector(':scope > div');
    if (divWrapper === null) {
      divWrapper = document.createElement('div');
      fieldset.appendChild(divWrapper);
    }

    // Div for day input
    let divDay = divWrapper.querySelector('[data-attribute="day"]');
    if (divDay === null) {
      divDay = document.createElement('div');
      divDay.setAttribute('data-attribute', 'day');
      divWrapper.appendChild(divDay);
    }

    // Div for month input
    let divMonth = divWrapper.querySelector('[data-attribute="month"]');
    if (divMonth === null) {
      divMonth = document.createElement('div');
      divMonth.setAttribute('data-attribute', 'month');
      divWrapper.appendChild(divMonth);
    }

    // Div for year input
    let divYear = divWrapper.querySelector('[data-attribute="year"]');
    if (divYear === null) {
      divYear = document.createElement('div');
      divYear.setAttribute('data-attribute', 'year');
      divWrapper.appendChild(divYear);
    }

    // Day label
    let labelDay = divDay.querySelector('label');
    if (labelDay === null) {
      labelDay = document.createElement('label');
      divDay.appendChild(labelDay);
    }
    if (labelDay.textContent === '') {
      labelDay.textContent = 'Dag';
    }

    // Day input
    let inputDay = divDay.querySelector('input');
    if (inputDay === null) {
      inputDay = document.createElement('input');
      divDay.appendChild(inputDay);
    }
    if (!inputDay.hasAttribute('name')) {
      inputDay.setAttribute('name', 'day');
    }
    if (!inputDay.hasAttribute('type')) {
      inputDay.setAttribute('type', 'number');
    }

    // Month label
    let labelMonth = divMonth.querySelector('label');
    if (labelMonth === null) {
      labelMonth = document.createElement('label');
      divMonth.appendChild(labelMonth);
    }
    if (labelMonth.textContent === '') {
      labelMonth.textContent = 'Måned';
    }

    // Month input
    let inputMonth = divMonth.querySelector('input');
    if (inputMonth === null) {
      inputMonth = document.createElement('input');
      divMonth.appendChild(inputMonth);
    }
    if (!inputMonth.hasAttribute('name')) {
      inputMonth.setAttribute('name', 'month');
    }
    if (!inputMonth.hasAttribute('type')) {
      inputMonth.setAttribute('type', 'number');
    }

    // Year label
    let labelYear = divYear.querySelector('label');
    if (labelYear === null) {
      labelYear = document.createElement('label');
      divYear.appendChild(labelYear);
    }
    if (labelYear.textContent === '') {
      labelYear.textContent = 'År';
    }

    // Year input
    let inputYear = divYear.querySelector('input');
    if (inputYear === null) {
      inputYear = document.createElement('input');
      divYear.appendChild(inputYear);
    }
    if (!inputYear.hasAttribute('name')) {
      inputYear.setAttribute('name', 'year');
    }
    if (!inputYear.hasAttribute('type')) {
      inputYear.setAttribute('type', 'number');
    }
  }
  #connectMutationObserver() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mutationObserverConfig;
    if (this.#mutationObserver) return;
    this.#mutationObserver = new MutationObserver(this.#handleMutations);
    this.#mutationObserver.observe(this, config);
  }
  #disconnectMutationObserver() {
    if (this.#mutationObserver) {
      this.#mutationObserver.disconnect();
      this.#mutationObserver = null;
    }
  }
  #setInvalidForInput(target, inputElement, errorMessages) {
    const relevantErrors = Array.from(errorMessages).filter(errorMsg => {
      const targets = errorMsg.getAttribute('targets');
      return targets && targets.includes(target);
    });
    if (relevantErrors.length > 0) {
      setInvalid(inputElement, relevantErrors);
    }
  }
  #init() {
    this.#setupHTML();
    this.#connectMutationObserver();
    const legend = this.querySelector('legend');
    const fieldset = this.querySelector('fieldset');
    const errorMessages = this.querySelectorAll('fds-error-message');
    const helpTexts = this.querySelectorAll('fds-help-text');
    const label_day = this.querySelector('[data-attribute="day"] label');
    const label_month = this.querySelector('[data-attribute="month"] label');
    const label_year = this.querySelector('[data-attribute="year"] label');
    const input_day = this.querySelector('[data-attribute="day"] input');
    const input_month = this.querySelector('[data-attribute="month"] input');
    const input_year = this.querySelector('[data-attribute="year"] input');
    associateLabelWithElement(label_day, input_day, 'day');
    associateLabelWithElement(label_month, input_month, 'month');
    associateLabelWithElement(label_year, input_year, 'year');
    setAriaDescribedBy(fieldset, errorMessages, helpTexts);
    this.#setInvalidForInput('day', input_day, errorMessages);
    this.#setInvalidForInput('month', input_month, errorMessages);
    this.#setInvalidForInput('year', input_year, errorMessages);
    if (this.hasAttribute('show-required-status')) {
      showRequiredStatus(legend, fieldset, this.getAttribute('show-required-status'));
    }
    this.#initialized = true;
  }
  #setReadonly() {
    const inputs = this.querySelectorAll('input');
    inputs.forEach(input => {
      if (this.getAttribute('input-readonly') !== null && this.getAttribute('input-readonly') !== 'false') {
        input.setAttribute('readonly', '');
      } else {
        input.removeAttribute('readonly');
      }
    });
  }
  #setRequired() {
    const inputs = this.querySelectorAll('input');
    inputs.forEach(input => {
      if (this.getAttribute('input-required') !== null && this.getAttribute('input-required') !== 'false') {
        input.setAttribute('required', '');
      } else {
        input.removeAttribute('required');
      }
    });
  }
  #setInputId() {
    const inputWrappers = this.querySelectorAll('div[data-attribute]');
    inputWrappers.forEach(inputWrapper => {
      const label = inputWrapper.querySelector('label');
      const input = inputWrapper.querySelector('input');
      if (this.getAttribute('input-id') !== null && this.getAttribute('input-id') !== '') {
        input.id = `${inputWrapper.getAttribute('data-attribute')}-${this.getAttribute('input-id')}`;
      }
    });
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.#initialized) {
      this.#init();
    }
    if (this.hasAttribute('input-readonly')) {
      this.#setReadonly();
    }
    if (this.hasAttribute('input-required')) {
      this.#setRequired();
    }
    if (this.hasAttribute('legend')) {
      this.querySelector('legend').textContent = this.getAttribute('legend');
    }
    if (this.hasAttribute('input-id')) {
      this.#setInputId();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    notifySummaryOnDisconnect(this);
    this.#disconnectMutationObserver();
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    switch (attribute) {
      case 'show-required-status':
        const legend = this.querySelector('legend');
        const fieldset = this.querySelector('fieldset');
        showRequiredStatus(legend, fieldset, newValue);
        break;
      case 'input-readonly':
        this.#setReadonly();
        break;
      case 'input-required':
        this.#setRequired();
        break;
      case 'legend':
        if (newValue !== null) {
          this.querySelector('legend').textContent = newValue;
        }
        break;
      case 'input-id':
        this.#setInputId();
        break;
    }
  }

  // #endregion    
}
function registerDateInput() {
  if (customElements.get('fds-date-input') === undefined) {
    window.customElements.define('fds-date-input', FDSDateInput);
  }
}
/* harmony default export */ const fds_date_input = (registerDateInput);
;// ./src/js/web-components/select/fds-select.js

class FDSSelect extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['show-required-status'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get showRequiredStatus() {
    return this.getAttribute('show-required-status');
  }
  set showRequiredStatus(value) {
    value === null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #mutationObserver = null;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleMutations = records => {
    for (const {
      attributeName,
      target,
      addedNodes,
      removedNodes
    } of records) {
      // A relevant child element was added or removed.
      const relevantTagNames = ['LABEL', 'SELECT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
      const allNodes = [...addedNodes, ...removedNodes];
      if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
        this.#setAccessibilityAttributes();
        if (this.hasAttribute('show-required-status')) {
          const label = this.querySelector('label');
          const select = this.querySelector('select');
          showRequiredStatus(label, select, this.getAttribute('show-required-status'));
        }
        break;
      }

      // The select's required attribute changed
      if (attributeName === 'required' && target?.tagName === 'SELECT') {
        if (this.hasAttribute('show-required-status')) {
          const label = this.querySelector('label');
          showRequiredStatus(label, target, this.getAttribute('show-required-status'));
        }
      }
      // Attributes which might affect aria-describedby
      else if (attributeName === 'id' || attributeName === 'hidden' || attributeName === 'aria-hidden' || attributeName === 'class') {
        this.#setAccessibilityAttributes();
        if (attributeName === 'hidden' && target === this) {
          notifySummaryOnVisibilityChange(this);
        }
      }
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setAccessibilityAttributes() {
    const label = this.querySelector('label');
    const select = this.querySelector('select');
    const errorMessages = this.querySelectorAll('fds-error-message');
    const helpTexts = this.querySelectorAll('fds-help-text');
    associateLabelWithElement(label, select, 'sel');
    setAriaDescribedBy(select, errorMessages, helpTexts);
    setInvalid(select, errorMessages);
  }
  #connectMutationObserver() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : mutationObserverConfig;
    if (this.#mutationObserver) return;
    this.#mutationObserver = new MutationObserver(this.#handleMutations);
    this.#mutationObserver.observe(this, config);
  }
  #disconnectMutationObserver() {
    if (this.#mutationObserver) {
      this.#mutationObserver.disconnect();
      this.#mutationObserver = null;
    }
  }
  #init() {
    this.#setAccessibilityAttributes();
    if (this.hasAttribute('show-required-status')) {
      const label = this.querySelector('label');
      const select = this.querySelector('select');
      showRequiredStatus(label, select, this.getAttribute('show-required-status'));
    }
    this.#connectMutationObserver();
    this.#initialized = true;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    this.#init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    notifySummaryOnDisconnect(this);
    this.#disconnectMutationObserver();
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    switch (attribute) {
      case 'show-required-status':
        const label = this.querySelector('label');
        const select = this.querySelector('select');
        showRequiredStatus(label, select, newValue);
        break;
    }
  }

  // #endregion
}
function registerSelect() {
  if (customElements.get('fds-select') === undefined) {
    window.customElements.define('fds-select', FDSSelect);
  }
}
/* harmony default export */ const fds_select = (registerSelect);
;// ./src/js/web-components/date-picker/fds-date-picker-utils.js
/**
 * Get weekday index with Monday as 0
 *
 * @param {Date} date - Date to get weekday for
 * @return {number} Weekday index (0=Mon..6=Sun)
 */
function getWeekday(date) {
  const day = (date.getDay() + 6) % 7; // First day of the week changed from Sunday to Monday
  return day;
}

/**
 * Get the number of days in a month
 *
 * @param {Date} date - Any date in the month, for which you want the total number of days
 * @return {number} The month's total number of days
 */
function totalDaysInMonth(date) {
  const newDate = new Date(1990, 1, 1); // Date() uses an argument to create a timestamp of 00:00:00

  newDate.setFullYear(date.getFullYear());
  newDate.setMonth(date.getMonth() + 1);
  newDate.setDate(0); // Sets the date to the last day of the previous month

  return newDate.getDate();
}

/**
 * Converts a date string to a Date object, setting time to 00:00:00.
 * Accepts various separators: slash (/), dash (-), dot (.), or space.
 * 
 * @param {string} str - The date string in YYYY-MM-DD format (or DD-MM-YYYY if reverse is true)
 * @param {boolean} [reverse=false] - If true, expects DD-MM-YYYY format; if false, expects YYYY-MM-DD format
 * @return {Date} A new Date object (time set to 00:00:00), or invalid Date if string format is invalid
 */
function stringToDate(str) {
  let reverse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  if (typeof str !== 'string') {
    return new Date('invalid');
  }
  let regex = /^(\d{4})[\/\-\. ](\d{1,2})[\/\-\. ](\d{1,2})$/; // Matches year first, e.g. YYYY-MM-DD
  if (reverse) {
    regex = /^(\d{1,2})[\/\-\. ](\d{1,2})[\/\-\. ](\d{4})$/; // Matches day first, e.g. DD-MM-YYYY
  }
  const match = str.match(regex);
  if (match) {
    if (reverse) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const year = parseInt(match[3], 10);
      return dateFromIntegers(year, month, day);
    } else {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      return dateFromIntegers(year, month, day);
    }
  } else {
    return new Date('invalid');
  }
}

/**
 * Checks whether the date is a valid Date
 *
 * @param {*} date - The value to check if it's a valid Date object
 * @return {boolean} True if the value is a valid Date object, false otherwise
 */
function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Checks whether the string would be a valid Date if converted
 *
 * @param {*} date - The value to check if it's a valid Date object
 * @return {boolean} True if the value is a valid Date object, false otherwise
 */
function isValidDateStr(str) {
  const date = stringToDate(str);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Constrains a date to be within the specified range and sets time to 00:00:00
 * 
 * @param {Date} minDate - The minimum allowed date (lower bound, ignored if invalid)
 * @param {Date} date - The date to constrain within the range
 * @param {Date} maxDate - The maximum allowed date (upper bound, ignored if invalid)
 * @return {Date} A new Date object with the constrained date, or invalid Date if input date is invalid
 */
function constrainDate(minDate, date, maxDate) {
  if (!isValidDate(date)) {
    return new Date('invalid');
  }
  date.setHours(0, 0, 0, 0);
  if (isValidDate(minDate)) {
    minDate.setHours(0, 0, 0, 0);
  }
  if (isValidDate(maxDate)) {
    maxDate.setHours(0, 0, 0, 0);
  }
  if (isValidDate(minDate) && date < minDate) {
    return minDate;
  } else if (isValidDate(maxDate) && maxDate < date) {
    return maxDate;
  } else {
    return date;
  }
}

/**
 * Create a date from integers with timestamp 00:00:00. Unlike new Date(yyyy, mm, dd) this function don't allow date roll overs.
 *
 * @param {number} year - The year in the date
 * @param {number} month - The month in the date (0=January..11=December)
 * @param {number} day - The day in the date
 */
function dateFromIntegers(year, month, day) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    throw new Error('dateFromIntegers() must receive integers');
  }
  if (0 <= month && month <= 11 && 0 <= year && year <= 9999) {
    const totalMonthDays = totalDaysInMonth(new Date(year, month, 1));
    if (1 <= day && day <= totalMonthDays) {
      const date = new Date(1990, 1, 1); // Date() uses an argument to create a timestamp of 00:00:00
      date.setFullYear(year);
      date.setMonth(month);
      date.setDate(day);
      return date;
    } else {
      return new Date('invalid');
    }
  } else {
    return new Date('invalid');
  }
}

/**
 * Format date as YYYY-MM-DD
 *
 * @param {Date} date - Date to format
 * @return {string} ISO-like local date (YYYY-MM-DD)
 */
function ISOFormatFromDate(date) {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the previous day
 *
 * @param {Date} date - Reference date
 * @return {Date} New Date representing yesterday
 */
function getYesterday(date) {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
}

/**
 * Get the next day
 *
 * @param {Date} date - Reference date
 * @return {Date} New Date representing tomorrow
 */
function getTomorrow(date) {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
}
function getPrevWeek(date) {
  const prevWeek = new Date(date);
  prevWeek.setDate(prevWeek.getDate() - 7);
  return prevWeek;
}
function getNextWeek(date) {
  const nextWeek = new Date(date);
  nextWeek.setDate(nextWeek.getDate() + 7);
  return nextWeek;
}
function getPrevMonth(date) {
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let prevMonth = month - 1;
  if (prevMonth === -1) {
    prevMonth = 11;
    year = year - 1;
  }
  const newDaysInMonth = totalDaysInMonth(new Date(year, prevMonth, 1));
  if (newDaysInMonth < day) {
    day = newDaysInMonth;
  }
  const newDate = new Date(1990, 1, 1); // Date() uses an argument to create a timestamp of 00:00:00
  newDate.setFullYear(year); // Use setFullYear as new Date(year, month, date) would set year "20" to "1920"
  newDate.setMonth(prevMonth);
  newDate.setDate(day);
  return newDate;
}
function getNextMonth(date) {
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let nextMonth = month + 1;
  if (nextMonth === 12) {
    nextMonth = 0;
    year = year + 1;
  }
  const newDaysInMonth = totalDaysInMonth(new Date(year, nextMonth, 1));
  if (newDaysInMonth < day) {
    day = newDaysInMonth;
  }
  const newDate = new Date(1990, 1, 1); // Date() uses an argument to create a timestamp of 00:00:00
  newDate.setFullYear(year); // Use setFullYear as new Date(year, month, date) would set year "20" to "1920"
  newDate.setMonth(nextMonth);
  newDate.setDate(day);
  return newDate;
}
function getPrevYear(date) {
  let day = date.getDate();
  const month = date.getMonth();
  let year = date.getFullYear();
  let prevYear = year - 1;
  const newDaysInMonth = totalDaysInMonth(new Date(prevYear, month, 1));
  if (newDaysInMonth < day) {
    day = newDaysInMonth;
  }
  const newDate = new Date(1990, 1, 1); // Date() uses an argument to create a timestamp of 00:00:00
  newDate.setFullYear(prevYear); // Use setFullYear as new Date(year, month, date) would set year "20" to "1920"
  newDate.setMonth(month);
  newDate.setDate(day);
  return newDate;
}
function getNextYear(date) {
  let day = date.getDate();
  const month = date.getMonth();
  let year = date.getFullYear();
  let nextYear = year + 1;
  const newDaysInMonth = totalDaysInMonth(new Date(nextYear, month, 1));
  if (newDaysInMonth < day) {
    day = newDaysInMonth;
  }
  const newDate = new Date(1990, 1, 1); // Date() uses an argument to create a timestamp of 00:00:00
  newDate.setFullYear(nextYear); // Use setFullYear as new Date(year, month, date) would set year "20" to "1920"
  newDate.setMonth(month);
  newDate.setDate(day);
  return newDate;
}

/**
 * Checks if two dates are exactly the same
 * 
 * @param {Date} date1 - The first date to compare
 * @param {Date} date2 - The second date to compare
 * @returns {boolean} True if the dates are exactly equal, false otherwise
 */
function datesAreEqual(date1, date2) {
  if (!isValidDate(date1) || !isValidDate(date2)) {
    return false;
  }
  return date1.getTime() === date2.getTime();
}
;// ./src/js/web-components/date-picker/fds-date-picker.js



class FDSDatePicker extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['show-required-status', 'format', 'text-open', 'text-selecteddate', 'text-months'];

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #datePickerObserver = null;
  #handleDatePickerButtonClick;
  #handleFocusOut;
  #handleDateSelection;
  #handleDateClick;
  #handleCloseClick;
  #handleInput;
  #handlePageShow;
  #handleKeydown;
  #MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
  #FORMATS = ['DD/MM/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY', 'DD MM YYYY', 'DD/MM-YYYY'];
  #textOpen = 'Åbn datovælger';
  #textSelectedDate = 'valgt dato er DAY. MONTH YEAR';

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleMutations = (records, observer) => {
    const wrapperHiddenChanged = records.some(record => record.attributeName === 'hidden' && record.target === this);
    if (wrapperHiddenChanged) {
      notifySummaryOnVisibilityChange(this);
    }
    const shouldUpdate = records.some(record => this.#hasRelevantMutationHappened(record.addedNodes, record.removedNodes, record.target, record.attributeName));
    if (shouldUpdate) {
      this.#setupInput();
      this.#setupLabel();
      if (this.hasAttribute('show-required-status')) {
        const label = this.querySelector('label');
        const input = this.querySelector('input');
        showRequiredStatus(label, input, this.getAttribute('show-required-status'));
      }
      if (this.querySelector('.date-button')) {
        this.querySelector('input')?.hasAttribute('disabled') ? this.querySelector('.date-button').setAttribute('disabled', '') : this.querySelector('.date-button').removeAttribute('disabled');
      }
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupLabel() {
    const label = this.querySelector('label');
    if (!label) return;
    const input = this.querySelector('input');
    if (input) {
      label.classList.toggle('disabled', input.hasAttribute('disabled'));
    }
  }
  #setupInput() {
    const input = this.querySelector('input');
    if (!input) return;

    /* Add or remove aria-describedby */

    input.removeAttribute('aria-describedby');
    const idsForAriaDescribedby = [];
    let isInvalid = false;
    const errorMessages = this.querySelectorAll('fds-error-message');
    const helpTexts = this.querySelectorAll('fds-help-text');
    const ariaDescribedbyElements = [...errorMessages, ...helpTexts];
    for (const element of ariaDescribedbyElements) {
      const notDisplayNone = window.getComputedStyle(element).display !== 'none';
      const notAriaHidden = !element.hasAttribute('aria-hidden') || element.getAttribute('aria-hidden') === 'false';
      const visibleToScreenReaders = notDisplayNone && notAriaHidden;
      if (element.id && visibleToScreenReaders) {
        idsForAriaDescribedby.push(element.id);
        if (element.tagName === 'FDS-ERROR-MESSAGE') {
          isInvalid = true;
        }
      }
    }
    idsForAriaDescribedby.length > 0 ? input.setAttribute('aria-describedby', idsForAriaDescribedby.join(' ')) : input.removeAttribute('aria-describedby');
    isInvalid ? input.setAttribute('aria-invalid', 'true') : input.removeAttribute('aria-invalid');
  }
  #init() {
    if (this.#initialized) return;

    /* Confirm that the element was initialized with the required elements */

    const label = this.querySelector('label');
    const input = this.querySelector('div input');
    const grid = this.querySelector('div fds-date-picker-grid');
    if (!label || !input || !grid) return;

    /* Add mutation observer */

    this.#setupObserver();

    /* Setup elements */

    associateLabelWithElement(label, input, 'datp');
    this.#setupInput();
    this.#setupLabel();

    /* Update text */

    if (this.hasAttribute('text-open')) {
      this.#textOpen = this.getAttribute('text-open');
    }
    if (this.hasAttribute('text-selecteddate')) {
      this.#textSelectedDate = this.getAttribute('text-selecteddate');
    }
    if (this.hasAttribute('text-months')) {
      this.#updateTextMonths(this.getAttribute('text-months'));
    }

    /* Add date picker button next to the input */

    const dateButton = this.querySelector('.date-button') || document.createElement('button');
    if (!dateButton.querySelector('svg')) {
      dateButton.setAttribute('aria-haspopup', 'dialog');
      dateButton.classList.add('button', 'button-icon-only', 'date-button');
      dateButton.setAttribute('aria-label', this.#textOpen);
      dateButton.setAttribute('type', 'button');
      const svg = createSvgIcon("M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z");
      dateButton.appendChild(svg);
    }
    input.insertAdjacentElement('afterend', dateButton);
    input.parentElement.classList.add('input-wrapper');

    /* Add close button and setup dialog */

    const closeButtonContainer = this.querySelector('[tabindex="-1"]') || document.createElement('div');
    closeButtonContainer.setAttribute('tabindex', '-1');
    const closeButton = this.querySelector('.close-button') || document.createElement('button');
    closeButton.textContent = 'Luk';
    closeButton.setAttribute('type', 'button');
    closeButton.classList.add('close-button', 'function-link');
    if (!closeButton.querySelector('svg')) {
      const svgClose = createSvgIcon('m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z');
      closeButton.prepend(svgClose);
    }
    if (!closeButtonContainer.querySelector('.close-button')) {
      closeButtonContainer.appendChild(closeButton);
    }

    /* Add wrapper for fds-date-picker-grid and close button */

    const datePicker = grid.parentElement;
    datePicker.classList.add('ce-date-picker', 'd-none');
    datePicker.setAttribute('role', 'dialog');
    datePicker.setAttribute('aria-modal', 'false');
    datePicker.appendChild(closeButtonContainer);
    this.#initialized = true;
  }
  #setupObserver() {
    if (this.#datePickerObserver) return;
    this.#datePickerObserver = new MutationObserver(this.#handleMutations);
    this.#datePickerObserver.observe(this, mutationObserverConfig);
  }
  #hasRelevantMutationHappened(addedNodes, removedNodes, target, attributeName) {
    if (attributeName === 'disabled' && target?.tagName === 'INPUT' || attributeName === 'required' && target?.tagName === 'INPUT' || attributeName === 'class' && target?.tagName !== 'LABEL' || attributeName === 'id' || attributeName === 'hidden' || attributeName === 'aria-hidden') {
      return true;
    }
    const relevantTagNames = ['LABEL', 'INPUT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
    const allNodes = [...addedNodes, ...removedNodes];
    return allNodes.some(node => relevantTagNames.includes(node?.tagName));
  }
  #updateDateButton(date) {
    if (isValidDate(date)) {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const ariaLabel = this.#textSelectedDate.replace('DAY', day).replace('MONTH', this.#MONTHS[month]).replace('YEAR', year);
      this.querySelector('.date-button').setAttribute('aria-label', `${this.#textOpen}, ${ariaLabel}`);
    } else {
      this.querySelector('.date-button').setAttribute('aria-label', this.#textOpen);
    }
  }
  #updateSelectedDateAttr(date) {
    if (isValidDate(date)) {
      this.querySelector('fds-date-picker-grid').setAttribute('selected-date', ISOFormatFromDate(date));
    } else {
      this.querySelector('fds-date-picker-grid').setAttribute('selected-date', '');
    }
  }
  #closeOnFocusOut(event) {
    if (!this.contains(event.relatedTarget)) {
      // If anything is entered in the input field, the date picker must match
      if (this.querySelector('input').value !== '') {
        const dayMonthYearFormat = true;
        const date = stringToDate(this.querySelector('input').value, dayMonthYearFormat);
        this.#updateDateButton(date);
        this.#updateSelectedDateAttr(date);
      }
      this.close();
    }
  }
  #datePickerButtonClicked() {
    if (this.querySelector('input').value !== '') {
      const dayMonthYearFormat = true;
      const date = stringToDate(this.querySelector('input').value, dayMonthYearFormat);
      this.#updateDateButton(date);
      this.#updateSelectedDateAttr(date);
    }
    this.toggle();
    if (!this.querySelector('.ce-date-picker').classList.contains('d-none')) {
      this.querySelector('fds-date-picker-grid').focusFocusableDate();
    }
  }
  #dateSelected() {
    const selectedDate = stringToDate(this.querySelector('fds-date-picker-grid').getAttribute('selected-date'));
    this.#updateDateButton(selectedDate);

    // Update value in input field unless focus is on the input - otherwise, you risk moving the caret during typing
    if (document.activeElement !== this.querySelector('input')) {
      if (isValidDate(selectedDate)) {
        let format = this.#FORMATS[0];
        if (this.hasAttribute('format') && this.#FORMATS.includes(this.getAttribute('format'))) {
          format = this.getAttribute('format');
        }
        const dayWithZeros = String(selectedDate.getDate()).padStart(2, '0');
        const monthWithZeros = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const yearWithZeros = String(selectedDate.getFullYear()).padStart(4, '0');
        this.querySelector('input').value = format.replace('DD', dayWithZeros).replace('MM', monthWithZeros).replace('YYYY', yearWithZeros);
      }
    }
  }
  #closeAndFocusButton() {
    this.close();
    this.querySelector('.date-button').focus();
  }
  #inputUpdated(event) {
    const dayMonthYearFormat = true;
    const inputDate = stringToDate(event.target.value, dayMonthYearFormat);
    if (isValidDate(inputDate)) {
      this.querySelector('fds-date-picker-grid').setAttribute('selected-date', ISOFormatFromDate(inputDate));
    } else {
      this.querySelector('fds-date-picker-grid').setAttribute('selected-date', '');
    }
  }
  #updateOnPageshow() {
    let date = new Date('invalid');
    if (this.querySelector('input').value !== '') {
      const dayMonthYearFormat = true;
      date = stringToDate(this.querySelector('input').value, dayMonthYearFormat);
      this.#updateDateButton(date);
      this.#updateSelectedDateAttr(date); // The value in the input field supersedes the selected-date attribute
    } else if (this.querySelector('fds-date-picker-grid').hasAttribute('selected-date')) {
      date = stringToDate(this.querySelector('fds-date-picker-grid').getAttribute('selected-date'));
      this.#updateDateButton(date);
      this.#dateSelected();
    }
  }
  #keyboardNavigation(event) {
    switch (event.key) {
      case 'Tab':
        const previousButton = this.querySelector('fds-date-picker-grid').shadowRoot.querySelector('.previous-month');
        const monthSelect = this.querySelector('fds-date-picker-grid').shadowRoot.querySelector('.selected-month');
        if (event.shiftKey) {
          const path = event.composedPath();
          const innerTarget = path[0];
          if (innerTarget === monthSelect && previousButton.hasAttribute('disabled') || innerTarget === previousButton) {
            event.preventDefault();
            this.querySelector('.close-button').focus();
          }
        } else {
          if (event.target === this.querySelector('.close-button')) {
            event.preventDefault();
            if (!previousButton.hasAttribute('disabled')) {
              previousButton.focus();
            } else {
              monthSelect.focus();
            }
          }
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.#closeAndFocusButton();
        break;
    }
  }
  #updateTextMonths(str) {
    const newMonths = str.split(" ");
    if (newMonths.length === 12) {
      this.#MONTHS = newMonths;
      this.querySelector('fds-date-picker-grid')?.setAttribute('text-months', str);
    }
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();

    /* Set up instance fields for event handling */

    this.#handleDatePickerButtonClick = () => {
      this.#datePickerButtonClicked();
    };
    this.#handleFocusOut = event => {
      this.#closeOnFocusOut(event);
    };
    this.#handleDateSelection = () => {
      this.#dateSelected();
    };
    this.#handleDateClick = () => {
      this.#closeAndFocusButton();
    };
    this.#handleCloseClick = () => {
      this.#closeAndFocusButton();
    };
    this.#handleInput = event => {
      this.#inputUpdated(event);
    };
    this.#handlePageShow = () => {
      this.#updateOnPageshow();
    };
    this.#handleKeydown = event => {
      this.#keyboardNavigation(event);
    };
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  open() {
    if (!this.querySelector('.ce-date-picker')) return;
    this.querySelector('.ce-date-picker').classList.remove('d-none');
    this.querySelector('fds-date-picker-grid').resizeMonth();
  }
  close() {
    if (!this.querySelector('.ce-date-picker')) return;
    this.querySelector('.ce-date-picker').classList.add('d-none');
  }
  toggle() {
    if (!this.querySelector('.ce-date-picker')) return;
    this.querySelector('.ce-date-picker').classList.toggle('d-none');
    this.querySelector('fds-date-picker-grid').resizeMonth();
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.#initialized) return;
    this.#init();
    const label = this.querySelector('label');
    const input = this.querySelector('input');
    if (this.hasAttribute('show-required-status')) {
      showRequiredStatus(label, input, this.getAttribute('show-required-status'));
    }

    // Add event listeners
    this.querySelector('.date-button')?.addEventListener('click', this.#handleDatePickerButtonClick, false);
    this.addEventListener('focusout', this.#handleFocusOut, false);
    this.querySelector('fds-date-picker-grid')?.addEventListener('date-selected', this.#handleDateSelection, false);
    this.querySelector('fds-date-picker-grid')?.addEventListener('date-clicked', this.#handleDateClick, false);
    this.querySelector('.close-button')?.addEventListener('click', this.#handleCloseClick, false);
    this.querySelector('input')?.addEventListener('input', this.#handleInput, false);
    this.querySelector('.ce-date-picker')?.addEventListener('keydown', this.#handleKeydown, false);

    // Handles previously entered input when using the browser's back button
    window.addEventListener('pageshow', this.#handlePageShow, false);
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    notifySummaryOnDisconnect(this);
    this.#initialized = false;
    if (this.#datePickerObserver) {
      this.#datePickerObserver.disconnect();
      this.#datePickerObserver = null;
    }
    this.querySelector('.date-button')?.removeEventListener('click', this.#handleDatePickerButtonClick, false);
    this.removeEventListener('focusout', this.#handleFocusOut, false);
    this.querySelector('fds-date-picker-grid')?.removeEventListener('date-selected', this.#handleDateSelection, false);
    this.querySelector('fds-date-picker-grid')?.removeEventListener('date-clicked', this.#handleDateClick, false);
    this.querySelector('.close-button')?.removeEventListener('click', this.#handleCloseClick, false);
    this.querySelector('input')?.removeEventListener('input', this.#handleInput, false);
    this.querySelector('.ce-date-picker')?.removeEventListener('keydown', this.#handleKeydown, false);
    window.removeEventListener('pageshow', this.#handlePageShow, false);
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (attribute === 'show-required-status' && oldValue !== newValue) {
      const label = this.querySelector('label');
      const input = this.querySelector('input');
      showRequiredStatus(label, input, newValue);
    }
    if (attribute === 'format' && oldValue !== newValue) {
      if (document.activeElement !== this.querySelector('input')) {
        // If the new format is valid...
        if (this.hasAttribute('format') && this.#FORMATS.includes(newValue)) {
          const dayMonthYearFormat = true;
          const date = stringToDate(this.querySelector('input').value, dayMonthYearFormat);

          // ...and if the input field contains a valid date...
          if (isValidDate(date)) {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).padStart(4, '0');

            // ...then update the date displayed
            this.querySelector('input').value = newValue.replace('DD', day).replace('MM', month).replace('YYYY', year);
          }
        }
      }
    }
    if (attribute === 'text-open') {
      this.#textOpen = newValue;
    }
    if (attribute === 'text-selecteddate') {
      // Check that string contains exactly one "DAY", one "MONTH", and one "YEAR" substring
      const dayCount = (newValue.match(/DAY/g) || []).length;
      const monthCount = (newValue.match(/MONTH/g) || []).length;
      const yearCount = (newValue.match(/YEAR/g) || []).length;
      if (dayCount === 1 && monthCount === 1 && yearCount === 1) {
        this.#textSelectedDate = newValue;
      }
    }
    if (attribute === 'text-months') {
      this.#updateTextMonths(newValue);
    }
  }

  // #endregion
}
function registerDatePicker() {
  if (customElements.get('fds-date-picker') === undefined) {
    window.customElements.define('fds-date-picker', FDSDatePicker);
  }
}
/* harmony default export */ const fds_date_picker = (registerDatePicker);
;// ./src/js/web-components/date-picker/fds-date-picker-grid-styling.js
const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip-path: inset(50%);
        border: 0;
        user-select: none;
        white-space: nowrap;
    }

    button,
    select {
        text-transform: none;
        appearance: none;
        font-family: inherit;
        font-size: 100%;
        line-height: 1.5;
        margin: 0;
        color: #1a1a1a;
    }

    button:focus,
    input:focus,
    select:focus {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    :host {
        display: block;
        border: 1px solid #8E8E8E;
        background-color: white;
        max-width: calc(7 * 40px + 8 * 0.4rem + 2px);
        border-radius: 8px;
        overflow: auto;
    }

    .grid-container {
        width: fit-content;
    }

    .grid-container:focus {
        outline: 0;
    }

    .date-picker-header {
        display: flex;
        justify-content: space-between;
        background-color: #F5F5F5;
        padding-top: 4px;
        padding-bottom: 4px;
        min-width: 220px;
        position: relative;
        z-index: 3;
    }

    .month-year-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .month-wrapper,
    .year-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        margin-left: 4px;
        margin-right: 4px;
    }

    .select-arrow {
        position: absolute;
        width: 24px;
        right: 0;
        pointer-events: none;
    }

    .selected-month,
    .selected-year {
        border: 0;
        background-color: #F5F5F5;
        border-radius: 8px;
        background-position: 100%;
        background-size: 2.4rem;
        padding-right: 24px;
        padding-left: 8px;
        font-weight: 600;
        height: calc(1.6rem + 24px);
        cursor: pointer;
    }

    .selected-month:hover,
    .selected-year:hover {
        background-color: #DCDCDC;
    }

    .selected-month:active,
    .selected-year:active {
        background-color: #BFBFBF;
    }

    .selected-month:focus,
    .selected-year:focus {
        outline-offset: -3px;
    }

    .selected-month option,
    .selected-year option {
        background-color: #ffffff;
    }

    .previous-month,
    .next-month {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1.5;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        margin: 0;
        overflow-wrap: break-word;
        max-width: 100%;
        font-weight: inherit;
        font-size: 1.6rem;
        min-height: 32px;
        padding: 2px;
        border-width: 2px;
        border-style: solid;
        text-decoration: none;
        border-color: transparent;
        color: #1a1a1a;
        background-color: transparent;
        width: 40px;
        height: 40px;
        border-radius: 20px;
    }

    .previous-month {
        margin-left: 4px;
    }

    .next-month {
        margin-right: 4px;
    }

    .previous-month:hover,
    .next-month:hover {
        border-color: #DCDCDC;
        color: #1a1a1a;
        background-color: #DCDCDC;
    }

    .previous-month:active,
    .next-month:active {
        border-color: #BFBFBF;
        color: #1a1a1a;
        background-color: #BFBFBF;
    }

    .previous-month:disabled,
    .next-month:disabled {
        opacity: 0.25;
        cursor: not-allowed;
        box-shadow: none !important;
        border-color: transparent;
        color: #1a1a1a;
        background-color: transparent;
    }

    .previous-month svg,
    .next-month svg {
        margin: 0;
        fill: currentColor;
        width: 2.4rem;
        pointer-events: none;
    }

    table {
        border-collapse: separate;
        border-spacing: 0.4rem;
        min-width: 220px;
    }

    thead th {
        position: relative;
        font-size: 1.4rem;
        font-weight: 400;
        height: 40px;
    }

    thead th span[aria-hidden="true"] {
        position: relative;
        z-index: 1;
        top: -4px;
    }

    thead th::before {
        content: '';
        position: absolute;
        z-index: 1;
        background-color: #F5F5F5;
        display: block;
        left: calc(0rem - 0.4rem);
        top: calc(0rem - 0.4rem - 4px);
        width: calc(100% + 2 * 0.4rem);
        height: calc(100% + 2 * 0.4rem);
        border-bottom: 1px solid #DCDCDC;
    }

    td {
        height: 40px;
        width: 40px;
        max-width: 40px;
        text-align: center;
        border-radius: 20px;
    }

    td[data-date]:focus {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    td:not([data-date]):focus {
        outline: none;
    }

    td[aria-selected] {
        cursor: pointer;
    }

    td[aria-selected]:hover {
        background-color: #F5F5F5;
        text-decoration: underline;
    }

    td[aria-selected]:active {
        background-color: #DCDCDC;
        text-decoration: underline;
    }

    td[aria-selected="true"],
    td[aria-selected="true"]:hover,
    td[aria-selected="true"]:active {
        background-color: #1a1a1a;
        color: #ffffff;
        text-decoration: none;
    }

    td[aria-disabled="true"] {
        opacity: 0.25;
    }

    td[aria-disabled="true"]:focus {
        outline: none;
    }

    td[aria-current="date"] {
        font-weight: 700;
        text-decoration: underline;
    }

    td[aria-current="date"][aria-selected="true"]:hover,
    td[aria-current="date"][aria-selected="true"]:active {
        text-decoration: underline;
    }
`;
;// ./src/js/web-components/date-picker/fds-date-picker-grid.js



const CHEVRON_DOWN_PATH = 'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z';
const CHEVRON_LEFT_PATH = 'M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z';
const CHEVRON_RIGHT_PATH = 'M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z';
const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);
class FDSDatePickerGrid extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['min-date', 'max-date', 'selected-date', 'default-date', 'text-months', 'text-days', 'text-prevbutton', 'text-nextbutton', 'text-date-announcement', 'text-mindate', 'text-maxdate'];

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #previousMinDate;
  #previousMaxDate;
  #correctedMinDate;
  #correctedMaxDate;
  #MONTHS = ['januar', 'februar', 'marts', 'april', 'maj', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'december'];
  #DAYS = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag'];
  #GRID_ROWS = 6; // To avoid potential height changes when changing month, the calendar grid has a fixed set of rows
  #TOTAL_GRIDCELLS;
  #CELL_DATE_FORMAT = 'DAY. MONTH YEAR';
  #DEFAULT_MIN_DATE;
  #DEFAULT_MAX_DATE;
  #textMinDate;
  #textMaxDate;
  #hasDatePickerConnection;
  #linkedGrid = null;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleKeydown = event => {
    if (event.target.hasAttribute('data-date')) {
      const focusedDay = stringToDate(event.target.getAttribute('data-date'));
      const minDate = this.#correctedMinDate;
      const maxDate = this.#correctedMaxDate;
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          let yesterday = getYesterday(focusedDay);
          if (yesterday < minDate) {
            yesterday = minDate;
          }
          this.#redraw(yesterday, true);
          break;
        case 'ArrowRight':
          event.preventDefault();
          let tomorrow = getTomorrow(focusedDay);
          if (maxDate < tomorrow) {
            tomorrow = maxDate;
          }
          this.#redraw(tomorrow, true);
          break;
        case 'ArrowUp':
          event.preventDefault();
          let prevWeek = getPrevWeek(focusedDay);
          if (prevWeek < minDate) {
            prevWeek = minDate;
          }
          this.#redraw(prevWeek, true);
          break;
        case 'ArrowDown':
          event.preventDefault();
          let nextWeek = getNextWeek(focusedDay);
          if (maxDate < nextWeek) {
            nextWeek = maxDate;
          }
          this.#redraw(nextWeek, true);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          this.setAttribute('selected-date', event.target.getAttribute('data-date'));
          this.dispatchEvent(new Event('date-clicked'));
          break;
        case 'PageDown':
          event.preventDefault();
          if (event.shiftKey) {
            let nextYear = getNextYear(focusedDay);
            if (maxDate < nextYear) {
              nextYear = maxDate;
            }
            this.#redraw(nextYear, true);
          } else {
            let nextMonth = getNextMonth(focusedDay);
            if (maxDate < nextMonth) {
              nextMonth = maxDate;
            }
            this.#redraw(nextMonth, true);
          }
          break;
        case 'PageUp':
          event.preventDefault();
          if (event.shiftKey) {
            let prevYear = getPrevYear(focusedDay);
            if (prevYear < minDate) {
              prevYear = minDate;
            }
            this.#redraw(prevYear, true);
          } else {
            let prevMonth = getPrevMonth(focusedDay);
            if (prevMonth < minDate) {
              prevMonth = minDate;
            }
            this.#redraw(prevMonth, true);
          }
          break;
        case 'Home':
          event.preventDefault();
          // Go to first day of the month
          if (event.ctrlKey) {
            const month = parseInt(this.shadowRoot.querySelector('.selected-month').value, 10);
            const year = parseInt(this.shadowRoot.querySelector('.selected-year').value, 10);
            let firstDay = dateFromIntegers(year, month, 1);
            if (firstDay < minDate) {
              firstDay = minDate;
            }
            this.#redraw(firstDay, true);
          }
          // Go to first day of the week (Monday)
          else {
            const weekDay = getWeekday(focusedDay);
            if (weekDay !== 0) {
              let monday = new Date(focusedDay);
              monday.setDate(focusedDay.getDate() - weekDay);
              if (monday < minDate) {
                monday = minDate;
              }
              this.#redraw(monday, true);
            }
          }
          break;
        case 'End':
          event.preventDefault();
          // Go to last day of the month
          if (event.ctrlKey) {
            const month = parseInt(this.shadowRoot.querySelector('.selected-month').value, 10);
            const year = parseInt(this.shadowRoot.querySelector('.selected-year').value, 10);
            const day = totalDaysInMonth(dateFromIntegers(year, month, 1));
            let lastDay = dateFromIntegers(year, month, day);
            if (maxDate < lastDay) {
              lastDay = maxDate;
            }
            this.#redraw(lastDay, true);
          }
          // Go to last day of the week (Sunday)
          else {
            const weekDay = getWeekday(focusedDay);
            if (weekDay !== 6) {
              let sunday = new Date(focusedDay);
              sunday.setDate(focusedDay.getDate() + (6 - weekDay));
              if (maxDate < sunday) {
                sunday = maxDate;
              }
              this.#redraw(sunday, true);
            }
          }
          break;
      }
    }
  };
  #handleChangeMonth = event => {
    this.#selectChange(event);
  };
  #handleChangeYear = event => {
    this.#selectChange(event);
  };
  #handlePrevMonth = event => {
    this.#monthButtonClicked(event);
  };
  #handleNextMonth = event => {
    this.#monthButtonClicked(event);
  };
  #handleDateClick = event => {
    this.#dateClicked(event);
  };
  #handleRedrawLinkedGrid = () => {
    const focusableDate = this.#linkedGrid?.shadowRoot.querySelector('td[tabindex="0"]')?.getAttribute('data-date');
    this.#linkedGrid?.forceCompleteRedraw(stringToDate(focusableDate));
  };
  #handleRedrawSelf = () => {
    const focusableDate = this.shadowRoot.querySelector('td[tabindex="0"]')?.getAttribute('data-date');
    this.forceCompleteRedraw(stringToDate(focusableDate));
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #init() {
    if (this.#initialized) return;
    this.#create();

    // Determine which date to place the focus on in the grid
    let dateToFocus = new Date();
    if (this.getAttribute('selected-date')) {
      dateToFocus = stringToDate(this.getAttribute('selected-date'));
    } else if (this.getAttribute('default-date')) {
      dateToFocus = stringToDate(this.getAttribute('default-date'));
    }
    this.#redraw(dateToFocus, false);
    this.#addEventListeners();
    this.#initialized = true;
  }
  #create() {
    if (this.shadowRoot.querySelector('.grid-container')) return;
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');
    gridContainer.setAttribute('tabindex', '-1'); // Used to prevent focus from escaping when non-clickable items are clicked
    this.shadowRoot.appendChild(gridContainer);

    /* Create the date picker header with previous button, next button, year selection, and month selection */

    const datePickerHeader = document.createElement('div');
    datePickerHeader.classList.add('date-picker-header');

    // sr messages
    const srMessage = document.createElement('span');
    srMessage.classList.add('sr-only');
    srMessage.setAttribute('aria-live', 'polite');
    datePickerHeader.appendChild(srMessage);

    // Previous button
    const prevButton = document.createElement('button');
    prevButton.classList.add('previous-month');
    prevButton.setAttribute('type', 'button');
    const svgPrev = createSvgIcon(CHEVRON_LEFT_PATH);
    const prevButtonSR = document.createElement('span');
    prevButtonSR.textContent = 'Forrige';
    prevButtonSR.classList.add('sr-only');
    prevButton.appendChild(svgPrev);
    prevButton.appendChild(prevButtonSR);
    datePickerHeader.appendChild(prevButton);

    // Wrapper for month and year
    const monthYearWrapper = document.createElement('div');
    monthYearWrapper.classList.add('month-year-wrapper');

    // Select month
    const monthWrapper = document.createElement('div');
    monthWrapper.classList.add('month-wrapper');
    const monthSelect = document.createElement('select');
    monthSelect.setAttribute('name', 'month');
    monthSelect.setAttribute('aria-label', 'Måned');
    monthSelect.classList.add('selected-month');
    for (let i = 0; i < this.#MONTHS.length; i++) {
      monthSelect.innerHTML += `<option value="${i}">${this.#MONTHS[i].charAt(0).toUpperCase() + this.#MONTHS[i].slice(1)}</option>`;
    }
    monthWrapper.appendChild(monthSelect);
    const svgArrow = createSvgIcon(CHEVRON_DOWN_PATH);
    svgArrow.classList.add('select-arrow');
    monthWrapper.appendChild(svgArrow);
    monthYearWrapper.appendChild(monthWrapper);

    // Select year
    const yearWrapper = document.createElement('div');
    yearWrapper.classList.add('year-wrapper');
    const yearSelect = document.createElement('select');
    yearSelect.setAttribute('name', 'year');
    yearSelect.setAttribute('aria-label', 'År');
    yearSelect.classList.add('selected-year');
    yearWrapper.appendChild(yearSelect);
    const svgYearArrow = createSvgIcon(CHEVRON_DOWN_PATH);
    svgYearArrow.classList.add('select-arrow');
    yearWrapper.appendChild(svgYearArrow);
    monthYearWrapper.appendChild(yearWrapper);
    datePickerHeader.appendChild(monthYearWrapper);

    // Next button
    const nextButton = document.createElement('button');
    nextButton.classList.add('next-month');
    nextButton.setAttribute('type', 'button');
    const svgNext = createSvgIcon(CHEVRON_RIGHT_PATH);
    const nextButtonSR = document.createElement('span');
    nextButtonSR.textContent = 'Næste';
    nextButtonSR.classList.add('sr-only');
    nextButton.appendChild(svgNext);
    nextButton.appendChild(nextButtonSR);
    datePickerHeader.appendChild(nextButton);
    gridContainer.appendChild(datePickerHeader);

    /* The grid with dates */

    if (this.hasAttribute('text-mindate')) {
      this.#textMinDate = this.getAttribute('text-mindate');
    }
    if (this.hasAttribute('text-maxdate')) {
      this.#textMaxDate = this.getAttribute('text-maxdate');
    }
    const grid = document.createElement('table');
    grid.setAttribute('role', 'grid');
    grid.classList.add('date-picker-grid');
    const gridHead = document.createElement('thead');
    const gridHeadRow = document.createElement('tr');
    for (let i = 0; i < this.#DAYS.length; i++) {
      const gridHeader = document.createElement('th');
      gridHeader.setAttribute('scope', 'col');
      gridHeader.innerHTML = `<span aria-hidden="true">${this.#DAYS[i].slice(0, 2)}</span><span class="sr-only">${this.#DAYS[i]}</span>`;
      gridHeadRow.appendChild(gridHeader);
    }
    gridHead.appendChild(gridHeadRow);
    grid.appendChild(gridHead);
    const gridBody = document.createElement('tbody');
    for (let i = 0; i < this.#GRID_ROWS; i++) {
      const gridBodyRow = document.createElement('tr');
      for (let j = 0; j < this.#DAYS.length; j++) {
        const gridCell = document.createElement('td');
        gridCell.addEventListener('click', this.#handleDateClick, false); // Event listener added to each cell for proper iOS VoiceOVer support
        gridBodyRow.appendChild(gridCell);
      }
      gridBody.appendChild(gridBodyRow);
    }
    grid.appendChild(gridBody);
    gridContainer.appendChild(grid);
  }
  #redraw(date) {
    let setFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    const gridContainer = this.shadowRoot.querySelector('.grid-container');
    const TODAY = new Date();
    TODAY.setHours(0, 0, 0, 0);
    if (!gridContainer) return;
    if (!isValidDate(date)) {
      date = TODAY;
    }

    /* Check if any changes were made to minimum date or maximum date */

    let updatedMinMaxDates = false;
    if (this.#previousMinDate !== this.getAttribute('min-date') || this.#previousMaxDate !== this.getAttribute('max-date') || !isValidDate(this.#correctedMinDate) || !isValidDate(this.#correctedMaxDate) || this.#correctedMinDate > this.#correctedMaxDate) {
      this.#previousMinDate = this.getAttribute('min-date');
      this.#previousMaxDate = this.getAttribute('max-date');
      this.#correctedMinDate = stringToDate(this.getAttribute('min-date'));
      this.#correctedMaxDate = stringToDate(this.getAttribute('max-date'));
      if (!isValidDate(this.#correctedMinDate)) {
        this.#correctedMinDate = this.#DEFAULT_MIN_DATE;
      }
      if (!isValidDate(this.#correctedMaxDate)) {
        this.#correctedMaxDate = this.#DEFAULT_MAX_DATE;
      }

      // If the grid has another connected date picker grid, the min-date or max-date might need adjustment
      if (this.hasAttribute('start-date-id')) {
        const endDateGrid = document.querySelector(`[end-date-id="${this.getAttribute('start-date-id')}"]`);
        if (endDateGrid && endDateGrid.hasAttribute('selected-date')) {
          const potentialMaxDate = stringToDate(endDateGrid.getAttribute('selected-date'));
          if (isValidDate(potentialMaxDate) && potentialMaxDate < this.#correctedMaxDate) {
            this.#correctedMaxDate = potentialMaxDate;
          }
        }
      } else if (this.hasAttribute('end-date-id')) {
        const startDateGrid = document.querySelector(`[start-date-id="${this.getAttribute('end-date-id')}"]`);
        if (startDateGrid && startDateGrid.hasAttribute('selected-date')) {
          const potentialMinDate = stringToDate(startDateGrid.getAttribute('selected-date'));
          if (isValidDate(potentialMinDate) && this.#correctedMinDate < potentialMinDate) {
            this.#correctedMinDate = potentialMinDate;
          }
        }
      }
      if (this.#correctedMinDate > this.#correctedMaxDate) {
        this.#correctedMinDate = this.#correctedMaxDate;
      }
      updatedMinMaxDates = true;
    }

    /* Constrain the date to always be between the minimum date and maximum date */
    date = constrainDate(this.#correctedMinDate, date, this.#correctedMaxDate);

    /* Changes to minimum date or maximum date can affect the selectable years
       and requires the select to be updated */

    if (updatedMinMaxDates) {
      let minYear = this.#correctedMinDate.getFullYear();
      let maxYear = this.#correctedMaxDate.getFullYear();
      const yearSelect = this.shadowRoot.querySelector('.selected-year');
      yearSelect.innerHTML = '';
      for (let i = minYear; i <= maxYear; i++) {
        yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
      }
    }
    const year = date.getFullYear();
    gridContainer.querySelector('.selected-year').value = date.getFullYear();

    /* Disable unselectable months */

    const monthSelect = this.shadowRoot.querySelector('.selected-month');
    const monthOptions = monthSelect.querySelectorAll('option');
    const chosenYear = this.shadowRoot.querySelector('.selected-year').value;
    for (let i = 0; i < monthOptions.length; i++) {
      monthOptions[i].removeAttribute('disabled'); // Reset disabled status on all options
    }
    if (this.#correctedMinDate.getFullYear() === parseInt(chosenYear, 10)) {
      const minMonth = this.#correctedMinDate.getMonth();
      for (let i = 0; i < monthOptions.length; i++) {
        if (i < minMonth) {
          monthOptions[i].setAttribute('disabled', '');
        }
      }
    }
    if (this.#correctedMaxDate.getFullYear() === parseInt(chosenYear, 10)) {
      const maxMonth = this.#correctedMaxDate.getMonth();
      for (let i = 0; i < monthOptions.length; i++) {
        if (i > maxMonth) {
          monthOptions[i].setAttribute('disabled', '');
        }
      }
    }
    const month = date.getMonth();
    gridContainer.querySelector('.selected-month').value = month;
    this.resizeMonth();

    /* Remove existing dates in the grid */

    // Prevent focusout event to trigger in fds-date-picker when tabindex is updated
    const activeElement = document.activeElement;
    const isDateCellFocused = activeElement && activeElement.tagName === 'TD' && activeElement.hasAttribute('data-date') && gridContainer.contains(activeElement);
    if (isDateCellFocused) {
      gridContainer.focus();
    }
    const gridcells = gridContainer.querySelectorAll('td');
    for (let i = 0; i < this.#TOTAL_GRIDCELLS; i++) {
      gridcells[i].setAttribute('tabindex', '-1');
      gridcells[i].removeAttribute('data-date');
      gridcells[i].removeAttribute('aria-label');
      gridcells[i].removeAttribute('aria-selected');
      gridcells[i].removeAttribute('aria-disabled');
      gridcells[i].removeAttribute('aria-current');
      gridcells[i].setAttribute('aria-hidden', 'true');
      gridcells[i].innerHTML = '';
    }

    /* Add new dates */

    const totalDays = totalDaysInMonth(date);
    const offset = getWeekday(dateFromIntegers(year, month, 1));
    for (let i = 1; i <= totalDays; i++) {
      const gridcellDate = dateFromIntegers(year, month, i);

      // Set the data-date attribute for each date cell
      gridcells[i + offset - 1].setAttribute('data-date', `${ISOFormatFromDate(gridcellDate)}`);
      gridcells[i + offset - 1].removeAttribute('aria-hidden'); // Remove aria-hidden when the cell actually contains a date

      // Set the aria-label for each cell
      const ariaLabel = this.#CELL_DATE_FORMAT.replace('DAY', i).replace('MONTH', this.#MONTHS[month]).replace('YEAR', year);
      gridcells[i + offset - 1].setAttribute('aria-label', ariaLabel);

      // If the cell is the minimum or maximum date, add additional info in the aria-label
      if (datesAreEqual(gridcellDate, this.#correctedMinDate)) {
        const minAriaLabel = `${ariaLabel}, ${this.#textMinDate}`;
        gridcells[i + offset - 1].setAttribute('aria-label', minAriaLabel);
      } else if (datesAreEqual(gridcellDate, this.#correctedMaxDate)) {
        const maxAriaLabel = `${ariaLabel}, ${this.#textMaxDate}`;
        gridcells[i + offset - 1].setAttribute('aria-label', maxAriaLabel);
      }
      if (datesAreEqual(gridcellDate, TODAY)) {
        gridcells[i + offset - 1].setAttribute('aria-current', 'date');
      }

      // Set the content of each cell (a number from 1-31)
      gridcells[i + offset - 1].innerHTML = `${i}`;
      const dateIsBetweenMinAndMax = isValidDate(this.#correctedMinDate) && isValidDate(this.#correctedMaxDate) && this.#correctedMinDate <= gridcellDate && gridcellDate <= this.#correctedMaxDate;
      const dateIsGreaterThanMinNoMax = isValidDate(this.#correctedMinDate) && !isValidDate(this.#correctedMaxDate) && this.#correctedMinDate <= gridcellDate;
      const dateIsSmallerThanMaxNoMin = !isValidDate(this.#correctedMinDate) && isValidDate(this.#correctedMaxDate) && gridcellDate <= this.#correctedMaxDate;
      const noMinNoMax = !isValidDate(this.#correctedMinDate) && !isValidDate(this.#correctedMaxDate);
      if (dateIsBetweenMinAndMax || dateIsGreaterThanMinNoMax || dateIsSmallerThanMaxNoMin || noMinNoMax) {
        gridcells[i + offset - 1].setAttribute('aria-selected', `false`);
      } else {
        gridcells[i + offset - 1].setAttribute('aria-disabled', `true`);
      }
    }

    // If a date is selected and visible in the grid, ensure it is properly marked
    const selectedDate = this.getAttribute('selected-date');
    if (this.hasAttribute('selected-date') && isValidDateStr(selectedDate)) {
      const selectedDateCell = gridContainer.querySelector(`[data-date="${selectedDate}"]`);
      // Disabled dates can not be selected
      if (selectedDateCell && !selectedDateCell.hasAttribute('aria-disabled')) {
        selectedDateCell?.setAttribute('aria-selected', 'true');
      }
    }

    // Ensure it is possible to tab to the date which caused the grid to be redrawn
    gridContainer.querySelector(`[data-date="${ISOFormatFromDate(date)}"]`).setAttribute('tabindex', '0');

    // Ensure previous and next month buttons have the proper disabled state
    const prevMonthButton = this.shadowRoot.querySelector('.previous-month');
    const nextMonthButton = this.shadowRoot.querySelector('.next-month');
    const visibleMinDate = this.shadowRoot.querySelector(`[data-date="${ISOFormatFromDate(this.#correctedMinDate)}"]`);
    const visibleMaxDate = this.shadowRoot.querySelector(`[data-date="${ISOFormatFromDate(this.#correctedMaxDate)}"]`);
    const focusedElement = this.shadowRoot?.activeElement ?? document.activeElement;
    if (visibleMinDate) {
      if (focusedElement.classList.contains('previous-month')) {
        this.focusFocusableDate();
      }
      prevMonthButton.setAttribute('disabled', '');
    } else {
      prevMonthButton.removeAttribute('disabled');
    }
    if (visibleMaxDate) {
      if (focusedElement.classList.contains('next-month')) {
        this.focusFocusableDate();
      }
      nextMonthButton.setAttribute('disabled', '');
    } else {
      nextMonthButton.removeAttribute('disabled');
    }

    // If wanted, set focus on the date causing the redraw unless the grid is hidden or the focus is on the date input field
    const isDisplayed = this.offsetParent;
    if (setFocus && isDisplayed && document.activeElement.tagName !== 'INPUT') {
      this.focusFocusableDate();
    }
  }
  #selectChange(event) {
    const focusedDay = this.shadowRoot.querySelector('td[data-date][tabindex="0"]');
    const focusedDayAsDate = stringToDate(focusedDay.getAttribute('data-date'));
    let day = focusedDayAsDate.getDate();
    let month = parseInt(this.shadowRoot.querySelector('.selected-month').value, 10);
    let year = parseInt(this.shadowRoot.querySelector('.selected-year').value, 10);
    if (event.target === this.shadowRoot.querySelector('.selected-month')) {
      month = parseInt(event.target.value, 10);
    } else if (event.target === this.shadowRoot.querySelector('.selected-year')) {
      year = parseInt(event.target.value, 10);
    }
    const daysInNewMonth = totalDaysInMonth(dateFromIntegers(year, month, 1));
    if (daysInNewMonth < day) {
      day = daysInNewMonth;
    }
    const newDate = dateFromIntegers(year, month, day);
    this.#redraw(newDate, false);
    event.target.focus();
  }
  #monthButtonClicked(event) {
    const focusedDay = this.shadowRoot.querySelector('td[data-date][tabindex="0"]');
    const focusedDayAsDate = stringToDate(focusedDay.getAttribute('data-date'));
    let prevMonth = getPrevMonth(focusedDayAsDate);
    let nextMonth = getNextMonth(focusedDayAsDate);
    if (event.target === this.shadowRoot.querySelector('.previous-month')) {
      this.#redraw(prevMonth, false);
      if (event.target.getAttribute('disabled') !== null) {
        this.shadowRoot.querySelector('.sr-only').textContent = '';
        // Focus the earliest selectable date for proper sr announcement
        this.shadowRoot.querySelector('td[tabindex="0"]')?.setAttribute('tabindex', '-1');
        this.shadowRoot.querySelector('td[aria-selected]')?.setAttribute('tabindex', '0');
        this.focusFocusableDate();
      }
    } else if (event.target === this.shadowRoot.querySelector('.next-month')) {
      this.#redraw(nextMonth, false);
      if (event.target.getAttribute('disabled') !== null) {
        this.shadowRoot.querySelector('.sr-only').textContent = '';
        // Focus the last selectable date for proper sr announcement
        this.shadowRoot.querySelector('td[tabindex="0"]')?.setAttribute('tabindex', '-1');
        const tds = this.shadowRoot.querySelectorAll('td[aria-selected]');
        tds[tds.length - 1]?.setAttribute('tabindex', '0');
        this.focusFocusableDate();
      }
    }
    if (event.target.getAttribute('disabled') === null) {
      // Update screen reader message so the new month (and year) is announced
      const month = this.#MONTHS[parseInt(this.shadowRoot.querySelector('.selected-month').value, 10)];
      const year = parseInt(this.shadowRoot.querySelector('.selected-year').value, 10);
      this.shadowRoot.querySelector('.sr-only').textContent = `${month} ${year}`;
    }
  }
  #dateClicked(event) {
    if (event.currentTarget.hasAttribute('data-date') && !event.currentTarget.hasAttribute('aria-disabled')) {
      this.setAttribute('selected-date', event.currentTarget.getAttribute('data-date'));
      this.dispatchEvent(new Event('date-clicked'));
    }
  }
  #updateTextDays(str) {
    const newDays = str.split(" ");
    if (newDays.length === 7) {
      this.#DAYS = newDays;
      const tableHeaders = this.shadowRoot.querySelectorAll('th');
      for (let i = 0; i < tableHeaders.length; i++) {
        tableHeaders[i].innerHTML = `<span aria-hidden="true">${this.#DAYS[i].slice(0, 2)}</span><span class="sr-only">${this.#DAYS[i]}</span>`;
      }
    }
  }
  #updateTextMonths(str) {
    const newMonths = str.split(" ");
    if (newMonths.length === 12) {
      this.#MONTHS = newMonths;
      const header = this.shadowRoot.querySelector('.date-picker-header');
      if (header && header.querySelector('.sr-only')) {
        header.querySelector('.sr-only').textContent = '';
      }
      const monthOptions = this.shadowRoot.querySelectorAll('.selected-month option');
      for (let i = 0; i < monthOptions.length; i++) {
        monthOptions[i].textContent = this.#MONTHS[i].charAt(0).toUpperCase() + this.#MONTHS[i].slice(1);
      }
      this.resizeMonth();
    }
  }
  #updateTextPrevButton(str) {
    if (this.shadowRoot.querySelector('.previous-month')) {
      this.shadowRoot.querySelector('.previous-month .sr-only').textContent = str;
    }
  }
  #updateTextNextButton(str) {
    if (this.shadowRoot.querySelector('.next-month')) {
      this.shadowRoot.querySelector('.next-month .sr-only').textContent = str;
    }
  }
  #updateTextDateAnnouncement(str) {
    // Check that string contains exactly one "DAY", one "MONTH", and one "YEAR" substring
    const dayCount = (str.match(/DAY/g) || []).length;
    const monthCount = (str.match(/MONTH/g) || []).length;
    const yearCount = (str.match(/YEAR/g) || []).length;
    if (dayCount === 1 && monthCount === 1 && yearCount === 1) {
      this.#CELL_DATE_FORMAT = str;
    }
  }
  #addEventListeners() {
    this.shadowRoot.querySelector('.grid-container').addEventListener('keydown', this.#handleKeydown, false);
    this.shadowRoot.querySelector('.selected-month').addEventListener('change', this.#handleChangeMonth, false);
    this.shadowRoot.querySelector('.selected-year').addEventListener('change', this.#handleChangeYear, false);
    this.shadowRoot.querySelector('.previous-month').addEventListener('click', this.#handlePrevMonth, false);
    this.shadowRoot.querySelector('.next-month').addEventListener('click', this.#handleNextMonth, false);
  }
  #removeEventListeners() {
    this.shadowRoot.querySelector('.grid-container').removeEventListener('keydown', this.#handleKeydown, false);
    this.shadowRoot.querySelector('.selected-month').removeEventListener('change', this.#handleChangeMonth, false);
    this.shadowRoot.querySelector('.selected-year').removeEventListener('change', this.#handleChangeYear, false);
    this.shadowRoot.querySelector('.previous-month').removeEventListener('click', this.#handlePrevMonth, false);
    this.shadowRoot.querySelector('.next-month').removeEventListener('click', this.#handleNextMonth, false);
    this.shadowRoot.querySelectorAll('td').forEach(td => td.removeEventListener('click', this.#handleDateClick, false));
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this.#TOTAL_GRIDCELLS = this.#GRID_ROWS * this.#DAYS.length;
    this.#CELL_DATE_FORMAT = 'DAY. MONTH YEAR';
    this.#textMinDate = 'tidligste valgbare dato';
    this.#textMaxDate = 'seneste valgbare dato';
    this.#DEFAULT_MIN_DATE = new Date();
    this.#DEFAULT_MIN_DATE.setHours(0, 0, 0, 0);
    this.#DEFAULT_MAX_DATE = new Date(this.#DEFAULT_MIN_DATE);
    this.#DEFAULT_MAX_DATE.setFullYear(this.#DEFAULT_MIN_DATE.getFullYear() + 10);
    this.#previousMinDate = 0;
    this.#previousMaxDate = 0;
    this.#correctedMinDate = null;
    this.#correctedMaxDate = null;
    this.#hasDatePickerConnection = false;
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  forceCompleteRedraw(date) {
    let setFocus = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    this.#previousMaxDate = 0; // Force update of select element with possible years
    this.#redraw(date, setFocus);
  }
  setHasDatePickerConnection(val) {
    this.#hasDatePickerConnection = val;
  }
  getHasDatePickerConnection() {
    return this.#hasDatePickerConnection;
  }
  focusFocusableDate() {
    this.shadowRoot.querySelector('td[tabindex="0"]')?.focus();
  }
  resizeMonth() {
    const monthSelect = this.shadowRoot.querySelector('.selected-month');
    if (!monthSelect) return;
    const ROOT_FONT_SIZE = 10; // px, result of the 62.5% trick
    const ARROW_OFFSET_PX = 24; // px, is converted to rem
    const PADDING_PX = 8; // px, kept as pixels

    const selectedOption = monthSelect.options?.[monthSelect.selectedIndex];
    if (!selectedOption) return;
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.fontFamily = '"IBM Plex Sans", "system-ui", system, sans-serif';
    tempSpan.style.fontSize = '16px';
    tempSpan.style.lineHeight = '1.5';
    tempSpan.style.fontWeight = '600';
    tempSpan.textContent = selectedOption.text;
    this.shadowRoot.appendChild(tempSpan);
    if (tempSpan.offsetWidth > 0) {
      const remWidth = tempSpan.offsetWidth / ROOT_FONT_SIZE;
      monthSelect.style.width = `calc(${remWidth}rem + ${PADDING_PX + ARROW_OFFSET_PX}px)`;
    }
    this.shadowRoot.removeChild(tempSpan);
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.#initialized) return;
    if (this.hasAttribute('text-days')) {
      this.#updateTextDays(this.getAttribute('text-days'));
    }
    if (this.hasAttribute('text-months')) {
      this.#updateTextMonths(this.getAttribute('text-months'));
    }
    if (this.hasAttribute('text-date-announcement')) {
      this.#updateTextDateAnnouncement(this.getAttribute('text-date-announcement'));
    }
    this.#init();
    if (this.hasAttribute('text-prevbutton')) {
      this.#updateTextPrevButton(this.getAttribute('text-prevbutton'));
    }
    if (this.hasAttribute('text-nextbutton')) {
      this.#updateTextNextButton(this.getAttribute('text-nextbutton'));
    }

    // If the date picker is part of a "duo" defining start date and end date, add event listeners when both grids exist
    const isStartDate = this.hasAttribute('start-date-id');
    const isEndDate = this.hasAttribute('end-date-id');
    const startDateGrid = document.querySelector(`[start-date-id="${this.getAttribute('end-date-id')}"]`);
    const endDateGrid = document.querySelector(`[end-date-id="${this.getAttribute('start-date-id')}"]`);
    if (isStartDate && endDateGrid) {
      customElements.whenDefined('fds-date-picker-grid').then(() => {
        if (!this.getHasDatePickerConnection() && !endDateGrid?.getHasDatePickerConnection()) {
          this.#linkedGrid = endDateGrid;
          this.addEventListener('date-selected', this.#handleRedrawLinkedGrid);
          endDateGrid.addEventListener('date-selected', this.#handleRedrawSelf);
          this.setHasDatePickerConnection(true);
          endDateGrid.setHasDatePickerConnection(true);
        }
      });
    } else if (isEndDate && startDateGrid) {
      customElements.whenDefined('fds-date-picker-grid').then(() => {
        if (!this.getHasDatePickerConnection() && !startDateGrid?.getHasDatePickerConnection()) {
          this.#linkedGrid = startDateGrid;
          startDateGrid.addEventListener('date-selected', this.#handleRedrawSelf);
          this.addEventListener('date-selected', this.#handleRedrawLinkedGrid);
          startDateGrid.setHasDatePickerConnection(true);
          this.setHasDatePickerConnection(true);
        }
      });
    }

    // Resize again on load - the font may initially be missing, when the width of the month <select> is calculated
    const onLoad = () => {
      this.resizeMonth();
      window.removeEventListener('load', onLoad);
    };
    window.addEventListener('load', onLoad);
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();
    this.removeEventListener('date-selected', this.#handleRedrawLinkedGrid);
    this.#linkedGrid?.removeEventListener('date-selected', this.#handleRedrawSelf);
    this.#linkedGrid = null;
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    let redrawNeeded = false;
    switch (attribute) {
      case 'selected-date':
        {
          const date = stringToDate(newValue);
          const setFocusOnDate = true;
          if (isValidDate(date)) {
            this.#redraw(date, setFocusOnDate);
          } else {
            // An invalid date might be temporary while the user enters a date in the fds-date-picker's input field
            // Keep displaying the previous dates to give a more "steady" experience with no rapid updates
            const dateWithCurrentFocus = this.shadowRoot.querySelector('td[tabindex="0"]')?.getAttribute('data-date');
            this.#redraw(stringToDate(dateWithCurrentFocus), setFocusOnDate);
          }
          this.dispatchEvent(new Event('date-selected'));
          break;
        }
      case 'min-date':
      case 'max-date':
        redrawNeeded = true;
        break;
      case 'text-days':
        this.#updateTextDays(newValue);
        break;
      case 'text-months':
        this.#updateTextMonths(newValue);
        break;
      case 'text-prevbutton':
        this.#updateTextPrevButton(newValue);
        break;
      case 'text-nextbutton':
        this.#updateTextNextButton(newValue);
        break;
      case 'text-date-announcement':
        this.#updateTextDateAnnouncement(newValue);
        break;
      case 'text-mindate':
        this.#textMinDate = newValue;
        redrawNeeded = true;
        break;
      case 'text-maxdate':
        this.#textMaxDate = newValue;
        redrawNeeded = true;
        break;
    }
    if (redrawNeeded) {
      const dateWithCurrentFocus = this.shadowRoot.querySelector('td[tabindex="0"]')?.getAttribute('data-date');
      let placeFocusOnDate = stringToDate(dateWithCurrentFocus);
      if (!isValidDate(placeFocusOnDate)) {
        placeFocusOnDate = new Date();
      }
      this.#redraw(placeFocusOnDate, true);
    }
  }

  // #endregion
}
function registerDatePickerGrid() {
  if (customElements.get('fds-date-picker-grid') === undefined) {
    window.customElements.define('fds-date-picker-grid', FDSDatePickerGrid);
  }
}
/* harmony default export */ const fds_date_picker_grid = (registerDatePickerGrid);
;// ./src/js/web-components/textarea/fds-textarea.js


class FDSTextarea extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['show-required-status'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get showRequiredStatus() {
    return this.getAttribute('show-required-status');
  }
  set showRequiredStatus(value) {
    value === null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #textareaObserver = null;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleMutations = records => {
    for (const {
      attributeName,
      target,
      addedNodes,
      removedNodes
    } of records) {
      // A relevant child element was added or removed.
      const relevantTagNames = ['LABEL', 'TEXTAREA', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT', 'FDS-CHARACTER-LIMIT'];
      const allNodes = [...addedNodes, ...removedNodes];
      if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
        const label = this.querySelector('label');
        const textarea = this.querySelector('textarea');
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');
        const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');
        associateLabelWithElement(label, textarea, 'tex');
        setAriaDescribedBy(textarea, errorMessages, helpTexts, characterLimit);
        setInvalid(textarea, errorMessages);
        if (this.hasAttribute('show-required-status')) {
          showRequiredStatus(label, textarea, this.getAttribute('show-required-status'));
        }
        break;
      }

      // The textarea's required attribute changed
      if (attributeName === 'required' && target?.tagName === 'TEXTAREA') {
        if (this.hasAttribute('show-required-status')) {
          const label = this.querySelector('label');
          showRequiredStatus(label, target, this.getAttribute('show-required-status'));
        }
      }
      // Attributes which might affect aria-describedby
      else if (attributeName === 'id' || attributeName === 'hidden' || attributeName === 'aria-hidden' || attributeName === 'class') {
        const label = this.querySelector('label');
        const textarea = this.querySelector('textarea');
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');
        const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');
        associateLabelWithElement(label, textarea, 'tex');
        setAriaDescribedBy(textarea, errorMessages, helpTexts, characterLimit);
        setInvalid(textarea, errorMessages);
        if (attributeName === 'hidden' && target === this) {
          notifySummaryOnVisibilityChange(this);
        }
      }
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupObserver() {
    if (this.#textareaObserver) return;
    this.#textareaObserver = new MutationObserver(this.#handleMutations);
    this.#textareaObserver.observe(this, mutationObserverConfig);
  }
  #init() {
    this.#setupObserver();
    const label = this.querySelector('label');
    const textarea = this.querySelector('textarea');
    const errorMessages = this.querySelectorAll('fds-error-message');
    const helpTexts = this.querySelectorAll('fds-help-text');
    const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');
    associateLabelWithElement(label, textarea, 'tex');
    setAriaDescribedBy(textarea, errorMessages, helpTexts, characterLimit);
    setInvalid(textarea, errorMessages);
    if (this.hasAttribute('show-required-status')) {
      showRequiredStatus(label, textarea, this.getAttribute('show-required-status'));
    }
    this.#initialized = true;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.#initialized) {
      this.#init();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    notifySummaryOnDisconnect(this);
    this.#initialized = false;
    if (this.#textareaObserver) {
      this.#textareaObserver.disconnect();
      this.#textareaObserver = null;
    }
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (attribute === 'show-required-status' && oldValue !== newValue) {
      const label = this.querySelector('label');
      const textarea = this.querySelector('textarea');
      showRequiredStatus(label, textarea, newValue);
    }
  }

  // #endregion
}
function registerTextarea() {
  if (customElements.get('fds-textarea') === undefined) {
    window.customElements.define('fds-textarea', FDSTextarea);
  }
}
/* harmony default export */ const fds_textarea = (registerTextarea);
;// ./src/js/web-components/error-summary/fds-error-summary.js
class FDSErrorSummary extends HTMLElement {
  // #region - ATTRIBUTES ---------------------------------------------------------------------------------

  static observedAttributes = ['ready'];

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleClick = event => {
    // Only handle plain clicks, so "open in new tab" and similar keep working
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || !this.contains(link)) return;
    if (link.target && link.target !== '_self') return;
    if (!this.#isSamePageLink(link)) return;
    if (this.#focusTarget(link)) {
      event.preventDefault();
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  // Check if a link goes to somewhere on the same page
  #isSamePageLink(link) {
    const isSameOrigin = link.origin === location.origin;
    const isSamePath = link.pathname === location.pathname;
    const isSameQuery = link.search === location.search;
    return isSameOrigin && isSamePath && isSameQuery;
  }

  // Scrolls the legend/label into view, then focuses the destination without scrolling.
  // Returns true if the destination was focused (so the default anchor jump can be cancelled).
  #focusTarget(link) {
    let destinationId = link.hash.slice(1);
    if (!destinationId) return false;

    // link.hash may turn e.g. "æ" in an ID into "%C3%A6". Prevent ID mismatch.
    try {
      destinationId = decodeURIComponent(destinationId);
    } catch {
      return false;
    }
    const destination = document.getElementById(destinationId);
    if (!destination) return false;
    const legendOrLabel = this.#getAssociatedLegendOrLabel(destination);
    if (!legendOrLabel) return false;
    legendOrLabel.scrollIntoView();
    destination.focus({
      preventScroll: true
    });
    return true;
  }

  // Picks the element to scroll to
  #getAssociatedLegendOrLabel(destination) {
    const legend = destination.closest('fieldset')?.querySelector('legend');

    // legend

    if (legend) {
      if (destination.type === 'checkbox' || destination.type === 'radio') {
        return legend;
      }
      const legendTop = legend.getBoundingClientRect().top;
      const destinationRect = destination.getBoundingClientRect();
      const destinationBottom = destinationRect.top + destinationRect.height;
      if (destinationBottom - legendTop < window.innerHeight / 2) {
        return legend;
      }
    }

    // aria-labelledby - if several IDs, go to the first ID

    const whitespaceBetweenIds = /\s+/;
    const ariaLabelledByValue = destination.getAttribute('aria-labelledby')?.trim();
    const firstLabelledById = ariaLabelledByValue?.split(whitespaceBetweenIds)[0];
    const labelReferencedByAria = firstLabelledById ? document.getElementById(firstLabelledById) : null;
    if (labelReferencedByAria) return labelReferencedByAria;

    // label

    // Escape characters that would break a CSS selector (e.g. a quote), so the ID is safe to use below.
    const escapedId = CSS.escape(destination.id);
    const labelPointingToField = document.querySelector(`label[for="${escapedId}"]`);
    if (labelPointingToField) return labelPointingToField;
    return destination.closest('label');
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    if (this.#initialized) return;
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'alert');
    }
    this.addEventListener('click', this.#handleClick);
    this.#initialized = true;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.getAttribute('ready') === 'false') return;
    this.init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.removeEventListener('click', this.#handleClick);
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute === 'ready' && this.isConnected && newValue !== 'false') {
      this.init();
    }
  }

  // #endregion
}
function registerErrorSummary() {
  if (customElements.get('fds-error-summary') === undefined) {
    window.customElements.define('fds-error-summary', FDSErrorSummary);
  }
}
/* harmony default export */ const fds_error_summary = (registerErrorSummary);
;// ./src/js/web-components/input-affix/input-affix.js

class FDSInputAffix extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['input-prefix', 'input-suffix'];

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #init() {
    const input = this.querySelector('input');
    if (!input) return;
    if (this.hasAttribute('input-prefix')) {
      this.#setAffix(this.getAttribute('input-prefix'), 'prefix');
    }
    if (this.hasAttribute('input-suffix')) {
      this.#setAffix(this.getAttribute('input-suffix'), 'suffix');
    }
    this.#initialized = true;
  }
  #setAffix(value, affix) {
    let element = null;
    if (affix === 'prefix') {
      element = this.querySelector('.form-input-prefix');
    } else if (affix === 'suffix') {
      element = this.querySelector('.form-input-suffix');
    }
    if (value !== null && value !== '') {
      if (!element) {
        element = document.createElement('div');
        if (affix === 'prefix') {
          element.className = 'form-input-prefix';
          this.prepend(element);
        } else if (affix === 'suffix') {
          element.className = 'form-input-suffix';
          this.appendChild(element);
        }
      }
      element.setAttribute('aria-hidden', 'true');
      element.textContent = value;
    } else {
      element?.remove();
    }
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.#initialized) {
      this.#init();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (attribute === 'input-prefix' && oldValue !== newValue) {
      this.#setAffix(newValue, 'prefix');
    }
    if (attribute === 'input-suffix' && oldValue !== newValue) {
      this.#setAffix(newValue, 'suffix');
    }
  }

  // #endregion
}
function registerInputAffix() {
  if (customElements.get('fds-input-affix') === undefined) {
    window.customElements.define('fds-input-affix', FDSInputAffix);
  }
}
/* harmony default export */ const input_affix = (registerInputAffix);
;// ./src/js/web-components/header/fds-portal-info-styling.js
/**
 * Breakpoint is passed as a parameter rather than read from a CSS custom property
 * due to unreliable timing in execution order.
 *
 * @param {string} breakpoint - The min-width breakpoint value, e.g. '992px'.
 * @returns {string} The CSS string for the Shadow DOM stylesheet.
 */
const fds_portal_info_styling_styles = breakpoint => `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    .portal-info-inner {
        width: 100%;
        max-width: 1200px;
        min-height: 48px;
        padding-top: 4px;
        padding-bottom: 4px;
        padding-right: 16px;
        padding-left: 16px;
        display: flex;
        align-items: center;
        flex-direction: row;
        margin-right: auto;
        margin-left: auto;
    }

    .portal-user {
        margin-left: auto;
        display: none;
        align-items: center;
        justify-content: flex-end;
        max-width: 70%;

        @media (min-width: ${breakpoint}) {
            display: flex;
        }
    }

    .portal-info-mobile {
        border-top: 1px solid #8e8e8e;
        padding: 24px;
        text-align: left;
        background-color: var(--header-portal-background-color, #FFFFFF);
    }
`;
;// ./src/js/web-components/header/fds-portal-info.js


class FDSPortalInfo extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['breakpoint', 'ready'];

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #sheet = (() => new CSSStyleSheet())();

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleSlotDrawerOpenerChange = event => {
    event.target.assignedElements().forEach(element => {
      element.classList.add('ml-auto');
    });
  };
  #handleSlotUserChange = event => {
    event.target.assignedElements().forEach(element => {
      element.classList.add('user');
    });
  };
  #handleSlotLogOffButtonChange = event => {
    event.target.assignedElements().forEach(element => {
      element.classList.add('function-link', 'd-print-none', 'log-off');
    });
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #updateStyles() {
    const breakpoint = this.getAttribute('breakpoint') || '992px';
    this.#sheet.replaceSync(fds_portal_info_styling_styles(breakpoint));
  }
  #setupHTML() {
    if (this.closest('fds-modal')) {
      // --- Section ---
      let section = this.shadowRoot.querySelector('.portal-info-mobile');
      if (!section) {
        section = document.createElement('section');
        section.classList.add('portal-info-mobile');
        this.shadowRoot.appendChild(section);
      }

      // --- User ---
      let userSlot = section.querySelector('slot[name="user"]');
      if (!userSlot) {
        userSlot = document.createElement('slot');
        userSlot.name = 'user';
        section.appendChild(userSlot);
      }

      // --- Log off button ---
      let logOffButtonSlot = section.querySelector('slot[name="log-off-button"]');
      if (!logOffButtonSlot) {
        logOffButtonSlot = document.createElement('slot');
        logOffButtonSlot.name = 'log-off-button';
        section.appendChild(logOffButtonSlot);
      }
    } else {
      // --- Inner wrapper ---
      let divWrapper = this.shadowRoot.querySelector('.portal-info-inner');
      if (!divWrapper) {
        divWrapper = document.createElement('div');
        divWrapper.classList.add('portal-info-inner');
        this.shadowRoot.appendChild(divWrapper);
      }

      // --- Logo ---
      let portalLogo = divWrapper.querySelector('slot[name="logo"]');
      if (!portalLogo) {
        portalLogo = document.createElement('slot');
        portalLogo.name = 'logo';
        divWrapper.appendChild(portalLogo);
      }

      // --- Drawer opener ---
      let drawerOpenerSlot = divWrapper.querySelector('slot[name="drawer-opener"]');
      if (!drawerOpenerSlot) {
        drawerOpenerSlot = document.createElement('slot');
        drawerOpenerSlot.name = 'drawer-opener';
        divWrapper.appendChild(drawerOpenerSlot);
      }

      // --- User wrapper ---
      let userWrapper = divWrapper.querySelector('.portal-user');
      if (!userWrapper) {
        userWrapper = document.createElement('div');
        userWrapper.classList.add('portal-user');
        divWrapper.appendChild(userWrapper);
      }

      // --- User ---
      let userSlot = userWrapper.querySelector('slot[name="user"]');
      if (!userSlot) {
        userSlot = document.createElement('slot');
        userSlot.name = 'user';
        userWrapper.appendChild(userSlot);
      }

      // --- Log off button ---
      let logOffButtonSlot = userWrapper.querySelector('slot[name="log-off-button"]');
      if (!logOffButtonSlot) {
        logOffButtonSlot = document.createElement('slot');
        logOffButtonSlot.name = 'log-off-button';
        userWrapper.appendChild(logOffButtonSlot);
      }
    }
  }
  #addEventListeners() {
    this.shadowRoot.querySelector('slot[name="drawer-opener"]')?.addEventListener('slotchange', this.#handleSlotDrawerOpenerChange);
    this.shadowRoot.querySelector('slot[name="user"]')?.addEventListener('slotchange', this.#handleSlotUserChange);
    this.shadowRoot.querySelector('slot[name="log-off-button"]')?.addEventListener('slotchange', this.#handleSlotLogOffButtonChange);
  }
  #removeEventListeners() {
    this.shadowRoot.querySelector('slot[name="drawer-opener"]')?.removeEventListener('slotchange', this.#handleSlotDrawerOpenerChange);
    this.shadowRoot.querySelector('slot[name="user"]')?.removeEventListener('slotchange', this.#handleSlotUserChange);
    this.shadowRoot.querySelector('slot[name="log-off-button"]')?.removeEventListener('slotchange', this.#handleSlotLogOffButtonChange);
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.adoptedStyleSheets = [this.#sheet];
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    this.#updateStyles();
    this.#setupHTML();
    this.#addEventListeners();
    this.#initialized = true;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.getAttribute('ready') === 'false') return;
    this.init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute === 'ready') {
      if (!this.#initialized && this.isConnected && newValue !== 'false') {
        this.init();
      }
      return;
    }
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    switch (attribute) {
      case 'breakpoint':
        this.#updateStyles();
        break;
    }
  }

  // #endregion
}
function registerPortalInfo() {
  if (!customElements.get('fds-portal-info')) {
    customElements.define('fds-portal-info', FDSPortalInfo);
  }
}
/* harmony default export */ const fds_portal_info = (registerPortalInfo);
;// ./src/js/web-components/header/fds-solution-info-styling.js
const fds_solution_info_styling_styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    .solution-info-inner {
        display: flex;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        padding-top: calc(16px - 1px);
        padding-bottom: calc(16px - 1px);
        padding-right: 16px;
        padding-left: 16px;
        max-width: 1200px;
        margin-right: auto;
        margin-left: auto;
    }
`;
;// ./src/js/web-components/header/fds-solution-info.js

const fds_solution_info_sheet = new CSSStyleSheet();
fds_solution_info_sheet.replaceSync(fds_solution_info_styling_styles);
class FDSSolutionInfo extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['ready'];

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleSlotDrawerOpenerChange = event => {
    event.target.assignedElements().forEach(element => {
      element.classList.add('ml-auto');
    });
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    if (this.closest('fds-modal')) {
      // --- Section ---
      let section = this.shadowRoot.querySelector('.solution-info-mobile');
      if (!section) {
        section = document.createElement('section');
        section.classList.add('solution-info-mobile');
        this.shadowRoot.appendChild(section);
      }

      // --- Additional info ---
      let additionalInfo = section.querySelector('slot[name="additional-info"]');
      if (!additionalInfo) {
        additionalInfo = document.createElement('slot');
        additionalInfo.name = 'additional-info';
        section.appendChild(additionalInfo);
      }
    } else {
      // --- Inner wrapper ---
      let divWrapper = this.shadowRoot.querySelector('.solution-info-inner');
      if (!divWrapper) {
        divWrapper = document.createElement('div');
        divWrapper.classList.add('solution-info-inner');
        this.shadowRoot.appendChild(divWrapper);
      }

      // --- Solution heading ---
      let solutionHeading = divWrapper.querySelector('slot[name="solution-heading"]');
      if (!solutionHeading) {
        solutionHeading = document.createElement('slot');
        solutionHeading.name = 'solution-heading';
        divWrapper.appendChild(solutionHeading);
      }

      // --- Additional info ---
      let additionalInfo = divWrapper.querySelector('slot[name="additional-info"]');
      if (!additionalInfo) {
        additionalInfo = document.createElement('slot');
        additionalInfo.name = 'additional-info';
        divWrapper.appendChild(additionalInfo);
      }

      // --- Drawer opener ---
      let drawerOpenerSlot = divWrapper.querySelector('slot[name="drawer-opener"]');
      if (!drawerOpenerSlot) {
        drawerOpenerSlot = document.createElement('slot');
        drawerOpenerSlot.name = 'drawer-opener';
        divWrapper.appendChild(drawerOpenerSlot);
      }
    }
  }
  #addEventListeners() {
    this.shadowRoot.querySelector('slot[name="drawer-opener"]')?.addEventListener('slotchange', this.#handleSlotDrawerOpenerChange);
  }
  #removeEventListeners() {
    this.shadowRoot.querySelector('slot[name="drawer-opener"]')?.removeEventListener('slotchange', this.#handleSlotDrawerOpenerChange);
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.adoptedStyleSheets = [fds_solution_info_sheet];
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    this.#setupHTML();
    this.#addEventListeners();
    this.#initialized = true;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    // The 'ready' attribute can be used to defer initialization.
    // Omit the attribute or set it to anything other than 'false' to initialize immediately.
    if (this.getAttribute('ready') === 'false') return;
    this.init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute === 'ready') {
      if (!this.#initialized && this.isConnected && newValue !== 'false') {
        this.init();
      }
      return;
    }
  }

  // #endregion
}
function registerSolutionInfo() {
  if (!customElements.get('fds-solution-info')) {
    customElements.define('fds-solution-info', FDSSolutionInfo);
  }
}
/* harmony default export */ const fds_solution_info = (registerSolutionInfo);
;// ./src/js/web-components/dropdown-menu/fds-dropdown-menu.js


class FDSDropdownMenu extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['id', 'expanded', 'ready'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get ready() {
    return this.getAttribute('ready') !== 'false';
  }
  set ready(value) {
    this.setAttribute('ready', value ? 'true' : 'false');
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #variant = null;
  #generatedPanelId = false;
  #plusIcon = 'M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z';
  #minusIcon = 'M200-440v-80h560v80H200Z';
  #chevronDownIcon = 'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z';
  #chevronUpIcon = 'M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z';
  #moreVertIcon = 'M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z';

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleClick = () => {
    this.toggle();
  };
  #handleFocusOut = event => {
    if (event.relatedTarget && !this.contains(event.relatedTarget)) {
      this.close();
    }
  };
  #handleKeydown = event => {
    if (event.key === 'Escape') {
      this.close();
      this.querySelector(':scope > .dropdown-button')?.focus();
    }
  };
  #handleItemClick = event => {
    const item = event.target.closest('[data-menu-item]');
    const menu = this.querySelector(':scope > .dropdown-menu');
    if (!item || !menu?.contains(item) || item.closest('fds-dropdown-menu') !== this) return;
    if (this.#variant === 'sort' && item.matches('button[data-value]')) {
      this.selectSortValue(item.dataset.value);
    }
    this.close();
  };
  #handleOutsideClick = event => {
    if (!this.contains(event.target)) {
      this.close();
    }
  };
  #handleResize = () => {
    this.#positionMenu();
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #isDrawerSubmenu() {
    return !!this.closest('fds-main-menu') && !this.closest('fds-main-menu .main-menu-inner');
  }
  #getSortOptions() {
    const menu = this.querySelector(':scope > .dropdown-menu');
    if (!menu) return [];
    return [...menu.querySelectorAll('button[data-value]')].filter(option => option.closest('fds-dropdown-menu') === this);
  }
  #syncPanelId() {
    const menu = this.querySelector(':scope > .dropdown-menu');
    const button = this.querySelector(':scope > .dropdown-button');
    if (!menu) return;
    if (!menu.id) {
      // No panel ID was supplied: this component owns the generated ID.
      this.#generatedPanelId = true;
      menu.id = this.id ? `${this.id}-dropdown-menu-panel` : generateAndVerifyUniqueId('dropdown');
    } else if (this.#generatedPanelId && this.id) {
      // A parent may have assigned the dropdown's ID after initialization.
      menu.id = `${this.id}-dropdown-menu-panel`;
    }
    button?.setAttribute('aria-controls', menu.id);
  }
  #setupHTML() {
    // Dropdown button
    if (!this.querySelector(':scope > .dropdown-button')) {
      this.querySelector(':scope > button')?.classList.add('dropdown-button');
    }

    // Dropdown button icon
    if (!this.querySelector(':scope > .dropdown-button span svg')) {
      let collapsedIcon = this.#moreVertIcon;
      let expandedIcon = this.#moreVertIcon;
      if (this.closest('fds-modal fds-main-menu')) {
        collapsedIcon = this.#plusIcon;
        expandedIcon = this.#minusIcon;
      } else if (this.closest('fds-main-menu .main-menu-inner li:not(.more-button)')) {
        collapsedIcon = this.#chevronDownIcon;
        expandedIcon = this.#chevronUpIcon;
      }
      const span = this.querySelector(':scope > .dropdown-button span');
      const collapsed = createSvgIcon(collapsedIcon);
      collapsed.classList.add('collapsed-icon');
      span?.appendChild(collapsed);
      const expanded = createSvgIcon(expandedIcon);
      expanded.classList.add('expanded-icon');
      span?.appendChild(expanded);
    }

    // Dropdown menu
    if (!this.querySelector(':scope > .dropdown-menu')) {
      this.querySelector(':scope > div')?.classList.add('dropdown-menu');
    }
    this.#syncPanelId();
    this.querySelectorAll(':scope > .dropdown-menu a, :scope > .dropdown-menu button').forEach(item => {
      if (item.closest('fds-dropdown-menu') === this) {
        item.setAttribute('data-menu-item', '');
      }
    });
    if (!this.hasAttribute('expanded')) {
      this.setAttribute('expanded', 'false');
    }
    this.#updateExpanded(this.getAttribute('expanded'));

    // Don't close the dropdown when something non-clickable inside it is clicked (like a subtitle)
    if (!this.#isDrawerSubmenu()) {
      this.querySelector(':scope > .dropdown-menu')?.setAttribute('tabindex', '-1');
    }
  }
  #initializeSort() {
    const options = this.#getSortOptions();
    if (!options.length) return;
    const defaultValue = this.getAttribute('default-value');
    const initialOption = options.find(option => option.dataset.value === defaultValue) ?? options[0];

    // Initial selection updates the UI without dispatching an event.
    this.selectSortValue(initialOption.dataset.value, false);
  }
  #positionMenu() {
    const menu = this.querySelector(':scope > .dropdown-menu');
    if (!menu) return;
    menu.style.removeProperty('max-width');
    menu.style.removeProperty('left');
    menu.style.removeProperty('right');
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.visualViewport?.width ?? document.documentElement.clientWidth;
    if (menu.offsetWidth > viewportWidth) {
      menu.style.maxWidth = `${viewportWidth}px`;
    } else if (rect.left < 0) {
      menu.style.left = '0px';
      menu.style.right = 'auto';
    } else if (rect.left + menu.offsetWidth > viewportWidth) {
      menu.style.left = 'auto';
      menu.style.right = '0px';
    }
  }
  #updateExpanded(value) {
    const dropdownButton = this.querySelector(':scope > .dropdown-button');
    const menu = this.querySelector(':scope > .dropdown-menu');
    if (value === 'false') {
      dropdownButton?.setAttribute('aria-expanded', 'false');
      menu?.classList.add('collapsed');
      menu?.removeAttribute('style');
      window.removeEventListener('resize', this.#handleResize);
      if (!this.#isDrawerSubmenu()) {
        document.removeEventListener('mousedown', this.#handleOutsideClick, false);
      }
      this.dispatchEvent(new Event('fds-dropdown-menu-closed'));
    } else {
      dropdownButton?.setAttribute('aria-expanded', 'true');
      menu?.classList.remove('collapsed');
      if (!this.#isDrawerSubmenu()) {
        document.addEventListener('mousedown', this.#handleOutsideClick, false);
      }
      this.#positionMenu();
      window.addEventListener('resize', this.#handleResize);
      this.dispatchEvent(new Event('fds-dropdown-menu-opened'));
    }
  }
  #addEventListeners() {
    this.querySelector(':scope > .dropdown-button')?.addEventListener('click', this.#handleClick);
    if (!this.#isDrawerSubmenu()) {
      this.addEventListener('focusout', this.#handleFocusOut, false);
      this.addEventListener('keydown', this.#handleKeydown, false);
      this.querySelector(':scope > .dropdown-menu')?.addEventListener('click', this.#handleItemClick, false);
    }
  }
  #removeEventListeners() {
    this.querySelector(':scope > .dropdown-button')?.removeEventListener('click', this.#handleClick);
    if (!this.#isDrawerSubmenu()) {
      this.removeEventListener('focusout', this.#handleFocusOut, false);
      this.removeEventListener('keydown', this.#handleKeydown, false);
      this.querySelector(':scope > .dropdown-menu')?.removeEventListener('click', this.#handleItemClick, false);
    }
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    if (this.#initialized) return;

    // Read once. Changes to variant after initialization are unsupported.
    this.#variant = this.getAttribute('variant') === 'sort' ? 'sort' : null;
    this.#setupHTML();
    if (this.#variant === 'sort') {
      this.#initializeSort();
    }
    this.#addEventListeners();
    this.#initialized = true;
  }
  toggle() {
    this.getAttribute('expanded') === 'false' ? this.setAttribute('expanded', 'true') : this.setAttribute('expanded', 'false');
  }
  open() {
    this.setAttribute('expanded', 'true');
  }
  close() {
    this.setAttribute('expanded', 'false');
  }
  selectSortValue(value) {
    let dispatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (this.#variant !== 'sort') return;
    const options = this.#getSortOptions();
    const option = options.find(item => item.dataset.value === value);
    if (!option) return;
    const previousValue = this.dataset.selectedValue ?? null;
    if (value === previousValue) return;
    options.forEach(item => item.removeAttribute('aria-current'));
    option.setAttribute('aria-current', 'true');
    this.dataset.selectedValue = value;
    const label = this.querySelector(':scope > .dropdown-button .selected-value');
    if (label) {
      label.textContent = option.textContent.trim();
    }
    if (dispatch) {
      this.dispatchEvent(new CustomEvent('fds-sort-menu-changed', {
        bubbles: true,
        detail: {
          value,
          previousValue
        }
      }));
    }
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.getAttribute('ready') === 'false') return;
    this.init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();
    window.removeEventListener('resize', this.#handleResize);
    if (!this.#isDrawerSubmenu()) {
      document.removeEventListener('mousedown', this.#handleOutsideClick, false);
    }
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute === 'ready') {
      if (!this.#initialized && this.isConnected && newValue !== 'false') {
        this.init();
      }
      return;
    }
    if (!this.#initialized || oldValue === newValue) return;
    if (attribute === 'id') {
      this.#syncPanelId();
    } else if (attribute === 'expanded') {
      this.#updateExpanded(newValue);
    }
  }

  // #endregion
}
function registerDropdownMenu() {
  if (!customElements.get('fds-dropdown-menu')) {
    customElements.define('fds-dropdown-menu', FDSDropdownMenu);
  }
}
/* harmony default export */ const fds_dropdown_menu = (registerDropdownMenu);
;// ./src/js/web-components/header/fds-main-menu.js
class FDSMainMenu extends HTMLElement {
  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #resizeObserver = null;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleLoad = () => {
    this.rebuildMoreMenu();
  };
  #handleResize = () => {
    this.rebuildMoreMenu();
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    const listItems = this.querySelectorAll('li > fds-dropdown-menu > button, li > a');
    listItems.forEach(item => {
      item.setAttribute('data-menu-item', '');
    });
    const isDesktopMainMenu = this.querySelector('.main-menu-inner');
    if (!isDesktopMainMenu) return;
    const mainMenu = this.querySelector('.main-menu-inner > nav > ul');
    if (!mainMenu) return;
    const moreMenuListItem = mainMenu.querySelector(':scope > li.more-button');
    const moreMenuId = this.getAttribute('more-menu-id');

    // Reconnecting must not create another More menu.
    if (moreMenuListItem) {
      const dropdown = moreMenuListItem.querySelector(':scope > fds-dropdown-menu');
      if (dropdown && moreMenuId !== null) {
        dropdown.id = moreMenuId;
      }
      return;
    }
    const moreMenuButtonSpan = document.createElement('span');
    moreMenuButtonSpan.textContent = 'Mere';
    const moreMenuButton = document.createElement('button');
    moreMenuButton.setAttribute('data-menu-item', '');
    moreMenuButton.appendChild(moreMenuButtonSpan);
    const moreMenuDropdownList = document.createElement('ul');
    const moreMenuDropdown = document.createElement('div');
    moreMenuDropdown.appendChild(moreMenuDropdownList);
    const moreMenu = document.createElement('fds-dropdown-menu');
    moreMenu.setAttribute('expanded', 'false');
    if (moreMenuId !== null) {
      moreMenu.id = moreMenuId;
    }
    moreMenu.appendChild(moreMenuButton);
    moreMenu.appendChild(moreMenuDropdown);
    const newMoreMenuListItem = document.createElement('li');
    newMoreMenuListItem.classList.add('more-button');
    newMoreMenuListItem.setAttribute('data-hidden', '');
    newMoreMenuListItem.appendChild(moreMenu);
    mainMenu.appendChild(newMoreMenuListItem);
  }
  #addEventListeners() {
    const isDesktopMainMenu = this.querySelector('.main-menu-inner');
    if (!isDesktopMainMenu) return;
    window.addEventListener('load', this.#handleLoad, {
      once: true
    });
    if (this.#resizeObserver) return;
    this.#resizeObserver = new ResizeObserver(this.#handleResize);
    this.#resizeObserver.observe(this);
  }
  #removeEventListeners() {
    window.removeEventListener('load', this.#handleLoad);
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
      this.#resizeObserver = null;
    }
  }

  /* 'More menu' helper functions */

  // The main menu may contain other elements than <nav> such as search - get the space available to show main menu items
  #getAvailableSpace() {
    const MAIN_MENU_INNER_PADDING_RIGHT = 16;
    let usedWidth = MAIN_MENU_INNER_PADDING_RIGHT;
    const otherMainMenuElements = this.querySelectorAll('.main-menu-inner > *:not(nav)');
    otherMainMenuElements.forEach(el => {
      usedWidth += Math.ceil(el.getBoundingClientRect().width);
    });
    const totalSpace = Math.floor(this.querySelector('.main-menu-inner')?.getBoundingClientRect().width);
    return totalSpace - usedWidth;
  }

  // List items may be hidden in the main menu - get the length of a <li> regardless of visibility
  #getListItemWidth(listItem) {
    const isHidden = listItem.hasAttribute('data-hidden');
    if (isHidden) {
      listItem.removeAttribute('data-hidden');
    }
    const width = Math.ceil(listItem.getBoundingClientRect().width);
    if (isHidden) {
      listItem.setAttribute('data-hidden', '');
    }
    return width;
  }
  // Get the number of list items that can be displayed before a more menu should appear
  #maxVisibleListItems() {
    const availableSpace = this.#getAvailableSpace();
    const listItems = [...this.querySelectorAll('.main-menu-inner > nav > ul > li:not(.more-button)')];
    let totalListWidth = 0;
    listItems.forEach(item => totalListWidth += this.#getListItemWidth(item));

    // All items fit without the more button
    if (totalListWidth <= availableSpace) return listItems.length;

    // Not all items fit, recalculate with more button width included
    const moreButtonWidth = this.#getListItemWidth(this.querySelector('.more-button'));
    let totalWidth = 0;
    let count = 0;
    for (const item of listItems) {
      totalWidth += this.#getListItemWidth(item);
      if (totalWidth + moreButtonWidth >= availableSpace) break;
      count++;
    }
    return count;
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  rebuildMoreMenu() {
    if (document.readyState !== 'complete') return;
    if (!this.querySelector('.more-button')) return;
    const listItems = this.querySelectorAll('.main-menu-inner > nav > ul > li:not(.more-button)');
    const maxVisibleListItems = this.#maxVisibleListItems();
    this.querySelector('.more-button').toggleAttribute('data-hidden', listItems.length === maxVisibleListItems);
    const moreMenuDropdownMenu = this.querySelector('.main-menu-inner li.more-button > fds-dropdown-menu > .dropdown-menu > ul');
    if (!moreMenuDropdownMenu) return;
    moreMenuDropdownMenu.innerHTML = '';
    listItems.forEach((item, index) => {
      if (index < maxVisibleListItems) {
        item.removeAttribute('data-hidden');
      } else {
        item.setAttribute('data-hidden', '');
        if (item.querySelector('fds-dropdown-menu')) {
          const customListItem = document.createElement('li');
          moreMenuDropdownMenu.appendChild(customListItem);
          const subTitle = document.createElement('span');
          subTitle.classList.add('sub-title');
          subTitle.setAttribute('aria-hidden', 'true');
          subTitle.textContent = item.querySelector('fds-dropdown-menu > .dropdown-button > span').textContent;
          customListItem.appendChild(subTitle);
          const customUnorderedList = document.createElement('ul');
          customUnorderedList.setAttribute('aria-label', subTitle.textContent);
          customListItem.appendChild(customUnorderedList);
          const dropdownListItems = item.querySelectorAll('fds-dropdown-menu > .dropdown-menu > ul > li');
          dropdownListItems.forEach(dropdownItem => {
            const clone = dropdownItem.cloneNode(true);
            customUnorderedList.appendChild(clone);
          });
        } else {
          const clone = item.cloneNode(true);
          clone.removeAttribute('data-hidden');
          moreMenuDropdownMenu.appendChild(clone);
        }
      }
    });
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.#initialized) return;
    this.#setupHTML();
    this.#addEventListeners();
    this.#initialized = true;
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();
    this.#initialized = false;
  }

  // #endregion
}
function registerMainMenu() {
  if (!customElements.get('fds-main-menu')) {
    customElements.define('fds-main-menu', FDSMainMenu);
  }
}
/* harmony default export */ const fds_main_menu = (registerMainMenu);
;// ./src/js/web-components/tooltip/fds-tooltip-utils.js
const MIN_MARGIN = 8; // Minimum margin to the edge of the viewport in pixels
const MAX_WIDTH = 330; // Maximum width of the tooltip in pixels

/**
 * Get arrow dimensions from CSS custom properties.
 *
 * @returns {{ arrowHeight: number, arrowDistanceToTarget: number }} Arrow dimensions in pixels
 */
function getArrowDimensions() {
  const style = getComputedStyle(document.documentElement);
  return {
    arrowHeight: parseInt(style.getPropertyValue('--tooltip-arrow-height')),
    arrowDistanceToTarget: parseInt(style.getPropertyValue('--tooltip-arrow-distance-to-target'))
  };
}

/**
 * Set the width of the tooltip bubble, capped at a maximum width and the viewport width.
 *
 * @param {HTMLElement} tooltip - The tooltip bubble element
 */
function setTooltipWidth(tooltip) {
  // Start with natural width
  tooltip.style.width = 'max-content';

  // Cap at max width
  if (tooltip.offsetWidth > MAX_WIDTH) {
    tooltip.style.width = `${MAX_WIDTH}px`;
  }

  // Further cap if viewport is narrower than max width
  const viewportMaxWidth = document.documentElement.clientWidth - MIN_MARGIN * 2;
  if (tooltip.offsetWidth > viewportMaxWidth) {
    tooltip.style.width = `${viewportMaxWidth}px`;
  }
}

/**
 * Set the horizontal position of the tooltip bubble, centered on the trigger element.
 * Adjusts if the tooltip exceeds the left or right edge of the viewport.
 *
 * @param {HTMLElement} tooltip - The tooltip bubble element
 * @param {HTMLElement} trigger - The trigger element
 */
function setTooltipLeft(tooltip, trigger) {
  const triggerRect = trigger.getBoundingClientRect();

  // Center tooltip on trigger
  let left = triggerRect.left + triggerRect.width / 2 - tooltip.offsetWidth / 2;

  // If tooltip exceeds right edge, shift left
  if (left + tooltip.offsetWidth > document.documentElement.clientWidth - MIN_MARGIN) {
    left = document.documentElement.clientWidth - MIN_MARGIN - tooltip.offsetWidth;
  }

  // If tooltip exceeds left edge, clamp to MIN_MARGIN
  if (left < MIN_MARGIN) {
    left = MIN_MARGIN;
  }
  tooltip.style.left = `${Math.round(left)}px`;
}

/**
 * Set the vertical placement of the tooltip bubble and arrow, either above or below the trigger element.
 * Placement is determined by the preferred placement and available space.
 *
 * @param {HTMLElement} tooltip - The tooltip bubble element
 * @param {HTMLElement} arrow - The tooltip arrow element
 * @param {HTMLElement} trigger - The trigger element
 * @param {string} preferredPlacement - Preferred placement, either 'above' or 'below'
 */
function setVerticalPlacement(tooltip, arrow, trigger, preferredPlacement) {
  const triggerRect = trigger.getBoundingClientRect();
  const {
    arrowHeight,
    arrowDistanceToTarget
  } = getArrowDimensions();

  // Calculate space available above and below the trigger
  const spaceNeeded = tooltip.offsetHeight + arrowHeight + arrowDistanceToTarget;
  const spaceAbove = triggerRect.top;
  const spaceBelow = window.innerHeight - triggerRect.bottom;

  // Determine actual placement based on preferred placement and available space
  let actualPlacement = preferredPlacement;
  if (preferredPlacement === 'above' && spaceAbove < spaceNeeded) {
    actualPlacement = 'below';
  } else if (preferredPlacement === 'below' && spaceBelow < spaceNeeded) {
    actualPlacement = 'above';
  }

  // Position tooltip bubble and arrow based on actual placement
  if (actualPlacement === 'above') {
    tooltip.style.top = `${Math.round(triggerRect.top - tooltip.offsetHeight - arrowHeight - arrowDistanceToTarget + 1)}px`;
    arrow.style.top = `${Math.round(triggerRect.top - arrowHeight - arrowDistanceToTarget)}px`;
    tooltip.classList.add('place-above');
    tooltip.classList.remove('place-below');
    arrow.classList.add('place-above');
    arrow.classList.remove('place-below');
  } else {
    tooltip.style.top = `${Math.round(triggerRect.bottom + arrowHeight + arrowDistanceToTarget - 1)}px`;
    arrow.style.top = `${Math.round(triggerRect.bottom + arrowDistanceToTarget)}px`;
    tooltip.classList.add('place-below');
    tooltip.classList.remove('place-above');
    arrow.classList.add('place-below');
    arrow.classList.remove('place-above');
  }

  // Arrow is always centered on the trigger
  arrow.style.left = `${Math.round(triggerRect.left + triggerRect.width / 2)}px`;
}
;// ./src/js/web-components/tooltip/fds-tooltip.js


class FDSTooltip extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['tooltip-text', 'placement', 'purpose', 'tooltip-id'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get tooltipText() {
    return this.getAttribute('tooltip-text');
  }
  set tooltipText(value) {
    value == null ? this.removeAttribute('tooltip-text') : this.setAttribute('tooltip-text', value);
  }
  get placement() {
    return this.getAttribute('placement') ?? 'above';
  }
  set placement(value) {
    value == null ? this.removeAttribute('placement') : this.setAttribute('placement', value);
  }
  get purpose() {
    return this.getAttribute('purpose') ?? 'hint';
  }
  set purpose(value) {
    value == null ? this.removeAttribute('purpose') : this.setAttribute('purpose', value);
  }
  get tooltipId() {
    return this.getAttribute('tooltip-id');
  }
  set tooltipId(value) {
    value == null ? this.removeAttribute('tooltip-id') : this.setAttribute('tooltip-id', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handlePointerEnter = event => {
    if (event.pointerType === 'mouse') {
      this.firstElementChild.classList.add('js-hover');
      setTimeout(() => {
        if (this.firstElementChild.classList.contains('js-hover')) {
          this.open();
        }
      }, 300);
    }
  };
  #handlePointerLeave = event => {
    if (event.pointerType === 'mouse') {
      this.firstElementChild.classList.remove('js-hover');
      this.close();
    } else if (event.pointerType === 'touch') {
      this.firstElementChild.classList.remove('js-pressing');
      this.firstElementChild.classList.remove('js-pressed');
    }
  };
  #handlePointerDown = event => {
    if (event.pointerType === 'touch') {
      this.firstElementChild.classList.remove('js-pressed');
      this.firstElementChild.releasePointerCapture(event.pointerId);
      this.firstElementChild.classList.add('js-pressing');
      setTimeout(() => {
        if (this.firstElementChild.classList.contains('js-pressing')) {
          this.firstElementChild.classList.add('js-pressed');
          this.firstElementChild.classList.remove('js-pressing');
        }
      }, 600);
    }
  };
  #handlePointerUp = event => {
    if (event.pointerType === 'touch') {
      if (this.firstElementChild.classList.contains('js-pressed')) {
        event.preventDefault();
        this.open();
      }
    }
  };
  #handleFocus = () => {
    this.open();
  };
  #handleFocusOut = event => {
    const focusLeftComponent = !this.contains(event.relatedTarget);
    if (focusLeftComponent) {
      this.close();
    }
  };
  #handleKeydown = event => {
    if (event.key === 'Escape') {
      if (this.querySelector('.tooltip').style.display !== 'none') {
        this.close();
        event.stopImmediatePropagation();
      }
    }
  };
  #handleClickOutside = event => {
    if (!this.contains(event.target)) {
      this.close();
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    if (!this.hasAttribute('tooltip-text')) return;
    const triggerElements = this.querySelectorAll(':scope > :not(.tooltip):not(.tooltip-arrow)');
    if (triggerElements.length !== 1) return;
    let tooltip = this.querySelector('.tooltip');

    // Reuse the existing tooltip ID if available, to prevent a duplicate ID being appended to the trigger's aria attribute
    const fallbackId = tooltip !== null ? tooltip.getAttribute('id') : generateAndVerifyUniqueId('tooltip-');
    const uniqueId = this.getAttribute('tooltip-id') ?? fallbackId;
    if (tooltip === null) {
      tooltip = document.createElement('span');
      tooltip.setAttribute('id', uniqueId);
      tooltip.setAttribute('role', 'tooltip');
      tooltip.setAttribute('tabindex', '-1');
      tooltip.classList.add('tooltip');
      tooltip.textContent = this.getAttribute('tooltip-text');
      tooltip.style.display = 'none';
      this.appendChild(tooltip);
    }
    let tooltipArrow = this.querySelector('.tooltip-arrow');
    if (tooltipArrow === null) {
      tooltipArrow = document.createElement('span');
      tooltipArrow.classList.add('tooltip-arrow');
      tooltipArrow.setAttribute('aria-hidden', 'true');
      tooltipArrow.style.display = 'none';
      this.appendChild(tooltipArrow);
    }
    const trigger = this.firstElementChild;
    const ariaAttribute = this.purpose === 'label' ? 'aria-labelledby' : 'aria-describedby';
    const existingValue = trigger.getAttribute(ariaAttribute);
    if (existingValue === null) {
      trigger.setAttribute(ariaAttribute, uniqueId);
    } else if (!existingValue.includes(uniqueId)) {
      trigger.setAttribute(ariaAttribute, `${existingValue} ${uniqueId}`);
    }
  }
  #addEventListeners() {
    this.firstElementChild.addEventListener('pointerenter', this.#handlePointerEnter, false);
    this.addEventListener('pointerleave', this.#handlePointerLeave, false);
    this.firstElementChild.addEventListener('pointerdown', this.#handlePointerDown, false);
    this.firstElementChild.addEventListener('pointerup', this.#handlePointerUp, false);
    this.firstElementChild.addEventListener('focus', this.#handleFocus, false);
    this.addEventListener('focusout', this.#handleFocusOut, false);
  }
  #removeEventListeners() {
    this.firstElementChild.removeEventListener('pointerenter', this.#handlePointerEnter, false);
    this.removeEventListener('pointerleave', this.#handlePointerLeave, false);
    this.firstElementChild.removeEventListener('pointerdown', this.#handlePointerDown, false);
    this.firstElementChild.removeEventListener('pointerup', this.#handlePointerUp, false);
    this.firstElementChild.removeEventListener('focus', this.#handleFocus, false);
    this.removeEventListener('focusout', this.#handleFocusOut, false);
  }
  #updatePosition() {
    setTooltipWidth(this.querySelector('.tooltip'));
    setTooltipLeft(this.querySelector('.tooltip'), this.firstElementChild);
    setVerticalPlacement(this.querySelector('.tooltip'), this.querySelector('.tooltip-arrow'), this.firstElementChild, this.placement);
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    this.#setupHTML();
    this.#addEventListeners();
    this.#initialized = true;
  }
  open() {
    this.querySelector('.tooltip').style.display = 'block';
    this.querySelector('.tooltip-arrow').style.display = 'block';
    document.addEventListener('click', this.#handleClickOutside, false);
    document.addEventListener('keydown', this.#handleKeydown, false);
    this.#updatePosition();
  }
  close() {
    this.querySelector('.tooltip').style.display = 'none';
    this.querySelector('.tooltip-arrow').style.display = 'none';
    this.firstElementChild.classList.remove('js-hover');
    this.firstElementChild.classList.remove('js-pressing');
    this.firstElementChild.classList.remove('js-pressed');
    document.removeEventListener('click', this.#handleClickOutside, false);
    document.removeEventListener('keydown', this.#handleKeydown, false);
  }
  toggle() {
    this.querySelector('.tooltip').style.display === 'none' ? this.open() : this.close();
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    this.init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();
    document.removeEventListener('click', this.#handleClickOutside, false);
    document.removeEventListener('keydown', this.#handleKeydown, false);
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    switch (attribute) {
      case 'tooltip-text':
        this.querySelector('.tooltip').textContent = newValue;
        if (this.querySelector('.tooltip').style.display !== 'none') {
          this.#updatePosition();
        }
        break;
      case 'placement':
        if (this.querySelector('.tooltip').style.display !== 'none') {
          this.#updatePosition();
        }
        break;
      case 'purpose':
        if (newValue !== 'hint' && newValue !== 'label' && newValue !== null) return;
        const trigger = this.firstElementChild;
        const tooltipId = this.querySelector('.tooltip').getAttribute('id');
        const addToAttribute = newValue === 'label' ? 'aria-labelledby' : 'aria-describedby';
        const removeFromAttribute = newValue === 'label' ? 'aria-describedby' : 'aria-labelledby';

        // Remove tooltip ID from old attribute
        const oldAttributeValue = trigger.getAttribute(removeFromAttribute);
        if (oldAttributeValue !== null) {
          const updatedValue = oldAttributeValue.replace(tooltipId, '').trim();
          // If the attribute is now empty, remove it entirely to keep the DOM clean
          updatedValue ? trigger.setAttribute(removeFromAttribute, updatedValue) : trigger.removeAttribute(removeFromAttribute);
        }

        // Add tooltip ID to new attribute
        const newAttributeValue = trigger.getAttribute(addToAttribute);
        if (newAttributeValue === null) {
          // Attribute doesn't exist yet, set it with just the tooltip ID
          trigger.setAttribute(addToAttribute, tooltipId);
        } else if (!newAttributeValue.includes(tooltipId)) {
          // Attribute already exists, append tooltip ID to preserve existing references
          trigger.setAttribute(addToAttribute, `${newAttributeValue} ${tooltipId}`);
        }
        break;
      case 'tooltip-id':
        if (newValue !== null) {
          const tooltip = this.querySelector('.tooltip');
          const trigger = this.firstElementChild;
          const ariaAttribute = this.purpose === 'label' ? 'aria-labelledby' : 'aria-describedby';
          const idToReplace = oldValue ?? tooltip.getAttribute('id');
          const ariaValue = trigger.getAttribute(ariaAttribute);
          if (ariaValue !== null) {
            trigger.setAttribute(ariaAttribute, ariaValue.replace(idToReplace, newValue).trim());
          }
          tooltip.setAttribute('id', newValue);
        }
        break;
    }
  }

  // #endregion
}
function registerTooltip() {
  if (!customElements.get('fds-tooltip')) {
    customElements.define('fds-tooltip', FDSTooltip);
  }
}
/* harmony default export */ const fds_tooltip = (registerTooltip);
;// ./src/js/web-components/tooltip/fds-tooltip-icon.js



class FDSTooltipIcon extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['tooltip-text', 'sr-label', 'placement', 'tooltip-id'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get tooltipText() {
    return this.getAttribute('tooltip-text');
  }
  set tooltipText(value) {
    value == null ? this.removeAttribute('tooltip-text') : this.setAttribute('tooltip-text', value);
  }
  get srLabel() {
    return this.getAttribute('sr-label');
  }
  set srLabel(value) {
    value == null ? this.removeAttribute('sr-label') : this.setAttribute('sr-label', value);
  }
  get placement() {
    return this.getAttribute('placement') ?? 'above';
  }
  set placement(value) {
    value == null ? this.removeAttribute('placement') : this.setAttribute('placement', value);
  }
  get tooltipId() {
    return this.getAttribute('tooltip-id');
  }
  set tooltipId(value) {
    value == null ? this.removeAttribute('tooltip-id') : this.setAttribute('tooltip-id', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #intersectionObserver = null;
  #dialog = null; // The dialog that has the 'cancel' listener while the tooltip is open inside a dialog

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleClick = () => {
    this.toggle();
  };

  // Close when focus moves outside the component. Listen for focusin on document rather
  // than focusout on this element since a click may not focus the button in Safari.
  #handleOutsideFocus = event => {
    if (!this.contains(event.target)) {
      this.close();
    }
  };
  #handleKeydown = event => {
    switch (event.key) {
      case 'Escape':
        // #handleDialogCancel handles presses on Escape so #handleKeydown should be ignored inside dialogs
        const notInsideDialog = !this.closest('dialog');
        if (this.querySelector('button').getAttribute('aria-expanded') !== 'false' && notInsideDialog) {
          this.close();
          this.querySelector('button').focus();
          event.stopImmediatePropagation();
        }
        break;
    }
  };
  #handleResize = () => {
    this.#updatePosition();
  };
  #handleScroll = () => {
    this.#updatePosition();
  };
  #handleIntersection = entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        this.close();
      }
    });
  };
  #handleOutsideClick = event => {
    if (!this.contains(event.target)) {
      this.close();
    }
  };

  // Closes the tooltip instead of the dialog when Escape is pressed inside a dialog
  #handleDialogCancel = event => {
    event.preventDefault();
    this.close();
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    // Reuse the id when possible
    const uniqueId = this.getAttribute('tooltip-id') || this.querySelector('.tooltip')?.id || generateAndVerifyUniqueId('tooltip-');
    let button = this.querySelector('button');
    if (button === null) {
      button = document.createElement('button');
      button.classList.add('button', 'button-unstyled');
      button.setAttribute('type', 'button');
      button.setAttribute('aria-controls', uniqueId);
      this.appendChild(button);
      const helpIcon = createSvgIcon('M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z');
      button.appendChild(helpIcon);
    }
    button.setAttribute('aria-label', this.getAttribute('sr-label'));
    button.setAttribute('aria-expanded', 'false');
    let ariaLive = this.querySelector('[aria-live]');
    if (ariaLive === null) {
      ariaLive = document.createElement('span');
      ariaLive.setAttribute('aria-atomic', 'true');
      ariaLive.setAttribute('aria-live', 'assertive');
      this.appendChild(ariaLive);
    }
    let tooltip = this.querySelector('.tooltip');
    if (tooltip === null) {
      tooltip = document.createElement('span');
      tooltip.setAttribute('id', uniqueId);
      tooltip.classList.add('tooltip');
      ariaLive.appendChild(tooltip);
    }
    tooltip.style.display = 'none';
    let tooltipArrow = this.querySelector('.tooltip-arrow');
    if (tooltipArrow === null) {
      tooltipArrow = document.createElement('span');
      tooltipArrow.classList.add('tooltip-arrow');
      this.appendChild(tooltipArrow);
    }
    tooltipArrow.setAttribute('aria-hidden', 'true');
    tooltipArrow.style.display = 'none';
  }
  #addEventListeners() {
    this.querySelector('button').addEventListener('click', this.#handleClick, false);
    this.addEventListener('keydown', this.#handleKeydown, false);
  }
  #removeEventListeners() {
    this.querySelector('button')?.removeEventListener('click', this.#handleClick, false);
    this.removeEventListener('keydown', this.#handleKeydown, false);
  }
  #connectIntersectionObserver() {
    if (this.#intersectionObserver) return;
    this.#intersectionObserver = new IntersectionObserver(this.#handleIntersection, {
      threshold: 0
    });
    this.#intersectionObserver.observe(this.querySelector('button'));
  }
  #disconnectIntersectionObserver() {
    if (this.#intersectionObserver) {
      this.#intersectionObserver.disconnect();
      this.#intersectionObserver = null;
    }
  }
  #updatePosition() {
    // Width must be set before left, as left depends on tooltip width
    setTooltipWidth(this.querySelector('.tooltip'));
    setTooltipLeft(this.querySelector('.tooltip'), this.querySelector('button'));
    setVerticalPlacement(this.querySelector('.tooltip'), this.querySelector('.tooltip-arrow'), this.querySelector('button'), this.placement);
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    if (!this.hasAttribute('tooltip-text') || !this.hasAttribute('sr-label')) return;
    this.#setupHTML();
    this.#addEventListeners();
    this.#initialized = true;
  }
  open() {
    this.querySelector('button').setAttribute('aria-expanded', 'true');
    this.querySelector('.tooltip-arrow').style.display = 'block';
    this.querySelector('.tooltip').style.display = 'block';
    this.querySelector('.tooltip').textContent = this.getAttribute('tooltip-text');
    this.#updatePosition();
    window.addEventListener('resize', this.#handleResize, false);
    document.addEventListener('mousedown', this.#handleOutsideClick, false);
    document.addEventListener('scroll', this.#handleScroll, true);
    document.addEventListener('keydown', this.#handleKeydown, false);
    document.addEventListener('focusin', this.#handleOutsideFocus, false);
    this.#connectIntersectionObserver();

    // Let the tooltip consume Escape key press before an ancestor dialog does.
    // The dialog is stored so the listener can be removed even if the element is detached.
    this.#dialog = this.closest('dialog');
    this.#dialog?.addEventListener('cancel', this.#handleDialogCancel);
  }
  close() {
    this.querySelector('button').setAttribute('aria-expanded', 'false');
    this.querySelector('.tooltip').style.display = 'none';
    this.querySelector('.tooltip-arrow').style.display = 'none';
    this.querySelector('.tooltip').textContent = '';
    window.removeEventListener('resize', this.#handleResize, false);
    document.removeEventListener('mousedown', this.#handleOutsideClick, false);
    document.removeEventListener('scroll', this.#handleScroll, true);
    document.removeEventListener('keydown', this.#handleKeydown, false);
    document.removeEventListener('focusin', this.#handleOutsideFocus, false);
    this.#disconnectIntersectionObserver();
    this.#dialog?.removeEventListener('cancel', this.#handleDialogCancel);
    this.#dialog = null;
  }
  toggle() {
    this.querySelector('button').getAttribute('aria-expanded') === 'false' ? this.open() : this.close();
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    this.init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();

    // Remove observer and event listeners that are temporarily added when the tooltip is open
    window.removeEventListener('resize', this.#handleResize, false);
    document.removeEventListener('mousedown', this.#handleOutsideClick, false);
    document.removeEventListener('scroll', this.#handleScroll, true);
    document.removeEventListener('keydown', this.#handleKeydown, false);
    document.removeEventListener('focusin', this.#handleOutsideFocus, false);
    this.#disconnectIntersectionObserver();
    this.#dialog?.removeEventListener('cancel', this.#handleDialogCancel);
    this.#dialog = null;
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    switch (attribute) {
      case 'tooltip-text':
        if (this.querySelector('button').getAttribute('aria-expanded') === 'true') {
          this.querySelector('.tooltip').textContent = newValue;
          this.#updatePosition();
        }
        break;
      case 'sr-label':
        this.querySelector('button').setAttribute('aria-label', newValue);
        break;
      case 'placement':
        if (this.querySelector('button').getAttribute('aria-expanded') === 'true') {
          this.#updatePosition();
        }
        break;
      case 'tooltip-id':
        if (newValue !== null) {
          const tooltip = this.querySelector('.tooltip');
          tooltip.setAttribute('id', newValue);
          this.querySelector('button').setAttribute('aria-controls', newValue);
        }
        break;
    }
  }

  // #endregion
}
function registerTooltipIcon() {
  if (!customElements.get('fds-tooltip-icon')) {
    customElements.define('fds-tooltip-icon', FDSTooltipIcon);
  }
}
/* harmony default export */ const fds_tooltip_icon = (registerTooltipIcon);
;// ./src/js/web-components/toggle-switch/fds-toggle-switch.js
class FDSToggleSwitch extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['state', 'label', 'disabled-switch'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get state() {
    return this.getAttribute('state') ?? 'off';
  } // Default state is 'off'
  set state(value) {
    value == null ? this.removeAttribute('state') : this.setAttribute('state', value);
  }
  get label() {
    return this.getAttribute('label');
  }
  set label(value) {
    value == null ? this.removeAttribute('label') : this.setAttribute('label', value);
  }
  get disabledSwitch() {
    return this.getAttribute('disabled-switch');
  }
  set disabledSwitch(value) {
    value == null ? this.removeAttribute('disabled-switch') : this.setAttribute('disabled-switch', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleClick = () => {
    this.toggle();
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    const button = this.querySelector('button') ?? document.createElement('button');
    const buttonText = this.querySelector('button span') ?? document.createElement('span');

    // Ensure label attribute is used as label when attribute is present
    buttonText.textContent = this.getAttribute('label') ?? buttonText.textContent;

    // Add the button text if not already present
    if (!buttonText.isConnected) {
      button.appendChild(buttonText);
    }

    // Add the button if not already present
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'switch');
    if (!button.isConnected) {
      this.appendChild(button);
    }

    // Set on-off state of the button
    this.#stateChange(this.getAttribute('state'), false);

    // Set disabled state of the button
    !this.hasAttribute('disabled-switch') || this.getAttribute('disabled-switch') === 'false' ? button.removeAttribute('disabled') : button.setAttribute('disabled', '');
  }
  #stateChange(newState, dispatchEvent) {
    const button = this.querySelector('button');
    let eventName = 'fds-toggle-off';
    if (newState === 'off' || !newState) {
      button.setAttribute('aria-checked', 'false');
    } else {
      button.setAttribute('aria-checked', 'true');
      eventName = 'fds-toggle-on';
    }
    if (dispatchEvent && !button.disabled) {
      this.dispatchEvent(new Event(eventName));
    }
  }
  #init() {
    this.#setupHTML();
    this.querySelector('button')?.addEventListener('click', this.#handleClick);
    this.#initialized = true;
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  on() {
    this.setAttribute('state', 'on');
  }
  off() {
    this.setAttribute('state', 'off');
  }
  toggle() {
    this.state === 'off' ? this.on() : this.off();
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    this.#init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.querySelector('button')?.removeEventListener('click', this.#handleClick);
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    switch (attribute) {
      case 'state':
        this.#stateChange(newValue, true);
        break;
      case 'label':
        const span = this.querySelector('button span');
        if (span) {
          span.textContent = newValue ?? '';
        }
        break;
      case 'disabled-switch':
        const button = this.querySelector('button');
        newValue === null || newValue === 'false' ? button.removeAttribute('disabled') : button.setAttribute('disabled', '');
        break;
    }
  }

  // #endregion
}
function registerToggleSwitch() {
  if (!customElements.get('fds-toggle-switch')) {
    customElements.define('fds-toggle-switch', FDSToggleSwitch);
  }
}
/* harmony default export */ const fds_toggle_switch = (registerToggleSwitch);
;// ./src/js/web-components/modal/fds-modal-opener.js
class FDSModalOpener extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['modal-id', 'ready'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get modalId() {
    return this.getAttribute('modal-id');
  }
  set modalId(value) {
    value == null ? this.removeAttribute('modal-id') : this.setAttribute('modal-id', value);
  }
  get ready() {
    return this.getAttribute('ready') !== 'false';
  }
  set ready(value) {
    this.setAttribute('ready', value ? 'true' : 'false');
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleClick = () => {
    const modal = document.getElementById(this.modalId);
    if (!modal) return;
    modal.open();
    this.dispatchEvent(new CustomEvent('fds-modal-opener-click', {
      bubbles: true,
      detail: {
        modalId: this.modalId
      }
    }));
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    const opener = this.firstElementChild;
    if (opener?.tagName === 'BUTTON' || opener?.tagName === 'INPUT' && opener.type === 'button') {
      opener.setAttribute('aria-haspopup', 'dialog');
    }
  }
  #addEventListeners() {
    this.firstElementChild?.addEventListener('click', this.#handleClick);
  }
  #removeEventListeners() {
    this.firstElementChild?.removeEventListener('click', this.#handleClick);
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    this.#setupHTML();
    this.#addEventListeners();
    this.#initialized = true;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.getAttribute('ready') === 'false') return;
    this.init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute === 'ready') {
      if (!this.#initialized && this.isConnected && newValue !== 'false') {
        this.init();
      }
      return;
    }
  }

  // #endregion
}
function registerModalOpener() {
  if (!customElements.get('fds-modal-opener')) {
    customElements.define('fds-modal-opener', FDSModalOpener);
  }
}
/* harmony default export */ const fds_modal_opener = (registerModalOpener);
;// ./src/js/web-components/modal/fds-modal-closer.js
class FDSModalCloser extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['return-value', 'ready'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get returnValue() {
    return this.getAttribute('return-value');
  }
  set returnValue(value) {
    value == null ? this.removeAttribute('return-value') : this.setAttribute('return-value', value);
  }
  get ready() {
    return this.getAttribute('ready') !== 'false';
  }
  set ready(value) {
    this.setAttribute('ready', value ? 'true' : 'false');
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleClick = () => {
    const dialog = this.closest('dialog');
    if (!dialog) return;
    const returnValue = this.returnValue ?? undefined;
    const event = new CustomEvent('fds-modal-closer-click', {
      bubbles: true,
      cancelable: true,
      detail: {
        returnValue
      }
    });

    // dispatchEvent() returns false if preventDefault() was called from an event handler.
    // This may happen for bottom sheets where closing the modal requires animation.
    const notPrevented = this.dispatchEvent(event);
    if (notPrevented) {
      dialog.close(returnValue);
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #addEventListeners() {
    this.firstElementChild?.addEventListener('click', this.#handleClick);
  }
  #removeEventListeners() {
    this.firstElementChild?.removeEventListener('click', this.#handleClick);
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    this.#addEventListeners();
    this.#initialized = true;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.getAttribute('ready') === 'false') return;
    this.init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute === 'ready') {
      if (!this.#initialized && this.isConnected && newValue !== 'false') {
        this.init();
      }
      return;
    }
  }

  // #endregion
}
function registerModalCloser() {
  if (!customElements.get('fds-modal-closer')) {
    customElements.define('fds-modal-closer', FDSModalCloser);
  }
}
/* harmony default export */ const fds_modal_closer = (registerModalCloser);
;// ./src/js/web-components/modal/fds-modal.js


class FDSModal extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['ready', 'heading', 'heading-id', 'dismissible', 'variant', 'close-text'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get ready() {
    return this.getAttribute('ready') !== 'false';
  }
  set ready(value) {
    this.setAttribute('ready', value ? 'true' : 'false');
  }
  get heading() {
    return this.getAttribute('heading');
  }
  set heading(value) {
    value == null ? this.removeAttribute('heading') : this.setAttribute('heading', value);
  }
  get headingId() {
    return this.getAttribute('heading-id');
  }
  set headingId(value) {
    value == null ? this.removeAttribute('heading-id') : this.setAttribute('heading-id', value);
  }
  get dismissible() {
    return this.getAttribute('dismissible') !== 'false';
  }
  set dismissible(value) {
    this.setAttribute('dismissible', value ? 'true' : 'false');
  }
  get variant() {
    return this.getAttribute('variant') ?? 'default';
  }
  set variant(value) {
    value == null ? this.removeAttribute('variant') : this.setAttribute('variant', value);
  }
  get closeText() {
    return this.getAttribute('close-text');
  }
  set closeText(value) {
    value == null ? this.removeAttribute('close-text') : this.setAttribute('close-text', value);
  }
  get dialog() {
    return this.querySelector('dialog');
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #closing = false;
  #storedReturnValue = (() => undefined)();
  #resizeObserver = null;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleClose = () => {
    if (this.#isAnimatedVariant()) {
      this.dialog.classList.remove(`${this.variant}-open`);
    }

    // Clean up in case the dialog closed some other way before the exit
    // transition finished (e.g. Escape interrupting a bottom sheet's/drawer's animation)
    if (this.#closing) {
      this.dialog.removeEventListener('transitionend', this.#handleTransitionEnd);
      this.#closing = false;
      this.#storedReturnValue = undefined;
    }
    this.dispatchEvent(new CustomEvent('fds-modal-close', {
      bubbles: true,
      detail: {
        returnValue: this.dialog.returnValue
      }
    }));
  };

  // Blocks Escape/back button/requestClose() when not dismissible (Safari)
  #handleCancel = event => {
    if (!this.dismissible) {
      event.preventDefault();
    }
  };
  #handleBackdropClick = event => {
    if (!this.dismissible) return;

    // Using the keyboard to interact with modal content can register as clicks outside the dialog.
    // Ignore these events by ensuring the event target is the dialog.
    if (event.target !== this.dialog) return;
    const rect = this.dialog.getBoundingClientRect();
    const clickedBackdrop = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (!clickedBackdrop) return;
    if (this.#isAnimatedVariant()) {
      this.#animateClose('');
    } else {
      this.dialog.close('');
    }
  };
  #handleCloserClick = event => {
    if (!this.#isAnimatedVariant()) return;
    event.preventDefault();
    this.#animateClose(event.detail?.returnValue);
  };

  // Close the modal when a nested fds-modal-opener is clicked
  #handleNestedOpenerClick = () => {
    if (this.#isAnimatedVariant()) {
      this.#animateClose('');
    } else {
      this.dialog.close('');
    }
  };
  #handleTransitionEnd = event => {
    if (event.propertyName !== 'translate' || event.target !== this.dialog) return;
    this.dialog.removeEventListener('transitionend', this.#handleTransitionEnd);
    this.#closing = false;
    this.dialog.close(this.#storedReturnValue);
    this.#storedReturnValue = undefined;
  };
  #handleBottomFade = () => {
    const scrollableArea = this.dialog?.querySelector('.scrollable-area.has-fade');
    if (!scrollableArea) return;
    const distanceFromBottom = scrollableArea.scrollHeight - scrollableArea.scrollTop - scrollableArea.clientHeight;
    const atBottom = distanceFromBottom <= 1; // 1 used instead of 0 for a small tolerance margin

    atBottom ? scrollableArea.setAttribute('data-at-bottom', '') : scrollableArea.removeAttribute('data-at-bottom');
  };
  #handleResize = entries => {
    for (const entry of entries) {
      // Close the modal if a resize caused it to become hidden
      if (entry.target === this && !this.checkVisibility()) {
        this.#forceClose();
      }
      // Scrollable areas with a fade effect might need an attribute update on resize
      else {
        this.#handleBottomFade();
      }
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    const modalTop = this.querySelector('.modal-top');
    if (!modalTop || !this.dialog) return;
    this.#updateHeading();
    let closeButton = modalTop.querySelector('.modal-close');
    if (!closeButton && this.dismissible) {
      closeButton = document.createElement('fds-modal-closer');
      closeButton.classList.add('modal-close');
      const innerButton = document.createElement('button');
      innerButton.classList.add('function-link');
      innerButton.setAttribute('type', 'button');
      closeButton.appendChild(innerButton);
      const innerButtonIcon = createSvgIcon('m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z');
      innerButton.appendChild(innerButtonIcon);
      const innerButtonText = document.createElement('span');
      innerButton.appendChild(innerButtonText);
      modalTop.appendChild(closeButton);
    }
    this.#updateCloseText();
  }
  #addEventListeners() {
    this.dialog?.addEventListener('close', this.#handleClose);
    this.dialog?.addEventListener('cancel', this.#handleCancel);
    this.dialog?.addEventListener('click', this.#handleBackdropClick);
    this.dialog?.querySelector('.scrollable-area.has-fade')?.addEventListener('scroll', this.#handleBottomFade);
    this.addEventListener('fds-modal-closer-click', this.#handleCloserClick);
    this.addEventListener('fds-modal-opener-click', this.#handleNestedOpenerClick);
  }
  #removeEventListeners() {
    this.dialog?.removeEventListener('close', this.#handleClose);
    this.dialog?.removeEventListener('cancel', this.#handleCancel);
    this.dialog?.removeEventListener('click', this.#handleBackdropClick);
    this.dialog?.querySelector('.scrollable-area.has-fade')?.removeEventListener('scroll', this.#handleBottomFade);
    this.removeEventListener('fds-modal-closer-click', this.#handleCloserClick);
    this.removeEventListener('fds-modal-opener-click', this.#handleNestedOpenerClick);
  }
  #connectResizeObserver() {
    if (this.#resizeObserver) return;
    this.#resizeObserver = new ResizeObserver(this.#handleResize);
    this.#resizeObserver.observe(this);
    const scrollableArea = this.dialog?.querySelector('.scrollable-area.has-fade');
    if (scrollableArea) {
      this.#resizeObserver.observe(scrollableArea);
    }
  }
  #disconnectResizeObserver() {
    if (this.#resizeObserver) {
      this.#resizeObserver.disconnect();
      this.#resizeObserver = null;
    }
  }

  // Sets closedby="none" when not dismissible (Chrome/Firefox). Not supported in Safari.
  #updateClosedBy() {
    if (!this.dialog) return;
    if (this.dismissible) {
      this.dialog.removeAttribute('closedby');
    } else {
      this.dialog.setAttribute('closedby', 'none');
    }
  }
  #isAnimatedVariant() {
    return this.variant === 'bottom-sheet' || this.variant === 'drawer';
  }
  #animateClose(returnValue) {
    if (this.#closing) return; // Already closing, ignore duplicate requests

    this.dialog.classList.remove(`${this.variant}-open`);
    this.#closing = true;
    this.#storedReturnValue = returnValue;
    this.dialog.addEventListener('transitionend', this.#handleTransitionEnd);
  }

  // Closes the dialog immediately, bypassing dismissible and skipping any exit transition
  #forceClose() {
    if (!this.dialog?.open) return;
    if (this.#closing) {
      this.dialog.removeEventListener('transitionend', this.#handleTransitionEnd);
      this.#closing = false;
      this.#storedReturnValue = undefined;
    }
    if (this.#isAnimatedVariant()) {
      this.dialog.classList.remove(`${this.variant}-open`);
    }
    this.dialog.close();
  }
  #updateHeading() {
    if (!this.heading) return;
    const modalTop = this.querySelector('.modal-top');
    if (!modalTop || !this.dialog) return;
    let topHeading = modalTop.querySelector('.top-heading');
    if (!topHeading) {
      topHeading = document.createElement('h2');
      topHeading.classList.add('top-heading');
      topHeading.setAttribute('tabindex', '-1');
      modalTop.prepend(topHeading);
      this.#updateHeadingId();
    }
    topHeading.textContent = this.heading;
  }
  #updateHeadingId() {
    const topHeading = this.querySelector('.top-heading');
    if (!topHeading || !this.dialog) return;
    const headingId = this.headingId && this.headingId.trim() !== '' ? this.headingId : generateAndVerifyUniqueId('top-heading-');
    topHeading.id = headingId;
    this.dialog.setAttribute('aria-labelledby', headingId);
  }
  #updateCloseText() {
    const closeButton = this.querySelector('.modal-close');
    if (!closeButton) return;
    const textSpan = closeButton.querySelector('span');
    if (textSpan) {
      textSpan.textContent = this.closeText || 'Luk';
    }
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  init() {
    this.#setupHTML();
    this.#updateClosedBy();
    this.#addEventListeners();
    this.#connectResizeObserver();
    this.#initialized = true;
  }
  open() {
    if (!this.#initialized || !this.dialog) return;
    if (this.dialog.open) return;
    if (!this.checkVisibility()) {
      console.warn('fds-modal is hidden and cannot open', this);
      return;
    }
    this.dialog.showModal();
    if (this.#isAnimatedVariant()) {
      // Ensures the closed state is painted first, otherwise the slide-in transition may be skipped
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.dialog.classList.add(`${this.variant}-open`);
        });
      });
    }
    this.dispatchEvent(new CustomEvent('fds-modal-open', {
      bubbles: true
    }));
  }
  close(returnValue) {
    if (!this.#initialized || !this.dialog?.open) return;
    if (this.#isAnimatedVariant()) {
      this.#animateClose(returnValue);
    } else {
      this.dialog.close(returnValue);
    }
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (this.getAttribute('ready') === 'false') return;
    this.init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();
    this.#disconnectResizeObserver();
    if (this.#closing) {
      this.dialog?.removeEventListener('transitionend', this.#handleTransitionEnd);
      this.#closing = false;
      this.#storedReturnValue = undefined;
    }
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (attribute === 'ready') {
      if (!this.#initialized && this.isConnected && newValue !== 'false') {
        this.init();
      }
      return;
    }
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    switch (attribute) {
      case 'dismissible':
        this.#updateClosedBy();
        break;
      case 'variant':
        this.dialog?.classList.remove('bottom-sheet-open', 'drawer-open');
        if (this.dialog?.open && this.#isAnimatedVariant()) {
          this.dialog.classList.add(`${this.variant}-open`);
        }
        break;
      case 'heading':
        this.#updateHeading();
        break;
      case 'heading-id':
        this.#updateHeadingId();
        break;
      case 'close-text':
        this.#updateCloseText();
        break;
    }
  }

  // #endregion
}
function registerModal() {
  if (!customElements.get('fds-modal')) {
    customElements.define('fds-modal', FDSModal);
  }
}
/* harmony default export */ const fds_modal = (registerModal);
;// ./src/js/utils/breakpoints.js


let breakpoints = {
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
};
/* harmony default export */ const utils_breakpoints = (breakpoints);
;// ./src/js/web-components/tabs/fds-tab-styling.js
const fds_tab_styling_styles = breakpoint => `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: inline-flex;
        color: #1a1a1a;
        background-color: #F5F5F5;
        max-width: 100%;
        align-items: center;
        text-align: center;
        border: 0;
        text-decoration: underline;
        overflow-wrap: anywhere;
        cursor: pointer;

        border-radius: 20px;
        min-height: 40px;
        padding: 1px 16px;
    }

    :host(:focus) {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    :host([aria-selected=true]) {
        color: white;
        font-weight: 700;
        text-decoration: none;
        background-color: #454545;
    }

    :host(:not([aria-selected=true]):hover) {
        background-color: #DCDCDC;
    }

    @media (min-width: ${breakpoint}) {
        :host {
            border-radius: 24px;
            min-height: 48px;
            padding: 1px 24px;
        }
    }

    ::slotted(.icon-svg) {
        margin-right: 8px;
        flex-shrink: 0;
    }
`;
;// ./src/js/web-components/tabs/fds-tab.js



class FDSTab extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['tab-key', 'breakpoint'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get tabKey() {
    return this.getAttribute('tab-key');
  }
  set tabKey(value) {
    value == null ? this.removeAttribute('tab-key') : this.setAttribute('tab-key', value);
  }

  // Only accepts a known breakpoint key (xs, sm, md, lg, xl) - anything else defaults to 'md'.
  get breakpoint() {
    const value = this.getAttribute('breakpoint');
    return value in utils_breakpoints ? value : 'md';
  }
  set breakpoint(value) {
    value == null ? this.removeAttribute('breakpoint') : this.setAttribute('breakpoint', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #sheet = (() => new CSSStyleSheet())();

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    if (!this.shadowRoot.querySelector('slot')) {
      const slot = document.createElement('slot');
      this.shadowRoot.appendChild(slot);
    }
  }
  #setupId() {
    if (this.id || !this.tabKey) return;
    this.id = generateAndVerifyUniqueId(`tab-${this.tabKey}-`);
  }
  #applyStyles() {
    this.#sheet.replaceSync(fds_tab_styling_styles(`${utils_breakpoints[this.breakpoint]}px`));
  }
  #init() {
    this.#setupHTML();
    this.#setupId();
    this.setAttribute('role', 'tab');
    this.#applyStyles();
    this.#initialized = true;
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.adoptedStyleSheets = [this.#sheet];
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    this.#init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    if (attribute === 'tab-key') {
      this.#setupId();
    } else if (attribute === 'breakpoint') {
      this.#applyStyles();
    }
  }

  // #endregion
}
function registerTab() {
  if (!customElements.get('fds-tab')) {
    customElements.define('fds-tab', FDSTab);
  }
}
/* harmony default export */ const fds_tab = (registerTab);
;// ./src/js/web-components/tabs/fds-tab-panel-styling.js
const fds_tab_panel_styling_styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        border: 1px solid var(--tab-panel-border-color);
        width: 100%;
        overflow: auto hidden;
        background-color: var(--tab-panel-background-color);
    }

    :host(:focus) {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    .scroll-container {
        display: block;
        width: fit-content;
        min-width: 100%;
        padding: 24px;
    }
`;
;// ./src/js/web-components/tabs/fds-tab-panel.js


const fds_tab_panel_sheet = new CSSStyleSheet();
fds_tab_panel_sheet.replaceSync(fds_tab_panel_styling_styles);
class FDSTabPanel extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['tab-key'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get tabKey() {
    return this.getAttribute('tab-key');
  }
  set tabKey(value) {
    value == null ? this.removeAttribute('tab-key') : this.setAttribute('tab-key', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    if (this.shadowRoot.querySelector('.scroll-container')) return;
    const container = document.createElement('div');
    container.classList.add('scroll-container');
    const slot = document.createElement('slot');
    container.appendChild(slot);
    this.shadowRoot.appendChild(container);
  }
  #setupId() {
    if (this.id || !this.tabKey) return;
    this.id = generateAndVerifyUniqueId(`tab-panel-${this.tabKey}-`);
  }
  #init() {
    this.#setupHTML();
    this.#setupId();
    this.setAttribute('role', 'tabpanel');
    this.tabIndex = 0;
    this.#initialized = true;
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.adoptedStyleSheets = [fds_tab_panel_sheet];
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    this.#init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    if (attribute === 'tab-key') {
      this.#setupId();
    }
  }

  // #endregion
}
function registerTabPanel() {
  if (!customElements.get('fds-tab-panel')) {
    customElements.define('fds-tab-panel', FDSTabPanel);
  }
}
/* harmony default export */ const fds_tab_panel = (registerTabPanel);
;// ./src/js/web-components/tabs/fds-tabs-styling.js
const fds_tabs_styling_styles = breakpoint => `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
    }

    div[role="tablist"] {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        width: var(--tabs-tablist-width);
        gap: 8px;
        margin-bottom: 8px;
    }

    @media (min-width: ${breakpoint}) {
        div[role="tablist"] {
            gap: 16px;
            margin-bottom: 16px;
        }
    }
`;
;// ./src/js/web-components/tabs/fds-tabs.js


const fds_tabs_mutationObserverConfig = {
  subtree: true,
  childList: true,
  attributes: true,
  attributeFilter: ['tab-key']
};
class FDSTabs extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['breakpoint'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get defaultTab() {
    return this.getAttribute('default-tab');
  }
  set defaultTab(value) {
    value == null ? this.removeAttribute('default-tab') : this.setAttribute('default-tab', value);
  }
  get breakpoint() {
    const value = this.getAttribute('breakpoint');
    return value in utils_breakpoints ? value : 'md';
  }
  set breakpoint(value) {
    value == null ? this.removeAttribute('breakpoint') : this.setAttribute('breakpoint', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #mutationObserver = null;
  #sheet = (() => new CSSStyleSheet())();

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleClick = event => {
    const tabElement = event.composedPath().find(node => node.nodeName === 'FDS-TAB');
    if (!tabElement || !tabElement.tabKey) return;
    this.selectTab(tabElement.tabKey);
  };
  #handleKeyDown = event => {
    const tabElement = event.composedPath().find(node => node.nodeName === 'FDS-TAB');
    if (!tabElement) return;
    const assignedTabs = this.shadowRoot.querySelector('#tab-slot').assignedElements();
    const currentIndex = assignedTabs.indexOf(tabElement);
    if (currentIndex === -1) return;
    let newIndex;
    switch (event.key) {
      case 'ArrowLeft':
        newIndex = currentIndex - 1;
        if (newIndex < 0) {
          newIndex = assignedTabs.length - 1;
        }
        break;
      case 'ArrowRight':
        newIndex = currentIndex + 1;
        if (newIndex >= assignedTabs.length) {
          newIndex = 0;
        }
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = assignedTabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault(); // Prevent default ArrowLeft, ArrowRight, Home, and End

    const newTab = assignedTabs[newIndex];
    newTab.focus();
    this.selectTab(newTab.tabKey);
  };
  #handleMutations = () => {
    this.#updateSlotAssignments();
    this.#ensureValidSelection();
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    if (this.shadowRoot.querySelector('div[role="tablist"]')) return;
    const wrapper = document.createElement('div');
    wrapper.setAttribute('role', 'tablist');
    const tabSlot = document.createElement('slot');
    tabSlot.id = 'tab-slot';
    wrapper.appendChild(tabSlot);
    const panelSlot = document.createElement('slot');
    panelSlot.id = 'panel-slot';
    this.shadowRoot.appendChild(wrapper);
    this.shadowRoot.appendChild(panelSlot);
  }
  #getSelectedTab() {
    return this.dataset.selectedTab ?? null;
  }
  #setSelectedTab(tabKey) {
    if (tabKey == null) {
      delete this.dataset.selectedTab;
    } else {
      this.dataset.selectedTab = tabKey;
    }
  }
  #applyStyles() {
    this.#sheet.replaceSync(fds_tabs_styling_styles(`${utils_breakpoints[this.breakpoint]}px`));
  }

  // Returns a Map of (tab-key, element) for all direct children matching the given tag name.
  #createTabKeyMap(tagName) {
    const validTabKeyElements = new Map();
    for (const child of this.children) {
      const isValidTabKeyElement = child.tagName === tagName && child.tabKey;
      if (isValidTabKeyElement) {
        if (validTabKeyElements.has(child.tabKey)) {
          console.warn(`fds-tabs: duplicate tab-key "${child.tabKey}" on ${tagName.toLowerCase()}.`, child);
        } else {
          validTabKeyElements.set(child.tabKey, child);
        }
      }
    }
    return validTabKeyElements;
  }

  // Assign valid tab and tab-panel pairs to slots
  #updateSlotAssignments() {
    const tabsByKey = this.#createTabKeyMap('FDS-TAB');
    const panelsByKey = this.#createTabKeyMap('FDS-TAB-PANEL');
    const pairedTabs = [];
    const pairedPanels = [];
    for (const [tabKey, tab] of tabsByKey) {
      const panel = panelsByKey.get(tabKey);
      if (panel) {
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('aria-labelledby', tab.id);
        tab.breakpoint = this.breakpoint;
        if (tabKey === this.#getSelectedTab()) {
          tab.setAttribute('aria-selected', 'true');
          tab.tabIndex = 0;
          panel.hidden = false;
        } else {
          tab.setAttribute('aria-selected', 'false');
          tab.tabIndex = -1;
          panel.hidden = true;
        }
        pairedTabs.push(tab);
        pairedPanels.push(panel);
      }
    }
    this.shadowRoot.querySelector('#tab-slot').assign(...pairedTabs);
    this.shadowRoot.querySelector('#panel-slot').assign(...pairedPanels);
  }

  // Sets the initial selection: default-tab if it matches a valid tab, otherwise the first one.
  #selectInitialTab() {
    const assignedTabs = this.shadowRoot.querySelector('#tab-slot').assignedElements();
    if (assignedTabs.length === 0) return;
    const hasDefaultTab = assignedTabs.some(tab => tab.tabKey === this.defaultTab);
    const initialTabKey = hasDefaultTab ? this.defaultTab : assignedTabs[0].tabKey;
    this.selectTab(initialTabKey, false);
  }

  // Called after tabs/panels are added or removed. If the current selection is no longer valid,
  // falls back to the first remaining tab, or clears the selection entirely if none remain.
  #ensureValidSelection() {
    const assignedTabs = this.shadowRoot.querySelector('#tab-slot').assignedElements();
    const isStillValid = assignedTabs.some(tab => tab.tabKey === this.#getSelectedTab());
    if (isStillValid) return;
    if (assignedTabs.length > 0) {
      this.selectTab(assignedTabs[0].tabKey);
    } else {
      this.#setSelectedTab(null);
    }
  }
  #connectMutationObserver() {
    if (this.#mutationObserver) return;
    this.#mutationObserver = new MutationObserver(this.#handleMutations);
    this.#mutationObserver.observe(this, fds_tabs_mutationObserverConfig);
  }
  #disconnectMutationObserver() {
    if (this.#mutationObserver) {
      this.#mutationObserver.disconnect();
      this.#mutationObserver = null;
    }
  }
  #addEventListeners() {
    this.addEventListener('click', this.#handleClick);
    this.addEventListener('keydown', this.#handleKeyDown);
  }
  #removeEventListeners() {
    this.removeEventListener('click', this.#handleClick);
    this.removeEventListener('keydown', this.#handleKeyDown);
  }
  #init() {
    // Ensures custom element children are upgraded before reading their properties (e.g. after insertions with innerHTML or devtools edits)
    customElements.upgrade(this);
    this.#applyStyles();
    this.#setupHTML();
    this.#updateSlotAssignments();
    this.#selectInitialTab();
    this.#addEventListeners();
    this.#connectMutationObserver();
    this.#initialized = true;
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open',
      slotAssignment: 'manual'
    });
    this.shadowRoot.adoptedStyleSheets = [this.#sheet];
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  selectTab(tabKey) {
    let dispatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    if (tabKey === this.#getSelectedTab()) return;
    const assignedTabs = this.shadowRoot.querySelector('#tab-slot').assignedElements();
    const assignedPanels = this.shadowRoot.querySelector('#panel-slot').assignedElements();
    const newTab = assignedTabs.find(tab => tab.tabKey === tabKey);
    if (!newTab) return; // Return if the tab to select doesn't exist

    const previousTabKey = this.#getSelectedTab();
    const previouslySelectedTabs = this.querySelectorAll(':scope > fds-tab[aria-selected="true"]');
    for (const tab of previouslySelectedTabs) {
      tab.setAttribute('aria-selected', 'false');
      tab.tabIndex = -1;
    }
    newTab.setAttribute('aria-selected', 'true');
    newTab.tabIndex = 0;
    for (const panel of assignedPanels) {
      panel.hidden = panel.tabKey !== tabKey;
    }
    this.#setSelectedTab(tabKey);
    if (dispatch) {
      this.dispatchEvent(new CustomEvent('fds-tab-changed', {
        bubbles: true,
        detail: {
          selectedTab: tabKey,
          previousTab: previousTabKey
        }
      }));
    }
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    this.#init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();
    this.#disconnectMutationObserver();
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    if (attribute === 'breakpoint') {
      this.#applyStyles();
      this.#updateSlotAssignments();
    }
  }

  // #endregion
}
function registerTabs() {
  if (!customElements.get('fds-tabs')) {
    customElements.define('fds-tabs', FDSTabs);
  }
}
/* harmony default export */ const fds_tabs = (registerTabs);
;// ./src/js/web-components/alert/fds-alert-styling.js
const fds_alert_styling_styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        margin-top: 16px;
        margin-bottom: 16px;
    }

    :host(:first-child) {
        margin-top: 0;
    }

    :host([data-visibility="hidden"]) {
        display: none;
    }

    .alert {
        position: relative;
        border-radius: 8px;
        padding: 1.6rem;
        padding-left: 5.2rem;
        background-repeat: no-repeat;
        background-color: var(--alert-background-color);
        background-image: linear-gradient(to right, var(--alert-border-color) 4px, transparent 4px);
    }

    .alert-info {
        --alert-background-color: #e2f2fb;
        --alert-border-color: #1B86C3;
    }

    .alert-success {
        --alert-background-color: #ddf7ce;
        --alert-border-color: #358000;
    }

    .alert-warning {
        --alert-background-color: #FFEECC;
        --alert-border-color: #febb30;
    }

    .alert-error {
        --alert-background-color: #FFE0E0;
        --alert-border-color: #CC0000;
    }

    .alert-row-with-close {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1.6rem;
    }

    slot[name="heading"]::slotted(*) {
        margin-top: var(--alert-heading-margin-top) !important;
        margin-bottom: var(--alert-heading-margin-bottom) !important;
        font-size: 1.6rem !important;
        line-height: 1.5 !important;
        font-weight: 600 !important;
        color: #1a1a1a !important;
        overflow-wrap: break-word !important;
        display: block !important;
        min-width: 0 !important;
    }

    .alert-row-with-close slot[name="content"]::slotted(*),
    slot[name="content"]::slotted(*) {
        margin-top: var(--alert-content-margin-top) !important;
        margin-bottom: var(--alert-content-margin-bottom) !important;
        min-width: 0 !important;
    }

    .alert-icon,
    slot[name="icon"]::slotted(*) {
        height: 2.4rem;
        width: 2.4rem;
        vertical-align: middle;
        fill: currentColor;
        position: absolute;
        left: 2rem;
    }

    .alert-close {
        background-color: rgba(0, 0, 0, 0);
        border: 0;
        border-radius: 0;
        font-weight: 400;
        margin: 0;
        padding: 0;
        text-align: left;
        min-height: auto;
        cursor: pointer;
        color: #1a1a1a;
        text-decoration: underline;
        font-size: 1.4rem;
        line-height: 2rem;
        font-weight: 400;
        letter-spacing: .2px;
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
        white-space: nowrap;
    }

    .alert-close .icon-svg {
        margin-right: 4px;
        width: 1.6rem;
        height: 1.6rem;
        fill: currentColor;
    }
`;
;// ./src/js/web-components/alert/fds-alert.js


const fds_alert_sheet = new CSSStyleSheet();
fds_alert_sheet.replaceSync(fds_alert_styling_styles);
const DEFAULT_VARIANT = 'info';
const DEFAULT_CLOSE_LABEL = 'Luk';
const ICONS = {
  info: 'M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z',
  success: 'm424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z',
  warning: 'm40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z',
  error: 'M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z'
};
const CLOSE_ICON = 'm256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z';
const ICON_LABELS = {
  info: 'Information',
  success: 'Succes',
  warning: 'Advarsel',
  error: 'Fejl'
};
class FDSAlert extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['variant', 'icon-label', 'closable', 'close-label'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get variant() {
    return this.getAttribute('variant') || DEFAULT_VARIANT;
  }
  set variant(value) {
    this.setAttribute('variant', value);
  }
  get iconLabel() {
    return this.getAttribute('icon-label') || ICON_LABELS[this.variant] || ICON_LABELS[DEFAULT_VARIANT];
  }
  set iconLabel(value) {
    value == null ? this.removeAttribute('icon-label') : this.setAttribute('icon-label', value);
  }
  get closable() {
    return this.hasAttribute('closable') && this.getAttribute('closable') !== 'false';
  }
  set closable(value) {
    this.setAttribute('closable', value ? 'true' : 'false');
  }
  get closeLabel() {
    return this.getAttribute('close-label') || DEFAULT_CLOSE_LABEL;
  }
  set closeLabel(value) {
    value == null ? this.removeAttribute('close-label') : this.setAttribute('close-label', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleCloseClick = () => {
    this.hide();
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    // --- Wrapper ---
    let alert = this.shadowRoot.querySelector('.alert');
    if (!alert) {
      alert = document.createElement('div');
      alert.classList.add('alert');
      this.shadowRoot.appendChild(alert);
    }

    // --- Icon slot ---
    if (!alert.querySelector(':scope > slot[name="icon"]')) {
      const iconSlot = document.createElement('slot');
      iconSlot.name = 'icon';
      alert.appendChild(iconSlot);
    }

    // --- Alert body ---
    let alertBody = alert.querySelector(':scope > .alert-body');
    if (!alertBody) {
      alertBody = document.createElement('div');
      alertBody.classList.add('alert-body');
      alert.appendChild(alertBody);
    }

    // --- Alert row with close button (holds either heading or content) ---
    let alertRowWithClose = alertBody.querySelector(':scope > .alert-row-with-close');
    if (!alertRowWithClose) {
      alertRowWithClose = document.createElement('div');
      alertRowWithClose.classList.add('alert-row-with-close');
      const hasHeading = this.querySelector(':scope > [slot="heading"]') !== null;
      const slotInRow = document.createElement('slot');
      slotInRow.name = hasHeading ? 'heading' : 'content'; // Row holds the heading if one exists, otherwise it holds the content
      alertRowWithClose.appendChild(slotInRow);
      alertBody.appendChild(alertRowWithClose);

      // Content still needs its own slot below the row, but only if the row took the heading
      if (hasHeading) {
        const contentSlot = document.createElement('slot');
        contentSlot.name = 'content';
        alertBody.appendChild(contentSlot);
      }
    }
    this.#applyVariant();
    this.#applyIcon();
    this.#applyClosable();

    // --- Visibility state ---
    if (!this.hasAttribute('data-visibility')) {
      this.setAttribute('data-visibility', 'visible');
    }
  }
  #applyVariant() {
    const alert = this.shadowRoot.querySelector('.alert');
    alert.className = 'alert';
    alert.classList.add(`alert-${this.variant}`);
  }
  #applyIcon() {
    const iconSlot = this.shadowRoot.querySelector('slot[name="icon"]');
    if (iconSlot.assignedNodes().length > 0) return;

    // If no icon was slotted, generate a default icon instead
    iconSlot.innerHTML = '';
    const pathD = ICONS[this.variant] || ICONS[DEFAULT_VARIANT];
    const icon = createSvgIcon(pathD);
    icon.classList.add('alert-icon');
    icon.removeAttribute('aria-hidden');
    icon.setAttribute('role', 'img');
    icon.setAttribute('aria-label', this.iconLabel);
    iconSlot.appendChild(icon);
  }
  #applyClosable() {
    const alertRowWithClose = this.shadowRoot.querySelector('.alert-row-with-close');
    let button = alertRowWithClose.querySelector(':scope > .alert-close');
    if (this.closable) {
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.classList.add('alert-close');
        const icon = createSvgIcon(CLOSE_ICON);
        button.appendChild(icon);
        const label = document.createElement('span');
        label.classList.add('alert-close-label');
        label.textContent = this.closeLabel;
        button.appendChild(label);
        button.addEventListener('click', this.#handleCloseClick);
        alertRowWithClose.appendChild(button);
      } else {
        this.#applyCloseLabel();
      }
    } else if (button) {
      button.removeEventListener('click', this.#handleCloseClick);
      button.remove();
    }
  }
  #applyCloseLabel() {
    const label = this.shadowRoot.querySelector('.alert-row-with-close > .alert-close > .alert-close-label');
    if (!label) return;
    label.textContent = this.closeLabel;
  }
  #init() {
    this.#setupHTML();
    this.#initialized = true;
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.adoptedStyleSheets = [fds_alert_sheet];
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  show() {
    this.setAttribute('data-visibility', 'visible');
    this.dispatchEvent(new CustomEvent('fds-alert-shown'));
  }
  hide() {
    this.setAttribute('data-visibility', 'hidden');
    this.dispatchEvent(new CustomEvent('fds-alert-hidden'));
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    this.#init();
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    switch (attribute) {
      case 'variant':
        this.#applyVariant();
        this.#applyIcon();
        break;
      case 'icon-label':
        this.#applyIcon();
        break;
      case 'closable':
        this.#applyClosable();
        break;
      case 'close-label':
        this.#applyCloseLabel();
        break;
    }
  }

  // #endregion
}
function registerAlert() {
  if (!customElements.get('fds-alert')) {
    customElements.define('fds-alert', FDSAlert);
  }
}
/* harmony default export */ const fds_alert = (registerAlert);
;// ./src/js/web-components/multiselect/fds-multiselect-styling.js
const fds_multiselect_styling_styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        position: relative;
        margin-top: 24px;
    }

    :host(:first-child) {
        margin-top: 0;
    }

    ::slotted([slot="label"]) {
        font-size: 1.6rem;
        line-height: 2.4rem;
        font-weight: 600;
        color: #1a1a1a;
        overflow-wrap: break-word;
        display: inline-block;
        max-width: 66ch;
        cursor: default;
    }

    .opener-wrapper {
        position: relative;
        display: grid;
        margin-top: 8px;
        max-width: 32rem;
    }

    ::slotted(fds-multiselect-opener) {
        display: block;
        grid-area: 1 / 1;
        z-index: 1;
    }

    :host(:disabled) .tag {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .tags {
        grid-area: 1 / 1;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 8px 48px 8px 16px;
        pointer-events: none;
        min-width: 0;
    }

    .tag {
        pointer-events: auto;
        appearance: none;
        display: inline-flex;
        align-items: center;
        border: none;
        border-radius: 1.2rem;
        background-color: var(--color-gray-600);
        color: var(--color-white);
        font: inherit;
        font-size: 1.6rem;
        line-height: 1.5;
        cursor: pointer;
        max-width: 100%;
        font-weight: 500;
        text-align: start;
        padding: 0 0.8rem 0 0.8rem;
    }

    .tag:hover {
        background-color: var(--color-gray-500);
    }

    .tag:focus-visible {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    .tag:disabled .icon-svg {
        display: none;
    }

    .tag-label {
        display: block;
        overflow-wrap: break-word;
        min-width: 0;
    }

    :host(:disabled) ::slotted([slot="label"]) {
        color: var(--color-gray-500);
        font-weight: 500;
    }

    .tag .icon-svg {
        min-height: 1.6rem;
        min-width: 1.6rem;
        max-height: 1.6rem;
        max-width: 1.6rem;
        fill: var(--color-white);
        margin-left: 0.4rem;
    }
`;
;// ./src/js/web-components/multiselect/fds-multiselect.js



const fds_multiselect_sheet = new CSSStyleSheet();
fds_multiselect_sheet.replaceSync(fds_multiselect_styling_styles);
class FDSMultiselect extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static formAssociated = true;
  static observedAttributes = ['name', 'sr-tags-label', 'show-required-status', 'required', 'disabled'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get name() {
    return this.getAttribute('name');
  }
  set name(value) {
    value == null ? this.removeAttribute('name') : this.setAttribute('name', value);
  }
  get srTagsLabel() {
    return this.getAttribute('sr-tags-label');
  }
  set srTagsLabel(value) {
    value == null ? this.removeAttribute('sr-tags-label') : this.setAttribute('sr-tags-label', value);
  }
  get showRequiredStatus() {
    return this.getAttribute('show-required-status');
  }
  set showRequiredStatus(value) {
    value == null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value);
  }
  get required() {
    return this.hasAttribute('required');
  }
  set required(value) {
    value ? this.setAttribute('required', '') : this.removeAttribute('required');
  }
  get disabled() {
    return this.hasAttribute('disabled') || this.#formDisabled;
  }
  set disabled(value) {
    value ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }
  get value() {
    const values = [];
    for (const sourceOption of this.querySelectorAll('fds-multiselect-option')) {
      if (this.#optionTags.has(sourceOption)) {
        values.push(sourceOption.value);
      }
    }
    return values;
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;
  #mutationObserver = null;
  #optionTags = (() => new Map())();
  #internals;
  #formDisabled = false;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleOpenerExpanded = () => {
    this.querySelector('fds-multiselect-dialog')?.open();
  };
  #handleOpenerCollapsed = () => {
    this.querySelector('fds-multiselect-dialog')?.close();
  };
  #handleOptionSelected = event => {
    this.#addTag(event.target);
  };
  #handleOptionDeselected = event => {
    this.#removeTag(event.target);
  };
  #handleLabelClick = event => {
    const label = this.#getLabel();
    if (!label || !label.contains(event.target)) return;
    if (this.disabled) return;
    this.querySelector('fds-multiselect-opener')?.focus();
  };
  #handleTagClick = event => {
    const tag = event.target.closest('.tag');
    if (!tag) return;
    const sourceOption = this.#findSourceForTag(tag);
    if (!sourceOption) return;
    const opener = this.querySelector('fds-multiselect-opener');
    if (opener?.expanded) {
      opener.close();
    }
    const tags = Array.from(this.shadowRoot.querySelectorAll('.tag'));
    const index = tags.indexOf(tag);

    // Place focus on either the next tag, the previous tag if no next tag, or on the
    // opener if no tags are left at all.
    const focusTarget = tags[index + 1] ?? tags[index - 1] ?? opener;
    sourceOption.deselect();
    focusTarget?.focus();
  };
  #handleFocusOut = event => {
    const relatedTarget = event.relatedTarget;

    // Ensure the opener only closes when something outside the multiselect gets focus.
    const stillInside = relatedTarget && this.contains(relatedTarget);
    if (stillInside) return;
    const opener = this.querySelector('fds-multiselect-opener');
    opener?.close();
  };
  #handleKeyDown = event => {
    if (event.key !== 'Escape') return;
    const opener = this.querySelector('fds-multiselect-opener');
    if (!opener?.expanded) return;
    event.preventDefault();
    opener.close();
    opener.focus();
  };
  #handleMouseDown = event => {
    if (this.disabled) {
      event.preventDefault();
    }
  };
  #handleMutations = records => {
    for (const {
      attributeName,
      target
    } of records) {
      if (attributeName === 'hidden' && target === this) {
        notifySummaryOnVisibilityChange(this);
      }
    }
    this.#wireRelationships();
  };
  #handleWindowLoad = () => {
    const tags = this.shadowRoot.querySelectorAll('.tag');
    tags.forEach(tag => this.#constrainTagWidth(tag));
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #getLabel() {
    return this.querySelector(':scope > [slot="label"]');
  }
  #findSourceForTag(tag) {
    for (const [source, tagEl] of this.#optionTags) {
      if (tagEl === tag) {
        return source;
      }
    }
    return null;
  }
  #addTag(sourceOption) {
    if (this.#optionTags.has(sourceOption)) return;
    const dialog = this.querySelector('fds-multiselect-dialog');
    const isOpen = dialog && !dialog.hidden;
    const rectBefore = isOpen ? dialog.getBoundingClientRect() : null;
    const label = sourceOption.textContent.trim();
    const tag = document.createElement('button');
    tag.classList.add('tag');
    tag.setAttribute('type', 'button');
    tag.setAttribute('aria-label', `Fjern ${label}`);
    const tagLabel = document.createElement('span');
    tagLabel.classList.add('tag-label');
    tagLabel.textContent = label;
    tag.appendChild(tagLabel);
    const closeIcon = createSvgIcon('m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z');
    tag.appendChild(closeIcon);
    this.shadowRoot.querySelector('.tags').appendChild(tag);
    this.#optionTags.set(sourceOption, tag);
    tag.disabled = this.disabled;
    this.#constrainTagWidth(tag);
    this.#refreshOpener();
    this.#updateTagsGroup();
    this.#updateFormValue();
    this.#updateValidity();

    // Prevent the dialog from changing position on the screen when an option is selected
    if (isOpen) {
      const rectAfter = dialog.getBoundingClientRect();
      const difference = rectAfter.top - rectBefore.top;
      if (difference !== 0) {
        this.#getScrollableAncestor().scrollBy(0, difference);
      }
    }
  }
  #removeTag(sourceOption) {
    const tag = this.#optionTags.get(sourceOption);
    if (!tag) return;
    const dialog = this.querySelector('fds-multiselect-dialog');
    const isOpen = dialog && !dialog.hidden;
    const rectBefore = isOpen ? dialog.getBoundingClientRect() : null;
    tag.remove();
    this.#optionTags.delete(sourceOption);
    this.#refreshOpener();
    this.#updateTagsGroup();
    this.#updateFormValue();
    this.#updateValidity();
    if (isOpen) {
      const rectAfter = dialog.getBoundingClientRect();
      const difference = rectAfter.top - rectBefore.top;
      if (difference !== 0) {
        this.#getScrollableAncestor().scrollBy(0, difference);
      }
    }
  }
  #constrainTagWidth(tag) {
    const tagLabel = tag.querySelector('.tag-label');
    const textNode = tagLabel.firstChild;
    if (!textNode) return;
    const icon = tag.querySelector('.icon-svg');

    // Calculate height threshold for when a tag's text is considered to span several lines
    const tagLineHeight = parseFloat(getComputedStyle(tag).lineHeight);
    const PIXEL_BUFFER = 1; // 1 px added to avoid issues where height may be a floating number
    const singleLineHeightThreshold = tagLineHeight + PIXEL_BUFFER;

    // Reset any previously applied constraint.
    tag.style.maxWidth = '';
    const height = tag.getBoundingClientRect().height;
    if (height <= singleLineHeightThreshold) return; // Already a single line so nothing to constrain.

    // The tag wrapped onto multiple lines. Measure the widest actual rendered
    // line and set a max-width, so the box doesn't stretch wider than the text.
    const range = document.createRange();
    range.selectNodeContents(textNode);
    let widestLine = 0;
    for (const rect of range.getClientRects()) {
      if (rect.width > widestLine) {
        widestLine = rect.width;
      }
    }
    if (widestLine === 0) return;
    const tagStyle = getComputedStyle(tag);
    const paddingLeft = parseFloat(tagStyle.paddingLeft);
    const paddingRight = parseFloat(tagStyle.paddingRight);
    const iconStyle = getComputedStyle(icon);
    const marginLeft = parseFloat(iconStyle.marginLeft);
    const iconWidth = icon ? icon.getBoundingClientRect().width : 0;
    tag.style.maxWidth = `${Math.ceil(widestLine + paddingLeft + paddingRight + marginLeft + iconWidth)}px`;
  }
  #updateTagsGroup() {
    const tags = this.shadowRoot.querySelector('.tags');
    const hasTags = tags.children.length > 0;
    const label = this.#getLabel();
    if (!hasTags || !label) {
      tags.removeAttribute('role');
      tags.removeAttribute('aria-label');
      return;
    }
    tags.setAttribute('role', 'group');
    tags.setAttribute('aria-label', this.srTagsLabel ?? `Valgte muligheder for ${label.textContent}`);
  }
  #updateFormValue() {
    if (!this.name) {
      this.#internals.setFormValue(null);
      return;
    }
    const formData = new FormData();
    for (const value of this.value) {
      formData.append(this.name, value);
    }
    this.#internals.setFormValue(formData);
  }
  #updateValidity() {
    const hasValue = this.value.length > 0;
    if (this.required && !hasValue) {
      const opener = this.querySelector('fds-multiselect-opener');
      this.#internals.setValidity({
        valueMissing: true
      }, 'Vælg mindst én mulighed', opener);
    } else {
      this.#internals.setValidity({});
    }
  }
  #updateRequiredStatus() {
    const label = this.#getLabel();
    const opener = this.querySelector('fds-multiselect-opener');
    if (!label || !opener) return;
    const value = this.getAttribute('show-required-status');
    if (value === null) {
      const indicator = label.querySelector(':scope > span.weight-normal');
      if (indicator) {
        indicator.remove();
      }
      return;
    }
    showRequiredStatus(label, opener, value);
  }
  #syncRequiredToOpener() {
    const opener = this.querySelector('fds-multiselect-opener');
    if (!opener) return;
    this.required ? opener.setAttribute('aria-required', 'true') : opener.removeAttribute('aria-required');
  }
  #syncDisabledState() {
    const opener = this.querySelector('fds-multiselect-opener');
    const isDisabled = this.disabled;
    if (opener) {
      if (isDisabled) {
        opener.setAttribute('aria-disabled', 'true');
        opener.removeAttribute('tabindex');
        if (opener.expanded) {
          opener.close();
        }
      } else {
        opener.removeAttribute('aria-disabled');
        opener.tabIndex = 0;
      }
    }
    for (const tag of this.shadowRoot.querySelectorAll('.tag')) {
      tag.disabled = isDisabled;
    }
  }
  #getScrollableAncestor() {
    let node = this.parentElement;
    while (node) {
      const style = getComputedStyle(node);
      const isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight;
      if (isScrollable) {
        return node;
      }
      node = node.parentElement;
    }
    return document.scrollingElement ?? document.documentElement;
  }
  #wireRelationships() {
    // Find the elements that need to be linked.
    const label = this.#getLabel();
    const opener = this.querySelector('fds-multiselect-opener');
    const dialog = this.querySelector('fds-multiselect-dialog');

    // Give the label, opener and dialog IDs when they don't already have them.
    if (label && !label.id) {
      label.id = generateAndVerifyUniqueId('multiselect-label');
    }
    if (opener && !opener.id) {
      opener.id = generateAndVerifyUniqueId('multiselect-opener');
    }
    if (dialog && !dialog.id) {
      dialog.id = generateAndVerifyUniqueId('multiselect-dialog');
    }

    // Name the opener by the label, and associate the opener with the dialog.
    if (opener) {
      label ? opener.setAttribute('aria-labelledby', label.id) : opener.removeAttribute('aria-labelledby');
    }
    if (opener && dialog) {
      opener.setAttribute('aria-controls', dialog.id);
    }

    // Place the opener, dialog, and error messages in their shadow DOM slots.
    if (opener) {
      opener.setAttribute('slot', 'opener');
    }
    if (dialog) {
      dialog.setAttribute('slot', 'dialog');
    }
    for (const errorMessage of this.querySelectorAll('fds-error-message')) {
      errorMessage.setAttribute('slot', 'error');
    }

    // Update the opener's required indicator, disabled state, and help/error references.
    this.#syncRequiredToOpener();
    this.#updateRequiredStatus();
    this.#syncDisabledState();
    this.#updateAriaDescribedBy();
    const currentOptions = new Set(this.querySelectorAll('fds-multiselect-option'));

    // Remove tags whose options are no longer in this multiselect.
    for (const sourceOption of this.#optionTags.keys()) {
      if (!currentOptions.has(sourceOption)) {
        this.#removeTag(sourceOption);
      }
    }

    // Ensure each selected option has a tag.
    for (const sourceOption of currentOptions) {
      if (sourceOption.selected) {
        this.#addTag(sourceOption);
      }
    }
  }

  // fds-multiselect-opener may not have been upgraded yet when called on page load.
  // Ensure refreshOpener is called when the custom element is defined.
  #refreshOpener() {
    const opener = this.querySelector('fds-multiselect-opener');
    if (typeof opener?.refreshOpener === 'function') {
      opener.refreshOpener();
      return;
    }
    customElements.whenDefined('fds-multiselect-opener').then(() => {
      this.querySelector('fds-multiselect-opener')?.refreshOpener();
    });
  }
  #notifySummaryOnceOpenerReady() {
    customElements.whenDefined('fds-multiselect-opener').then(() => {
      notifySummaryOnVisibilityChange(this);
    });
  }
  #updateAriaDescribedBy() {
    const opener = this.querySelector('fds-multiselect-opener');
    if (!opener) return;
    const errorMessages = this.querySelectorAll('fds-error-message');
    const helpTexts = this.querySelectorAll('fds-help-text');
    setAriaDescribedBy(opener, errorMessages, helpTexts);
    setInvalid(opener, errorMessages);
  }
  #setupHTML() {
    if (this.shadowRoot.querySelector('.opener-wrapper')) return;
    const labelSlot = document.createElement('slot');
    labelSlot.name = 'label';
    const defaultSlot = document.createElement('slot');
    const openerWrapper = document.createElement('div');
    openerWrapper.classList.add('opener-wrapper');
    const openerSlot = document.createElement('slot');
    openerSlot.name = 'opener';
    const tags = document.createElement('div');
    tags.classList.add('tags');
    const dialogSlot = document.createElement('slot');
    dialogSlot.name = 'dialog';
    openerWrapper.append(openerSlot, tags, dialogSlot);
    const errorSlot = document.createElement('slot');
    errorSlot.name = 'error';
    this.shadowRoot.append(labelSlot, defaultSlot, openerWrapper, errorSlot);
  }
  #connectMutationObserver() {
    if (this.#mutationObserver) return;
    this.#mutationObserver = new MutationObserver(this.#handleMutations);
    this.#mutationObserver.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['hidden', 'aria-hidden', 'id', 'class']
    });
  }
  #disconnectMutationObserver() {
    if (this.#mutationObserver) {
      this.#mutationObserver.disconnect();
      this.#mutationObserver = null;
    }
  }
  #addEventListeners() {
    this.addEventListener('fds-multiselect-opener-expanded', this.#handleOpenerExpanded);
    this.addEventListener('fds-multiselect-opener-collapsed', this.#handleOpenerCollapsed);
    this.addEventListener('fds-multiselect-option-selected', this.#handleOptionSelected);
    this.addEventListener('fds-multiselect-option-deselected', this.#handleOptionDeselected);
    this.addEventListener('click', this.#handleLabelClick);
    this.addEventListener('focusout', this.#handleFocusOut);
    this.addEventListener('keydown', this.#handleKeyDown);
    this.addEventListener('mousedown', this.#handleMouseDown);
    this.shadowRoot.addEventListener('click', this.#handleTagClick);
    window.addEventListener('load', this.#handleWindowLoad, {
      once: true
    });
  }
  #removeEventListeners() {
    this.removeEventListener('fds-multiselect-opener-expanded', this.#handleOpenerExpanded);
    this.removeEventListener('fds-multiselect-opener-collapsed', this.#handleOpenerCollapsed);
    this.removeEventListener('fds-multiselect-option-selected', this.#handleOptionSelected);
    this.removeEventListener('fds-multiselect-option-deselected', this.#handleOptionDeselected);
    this.removeEventListener('click', this.#handleLabelClick);
    this.removeEventListener('focusout', this.#handleFocusOut);
    this.removeEventListener('keydown', this.#handleKeyDown);
    this.removeEventListener('mousedown', this.#handleMouseDown);
    this.shadowRoot.removeEventListener('click', this.#handleTagClick);
    window.removeEventListener('load', this.#handleWindowLoad);
  }
  #init() {
    customElements.upgrade(this);
    this.#setupHTML();
    this.#wireRelationships();
    this.#addEventListeners();
    this.#connectMutationObserver();
    this.#updateFormValue();
    this.#updateValidity();
    this.#notifySummaryOnceOpenerReady();
    this.#initialized = true;
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.adoptedStyleSheets = [fds_multiselect_sheet];
    this.#internals = this.attachInternals();
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.#initialized) {
      this.#init();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    notifySummaryOnDisconnect(this);
    this.#removeEventListeners();
    this.#disconnectMutationObserver();
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    switch (attribute) {
      case 'name':
        this.#updateFormValue();
        break;
      case 'sr-tags-label':
        this.#updateTagsGroup();
        break;
      case 'show-required-status':
        this.#updateRequiredStatus();
        break;
      case 'required':
        this.#syncRequiredToOpener();
        this.#updateRequiredStatus();
        this.#updateValidity();
        break;
      case 'disabled':
        this.#syncDisabledState();
        break;
    }
  }

  // #endregion

  // #region - FORM-ASSOCIATED CALLBACKS ------------------------------------------------------------------

  formResetCallback() {
    for (const sourceOption of this.querySelectorAll('fds-multiselect-option')) {
      sourceOption.reset();
    }
  }
  formDisabledCallback(disabled) {
    this.#formDisabled = disabled;
    this.#syncDisabledState();
  }

  // #endregion
}
function registerMultiselect() {
  if (!customElements.get('fds-multiselect')) {
    customElements.define('fds-multiselect', FDSMultiselect);
  }
}
/* harmony default export */ const fds_multiselect = (registerMultiselect);
;// ./src/js/web-components/multiselect/fds-multiselect-opener-styling.js
const fds_multiselect_opener_styling_styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip-path: inset(50%);
        border: 0;
        user-select: none;
        white-space: nowrap;
    }

    :host {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #1a1a1a;
        font-size: 1.6rem;
        line-height: 2.4rem;
        width: 100%;
        min-width: 0;
        padding: 7px 47px 7px 15px;
        border: 1px solid var(--color-gray-400);
        border-radius: 8px;
        background-color: var(--color-white);
    }

    :host(:focus) {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    :host([aria-disabled="true"]) {
        color: #707070;
        cursor: not-allowed;
        border-color: var(--color-gray-200);
    }

    .opener-text {
        flex: 1 1 auto;
        min-width: 0;
        overflow-wrap: break-word;
    }

    .chevron-icon {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        width: 2.4rem;
        height: 2.4rem;
        pointer-events: none;
    }

    :host([aria-disabled="true"]) .chevron-icon {
        fill: #8E8E8E;
    }

    :host([aria-invalid="true"]) {
        border: 2px solid var(--color-error);
        padding: 6px 46px 6px 14px;
    }

    :host([aria-invalid="true"]) .chevron-icon {
        right: 15px;
    }
`;
;// ./src/js/web-components/multiselect/fds-multiselect-opener.js



const fds_multiselect_opener_sheet = new CSSStyleSheet();
fds_multiselect_opener_sheet.replaceSync(fds_multiselect_opener_styling_styles);
const CHEVRON_CLOSED_PATH = 'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z';
const CHEVRON_OPEN_PATH = 'M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z';
const DEFAULT_PLACEHOLDER = 'Vælg en eller flere';
class FDSMultiselectOpener extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['placeholder'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get placeholder() {
    return this.getAttribute('placeholder') ?? DEFAULT_PLACEHOLDER;
  }
  set placeholder(value) {
    value == null ? this.removeAttribute('placeholder') : this.setAttribute('placeholder', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleClick = () => {
    if (this.hasAttribute('aria-disabled')) return;
    this.toggle();
  };
  #handleKeyDown = event => {
    if (this.hasAttribute('aria-disabled')) return;
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggle();
        break;
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (this.expanded) {
          this.closest('fds-multiselect')?.querySelector('fds-multiselect-options')?.focus({
            preventScroll: true
          });
        } else {
          this.open();
        }
        break;
    }
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setChevronPath(path) {
    const chevronPath = this.shadowRoot.querySelector('.chevron-icon path');
    if (chevronPath) {
      chevronPath.setAttribute('d', path);
    }
  }
  #setupHTML() {
    if (this.shadowRoot.querySelector('.opener-text')) return;
    const openerText = document.createElement('span');
    openerText.classList.add('opener-text');
    this.shadowRoot.appendChild(openerText);
    const chevronIcon = createSvgIcon(CHEVRON_CLOSED_PATH);
    chevronIcon.classList.add('chevron-icon');
    this.shadowRoot.appendChild(chevronIcon);
  }
  #addEventListeners() {
    this.addEventListener('click', this.#handleClick);
    this.addEventListener('keydown', this.#handleKeyDown);
  }
  #removeEventListeners() {
    this.removeEventListener('click', this.#handleClick);
    this.removeEventListener('keydown', this.#handleKeyDown);
  }
  #init() {
    this.#setupHTML();
    this.setAttribute('role', 'combobox');
    this.setAttribute('aria-haspopup', 'dialog');
    this.setAttribute('aria-expanded', 'false');
    this.tabIndex = 0;
    if (!this.id) {
      this.id = generateAndVerifyUniqueId('multiselect-opener');
    }
    this.#addEventListeners();
    this.refreshOpener();
    this.#initialized = true;
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.adoptedStyleSheets = [fds_multiselect_opener_sheet];
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  get expanded() {
    return this.getAttribute('aria-expanded') === 'true';
  }
  open() {
    if (this.expanded) return;
    this.setAttribute('aria-expanded', 'true');
    this.#setChevronPath(CHEVRON_OPEN_PATH);
    this.dispatchEvent(new CustomEvent('fds-multiselect-opener-expanded', {
      bubbles: true
    }));
  }
  close() {
    if (!this.expanded) return;
    this.setAttribute('aria-expanded', 'false');
    this.#setChevronPath(CHEVRON_CLOSED_PATH);
    this.dispatchEvent(new CustomEvent('fds-multiselect-opener-collapsed', {
      bubbles: true
    }));
  }
  toggle() {
    this.expanded ? this.close() : this.open();
  }
  refreshOpener() {
    const multiselect = this.closest('fds-multiselect');
    const tags = multiselect?.shadowRoot?.querySelectorAll('.tags .tag') ?? [];

    // Extract label text from each tag
    const selectedLabels = [];
    for (const tag of tags) {
      const labelText = tag.querySelector('.tag-label')?.textContent.trim();
      if (labelText) {
        selectedLabels.push(labelText);
      }
    }
    const openerText = this.shadowRoot.querySelector('.opener-text');
    const hasSelectedOptions = selectedLabels.length > 0;
    openerText.textContent = hasSelectedOptions ? selectedLabels.join(', ') : this.placeholder;
    openerText.classList.toggle('sr-only', hasSelectedOptions);
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.#initialized) {
      this.#init();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    if (attribute === 'placeholder') {
      this.refreshOpener();
    }
  }

  // #endregion
}
function registerMultiselectOpener() {
  if (!customElements.get('fds-multiselect-opener')) {
    customElements.define('fds-multiselect-opener', FDSMultiselectOpener);
  }
}
/* harmony default export */ const fds_multiselect_opener = (registerMultiselectOpener);
;// ./src/js/web-components/multiselect/fds-multiselect-select-all-styling.js
const fds_multiselect_select_all_styling_styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        cursor: pointer;
        color: var(--color-black);
        font-size: 1.6rem;
        line-height: 1.5;
        margin-bottom: 8px;
        padding-bottom: 7px;
        border-bottom: 1px solid var(--color-gray-200);
    }

    .select-all-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding-left: 15px;
    }

    :host(:hover) .select-all-wrapper {
        background-color: var(--color-gray-100);
    }

    :host(:active) .select-all-wrapper {
        background-color: var(--color-gray-200);
    }

    .select-all-box {
        flex: 0 0 auto;
        width: 2.4rem;
        height: 2.4rem;
        border: 2px solid var(--color-black);
        border-radius: 4px;
        background-color: var(--color-white);
        margin-top: 8px;
    }

    .select-all-box .check-icon,
    .select-all-box .indeterminate-icon {
        display: none;
    }

    :host([aria-checked="true"]) .select-all-box,
    :host([aria-checked="mixed"]) .select-all-box {
        background-color: var(--color-black);
        border: 0;
    }

    :host([aria-checked="true"]) .select-all-box .check-icon {
        display: block;
        fill: var(--color-white);
    }

    :host([aria-checked="mixed"]) .select-all-box .indeterminate-icon {
        display: block;
        fill: var(--color-white);
    }

    .select-all-label {
        flex: 1 1 auto;
        min-width: 0;
        overflow-wrap: break-word;
        padding-left: 0;
        padding-top: 8px;
        padding-bottom: 8px;
    }

    :host([data-active][data-listbox-focused]) .select-all-wrapper {
        outline: 3px solid #454545;
        outline-offset: -3px;
    }

`;
;// ./src/js/web-components/multiselect/fds-multiselect-select-all.js



const fds_multiselect_select_all_sheet = new CSSStyleSheet();
fds_multiselect_select_all_sheet.replaceSync(fds_multiselect_select_all_styling_styles);
const DEFAULT_LABEL = 'Vælg alle';
const DEFAULT_TEXT_CHECKED = 'valgt';
const DEFAULT_TEXT_UNCHECKED = 'ikke valgt';
const DEFAULT_TEXT_MIXED = 'delvist valgt';
class FDSMultiselectSelectAll extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['aria-checked', 'label', 'sr-text-checked', 'sr-text-unchecked', 'sr-text-mixed'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get label() {
    return this.getAttribute('label') || DEFAULT_LABEL;
  }
  set label(value) {
    value == null ? this.removeAttribute('label') : this.setAttribute('label', value);
  }
  get srTextChecked() {
    return this.getAttribute('sr-text-checked') ?? DEFAULT_TEXT_CHECKED;
  }
  set srTextChecked(value) {
    value == null ? this.removeAttribute('sr-text-checked') : this.setAttribute('sr-text-checked', value);
  }
  get srTextUnchecked() {
    return this.getAttribute('sr-text-unchecked') ?? DEFAULT_TEXT_UNCHECKED;
  }
  set srTextUnchecked(value) {
    value == null ? this.removeAttribute('sr-text-unchecked') : this.setAttribute('sr-text-unchecked', value);
  }
  get srTextMixed() {
    return this.getAttribute('sr-text-mixed') ?? DEFAULT_TEXT_MIXED;
  }
  set srTextMixed(value) {
    value == null ? this.removeAttribute('sr-text-mixed') : this.setAttribute('sr-text-mixed', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    if (this.shadowRoot.querySelector('.select-all-wrapper')) return;
    const wrapper = document.createElement('div');
    wrapper.classList.add('select-all-wrapper');
    const box = document.createElement('span');
    box.classList.add('select-all-box');
    const checkIcon = createSvgIcon('M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z');
    checkIcon.classList.add('check-icon');
    const indeterminateIcon = createSvgIcon('M200-440v-80h560v80H200Z');
    indeterminateIcon.classList.add('indeterminate-icon');
    box.append(checkIcon, indeterminateIcon);
    const labelText = document.createElement('span');
    labelText.classList.add('select-all-label');
    wrapper.append(box, labelText);
    this.shadowRoot.appendChild(wrapper);
  }
  #updateVisibleLabel() {
    const labelText = this.shadowRoot.querySelector('.select-all-label');
    if (labelText) {
      labelText.textContent = this.label;
    }
  }

  // VoiceOver ignores aria-checked on role="option", so the state is also included in the
  // option's accessible name.
  #updateAccessibleName() {
    let stateText;
    switch (this.getAttribute('aria-checked')) {
      case 'true':
        stateText = this.srTextChecked;
        break;
      case 'mixed':
        stateText = this.srTextMixed;
        break;
      default:
        stateText = this.srTextUnchecked;
    }
    this.setAttribute('aria-label', `${this.label}, ${stateText}`);
  }
  #init() {
    this.#setupHTML();
    this.#warnIfMultipleSelectAll();
    this.setAttribute('role', 'option');
    if (!this.id) {
      this.id = generateAndVerifyUniqueId('multiselect-select-all');
    }
    if (!this.hasAttribute('aria-checked')) {
      this.setAttribute('aria-checked', 'false');
    }
    this.#updateVisibleLabel();
    this.#updateAccessibleName();
    this.#initialized = true;
  }
  #warnIfMultipleSelectAll() {
    const selectAllElements = this.parentElement?.querySelectorAll('fds-multiselect-select-all');
    if (selectAllElements?.length > 1) {
      console.warn(`<fds-multiselect-options> found ${selectAllElements.length} <fds-multiselect-select-all> elements. Only one is supported.`);
    }
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.adoptedStyleSheets = [fds_multiselect_select_all_sheet];
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  get checked() {
    return this.getAttribute('aria-checked') === 'true';
  }
  toggle() {
    const willBeChecked = this.getAttribute('aria-checked') !== 'true';
    this.setAttribute('aria-checked', willBeChecked ? 'true' : 'false');
    this.dispatchEvent(new CustomEvent('fds-multiselect-select-all-toggled', {
      bubbles: true,
      detail: {
        checked: willBeChecked
      }
    }));
  }

  // Called by fds-multiselect-options
  reflectState(state) {
    this.setAttribute('aria-checked', state);
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.#initialized) {
      this.#init();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    switch (attribute) {
      case 'label':
        this.#updateVisibleLabel();
        this.#updateAccessibleName();
        break;
      case 'aria-checked':
      case 'sr-text-checked':
      case 'sr-text-unchecked':
      case 'sr-text-mixed':
        this.#updateAccessibleName();
        break;
    }
  }

  // #endregion
}
function registerMultiselectSelectAll() {
  if (!customElements.get('fds-multiselect-select-all')) {
    customElements.define('fds-multiselect-select-all', FDSMultiselectSelectAll);
  }
}
/* harmony default export */ const fds_multiselect_select_all = (registerMultiselectSelectAll);
;// ./src/js/web-components/multiselect/fds-multiselect-options-styling.js
const fds_multiselect_options_styling_styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
    }

    :host(:focus) {
        outline: 0;
    }

    ::slotted(fds-multiselect-option),
    ::slotted(fds-multiselect-select-all) {
        min-width: 0;
    }

    :host(:focus) ::slotted(fds-multiselect-option[data-active]) {
        outline: 3px solid #454545;
        outline-offset: -3px;
    }
`;
;// ./src/js/web-components/multiselect/fds-multiselect-options.js


const fds_multiselect_options_sheet = new CSSStyleSheet();
fds_multiselect_options_sheet.replaceSync(fds_multiselect_options_styling_styles);
class FDSMultiselectOptions extends HTMLElement {
  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleClick = event => {
    const item = event.target.closest('fds-multiselect-select-all, fds-multiselect-option');
    if (!item) return;
    this.#setActiveOption(item);
    item.toggle();
  };
  #handleFocus = () => {
    this.querySelector('fds-multiselect-select-all')?.setAttribute('data-listbox-focused', '');
    if (this.#getActiveOption()) return;
    const items = this.#getNavigableItems();
    if (items.length > 0) {
      this.#setActiveOption(items[0]);
    }
  };

  // Needed for proper styling of the "select all" option
  #handleBlur = () => {
    this.querySelector('fds-multiselect-select-all')?.removeAttribute('data-listbox-focused');
  };
  #handleKeyDown = event => {
    const items = this.#getNavigableItems();
    const active = this.#getActiveOption();
    const currentIndex = active ? items.indexOf(active) : -1;
    switch (event.key) {
      case 'ArrowDown':
        {
          event.preventDefault();
          const nextIndex = Math.min(currentIndex + 1, items.length - 1);
          this.#setActiveOption(items[nextIndex]);
          break;
        }
      case 'ArrowUp':
        {
          event.preventDefault();
          const previousIndex = currentIndex < 0 ? 0 : Math.max(currentIndex - 1, 0);
          this.#setActiveOption(items[previousIndex]);
          break;
        }
      case 'Home':
        event.preventDefault();
        this.#setActiveOption(items[0]);
        break;
      case 'End':
        event.preventDefault();
        this.#setActiveOption(items[items.length - 1]);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        active?.toggle();
        break;
    }
  };
  #handleSelectAllToggled = event => {
    const shouldSelectAll = event.detail.checked;
    for (const option of this.querySelectorAll('fds-multiselect-option')) {
      if (option.selected !== shouldSelectAll) {
        option.toggle();
      }
    }
  };
  #handleOptionSelectedOrDeselected = () => {
    this.#updateSelectAllState();
  };
  #handleSlotChange = () => {
    this.#updateSelectAllState();
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #getActiveOption() {
    const activeId = this.getAttribute('aria-activedescendant');
    if (!activeId) return null;
    return this.querySelector(`#${activeId}`);
  }
  #setActiveOption(option) {
    if (!option) return;
    const previous = this.#getActiveOption();
    if (previous) {
      previous.removeAttribute('data-active');
    }
    option.setAttribute('data-active', '');
    this.setAttribute('aria-activedescendant', option.id);
    option.scrollIntoView({
      block: 'nearest'
    });
  }
  #getNavigableItems() {
    return Array.from(this.querySelectorAll('fds-multiselect-select-all, fds-multiselect-option'));
  }
  #updateSelectAllState() {
    const selectAll = this.querySelector('fds-multiselect-select-all');
    if (!selectAll) return;
    const options = Array.from(this.querySelectorAll('fds-multiselect-option'));
    const total = options.length;
    const selectedCount = options.filter(option => option.selected).length;
    let state = 'false';
    if (total > 0 && selectedCount === total) {
      state = 'true';
    } else if (selectedCount > 0) {
      state = 'mixed';
    }
    selectAll.reflectState(state);
  }
  #setupHTML() {
    if (this.shadowRoot.querySelector('slot')) return;
    const slot = document.createElement('slot');
    this.shadowRoot.appendChild(slot);
  }
  #addEventListeners() {
    this.addEventListener('click', this.#handleClick);
    this.addEventListener('focus', this.#handleFocus);
    this.addEventListener('keydown', this.#handleKeyDown);
    this.addEventListener('fds-multiselect-select-all-toggled', this.#handleSelectAllToggled);
    this.addEventListener('fds-multiselect-option-selected', this.#handleOptionSelectedOrDeselected);
    this.addEventListener('fds-multiselect-option-deselected', this.#handleOptionSelectedOrDeselected);
    this.shadowRoot.querySelector('slot').addEventListener('slotchange', this.#handleSlotChange);
  }
  #removeEventListeners() {
    this.removeEventListener('click', this.#handleClick);
    this.removeEventListener('focus', this.#handleFocus);
    this.removeEventListener('keydown', this.#handleKeyDown);
    this.removeEventListener('fds-multiselect-select-all-toggled', this.#handleSelectAllToggled);
    this.removeEventListener('fds-multiselect-option-selected', this.#handleOptionSelectedOrDeselected);
    this.removeEventListener('fds-multiselect-option-deselected', this.#handleOptionSelectedOrDeselected);
    this.shadowRoot.querySelector('slot')?.removeEventListener('slotchange', this.#handleSlotChange);
  }
  #init() {
    this.#setupHTML();
    this.setAttribute('role', 'listbox');
    this.setAttribute('aria-multiselectable', 'true');
    this.tabIndex = 0;
    if (!this.id) {
      this.id = generateAndVerifyUniqueId('multiselect-options');
    }
    this.#addEventListeners();

    // fds-multiselect-select-all / fds-multiselect-option may not yet be upgraded when this
    // runs, which would make the initial state computation see "selected" as false even for
    // default-selected options. Recompute once upgrades are guaranteed to have happened.
    Promise.all([customElements.whenDefined('fds-multiselect-select-all'), customElements.whenDefined('fds-multiselect-option')]).then(() => this.#updateSelectAllState());
    this.#initialized = true;
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.adoptedStyleSheets = [fds_multiselect_options_sheet];
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.#initialized) {
      this.#init();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#handleBlur();
    this.#removeEventListeners();
    this.#initialized = false;
  }

  // #endregion
}
function registerMultiselectOptions() {
  if (!customElements.get('fds-multiselect-options')) {
    customElements.define('fds-multiselect-options', FDSMultiselectOptions);
  }
}
/* harmony default export */ const fds_multiselect_options = (registerMultiselectOptions);
;// ./src/js/web-components/multiselect/fds-multiselect-option-styling.js
const fds_multiselect_option_styling_styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 8px 15px;
        cursor: pointer;
        color: var(--color-black);
        font-size: 1.6rem;
        line-height: 1.5;
    }

    :host(:hover) {
        background-color: var(--color-gray-100);
    }

    :host(:active) {
        background-color: var(--color-gray-200);
    }

    .option-checkbox {
        flex: 0 0 auto;
        width: 2.4rem;
        height: 2.4rem;
        border: 2px solid var(--color-black);
        border-radius: 4px;
        background-color: var(--color-white);
    }

    .option-checkbox path {
        display: none;
    }

    :host([aria-selected="true"]) .option-checkbox {
        background-color: var(--color-black);
        border: 0;
    }

    :host([aria-selected="true"]) .option-checkbox path {
        display: block;
        fill: var(--color-white);
    }

    .option-label {
        flex: 1 1 auto;
        min-width: 0;
        overflow-wrap: break-word;
    }
`;
;// ./src/js/web-components/multiselect/fds-multiselect-option.js



const fds_multiselect_option_sheet = new CSSStyleSheet();
fds_multiselect_option_sheet.replaceSync(fds_multiselect_option_styling_styles);
class FDSMultiselectOption extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['default-selected'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get value() {
    return this.getAttribute('value') ?? this.textContent.trim();
  }
  set value(value) {
    value == null ? this.removeAttribute('value') : this.setAttribute('value', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    if (this.shadowRoot.querySelector('slot')) return;
    const checkbox = createSvgIcon('M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z');
    checkbox.classList.add('option-checkbox');
    this.shadowRoot.appendChild(checkbox);
    const labelWrapper = document.createElement('span');
    labelWrapper.classList.add('option-label');
    const slot = document.createElement('slot');
    labelWrapper.appendChild(slot);
    this.shadowRoot.appendChild(labelWrapper);
  }
  #init() {
    this.#setupHTML();
    this.setAttribute('role', 'option');
    if (!this.id) {
      this.id = generateAndVerifyUniqueId('multiselect-option');
    }
    if (!this.hasAttribute('aria-selected')) {
      this.setAttribute('aria-selected', this.hasAttribute('default-selected') ? 'true' : 'false');
    }
    this.#initialized = true;
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.adoptedStyleSheets = [fds_multiselect_option_sheet];
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  get selected() {
    return this.getAttribute('aria-selected') === 'true';
  }
  toggle() {
    const willBeSelected = !this.selected;
    this.setAttribute('aria-selected', willBeSelected ? 'true' : 'false');
    this.dispatchEvent(new CustomEvent(willBeSelected ? 'fds-multiselect-option-selected' : 'fds-multiselect-option-deselected', {
      bubbles: true
    }));
  }
  deselect() {
    if (!this.selected) return;
    this.setAttribute('aria-selected', 'false');
    this.dispatchEvent(new CustomEvent('fds-multiselect-option-deselected', {
      bubbles: true
    }));
  }
  reset() {
    const willBeSelected = this.hasAttribute('default-selected');
    this.setAttribute('aria-selected', willBeSelected ? 'true' : 'false');
    this.dispatchEvent(new CustomEvent(willBeSelected ? 'fds-multiselect-option-selected' : 'fds-multiselect-option-deselected', {
      bubbles: true
    }));
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.#initialized) {
      this.#init();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
  }

  // #endregion
}
function registerMultiselectOption() {
  if (!customElements.get('fds-multiselect-option')) {
    customElements.define('fds-multiselect-option', FDSMultiselectOption);
  }
}
/* harmony default export */ const fds_multiselect_option = (registerMultiselectOption);
;// ./src/js/web-components/multiselect/fds-multiselect-dialog-styling.js
const fds_multiselect_dialog_styling_styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-width: 32rem;
        max-height: min(440px, 100vh);
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 10;
        background-color: var(--color-white);
        border: 1px solid #8E8E8E;
        border-radius: 8px;
        margin-top: 4px;
        padding-top: 7px;
        padding-bottom: 7px;
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, .2);
    }

    :host([hidden]) {
        display: none;
    }
`;
;// ./src/js/web-components/multiselect/fds-multiselect-dialog.js


const fds_multiselect_dialog_sheet = new CSSStyleSheet();
fds_multiselect_dialog_sheet.replaceSync(fds_multiselect_dialog_styling_styles);
const DEFAULT_HEADING = 'Vælg en eller flere muligheder';
class FDSMultiselectDialog extends HTMLElement {
  // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

  static observedAttributes = ['sr-heading'];

  // #endregion

  // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

  get srHeading() {
    return this.getAttribute('sr-heading') ?? DEFAULT_HEADING;
  }
  set srHeading(value) {
    value == null ? this.removeAttribute('sr-heading') : this.setAttribute('sr-heading', value);
  }

  // #endregion

  // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

  #initialized = false;

  // #endregion

  // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

  #handleMouseDown = event => {
    if (event.target.closest('fds-multiselect-options')) return;

    // Prevent closing the dialog when something else inside it is clicked.
    event.preventDefault();
  };

  // #endregion

  // #region - PRIVATE METHODS ----------------------------------------------------------------------------

  #setupHTML() {
    if (this.shadowRoot.querySelector('slot')) return;
    const slot = document.createElement('slot');
    this.shadowRoot.appendChild(slot);
  }
  #addEventListeners() {
    this.addEventListener('mousedown', this.#handleMouseDown);
  }
  #removeEventListeners() {
    this.removeEventListener('mousedown', this.#handleMouseDown);
  }
  #init() {
    this.#setupHTML();
    this.setAttribute('role', 'dialog');
    this.setAttribute('aria-label', this.srHeading);
    if (!this.id) {
      this.id = generateAndVerifyUniqueId('multiselect-dialog');
    }
    this.hidden = true;
    this.#addEventListeners();
    this.#initialized = true;
  }

  // #endregion

  // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

  constructor() {
    super();
    this.attachShadow({
      mode: 'open'
    });
    this.shadowRoot.adoptedStyleSheets = [fds_multiselect_dialog_sheet];
  }

  // #endregion

  // #region - PUBLIC METHODS -----------------------------------------------------------------------------

  open() {
    if (!this.hidden) return;
    this.hidden = false;
  }
  close() {
    if (this.hidden) return;
    this.hidden = true;
  }

  // #endregion

  // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

  connectedCallback() {
    if (!this.#initialized) {
      this.#init();
    }
  }

  // #endregion

  // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

  disconnectedCallback() {
    this.#removeEventListeners();
    this.#initialized = false;
  }

  // #endregion

  // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

  attributeChangedCallback(attribute, oldValue, newValue) {
    if (!this.#initialized) return;
    if (oldValue === newValue) return;
    if (attribute === 'sr-heading') {
      this.setAttribute('aria-label', this.srHeading);
    }
  }

  // #endregion
}
function registerMultiselectDialog() {
  if (!customElements.get('fds-multiselect-dialog')) {
    customElements.define('fds-multiselect-dialog', FDSMultiselectDialog);
  }
}
/* harmony default export */ const fds_multiselect_dialog = (registerMultiselectDialog);
;// ./src/js/dkfds-web-components.js


// Web Components





































const registerCustomElements = () => {
  fds_accordion();
  fds_accordion_group();
  fds_input();
  fds_help_text();
  fds_character_limit();
  fds_error_message();
  fds_checkbox();
  fds_checkbox_group();
  fds_radio_button();
  fds_radio_button_group();
  fds_date_input();
  fds_select();
  fds_date_picker();
  fds_date_picker_grid();
  fds_textarea();
  fds_error_summary();
  input_affix();
  fds_portal_info();
  fds_solution_info();
  fds_dropdown_menu();
  fds_main_menu();
  fds_tooltip();
  fds_tooltip_icon();
  fds_toggle_switch();
  fds_modal_opener();
  fds_modal_closer();
  fds_modal();
  fds_tab();
  fds_tab_panel();
  fds_tabs();
  fds_alert();
  fds_multiselect_option();
  fds_multiselect_select_all();
  fds_multiselect_options();
  fds_multiselect_opener();
  fds_multiselect_dialog();
  fds_multiselect();
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', registerCustomElements);
} else {
  registerCustomElements();
}

/******/ 	return __webpack_exports__;
/******/ })()
;
});