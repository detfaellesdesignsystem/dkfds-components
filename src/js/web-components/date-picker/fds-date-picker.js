import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as Util from './fds-date-picker-utils';
import * as CE from '../custom-element-utils';

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
        const wrapperHiddenChanged = records.some(record =>
            record.attributeName === 'hidden' && record.target === this
        );

        if (wrapperHiddenChanged) {
            CE.notifySummaryOnVisibilityChange(this);
        }

        const shouldUpdate = records.some(record => this.#hasRelevantMutationHappened(record.addedNodes, record.removedNodes, record.target, record.attributeName));

        if (shouldUpdate) {
            this.#setupInput();
            this.#setupLabel();
            if (this.hasAttribute('show-required-status')) {
                const label = this.querySelector('label');
                const input = this.querySelector('input');
                CE.showRequiredStatus(label, input, this.getAttribute('show-required-status'));
            }
            if (this.querySelector('.date-button')) {
                this.querySelector('input')?.hasAttribute('disabled') ? this.querySelector('.date-button').setAttribute('disabled', '') : this.querySelector('.date-button').removeAttribute('disabled');
            }
        }
    }

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

        CE.associateLabelWithElement(label, input, 'datp');

        this.#setupInput();
        this.#setupLabel();

        /* Update text */

        if (this.hasAttribute('text-open')) { this.#textOpen = this.getAttribute('text-open'); }
        if (this.hasAttribute('text-selecteddate')) { this.#textSelectedDate = this.getAttribute('text-selecteddate'); }
        if (this.hasAttribute('text-months')) { this.#updateTextMonths(this.getAttribute('text-months')) }

        /* Add date picker button next to the input */

        const dateButton = this.querySelector('.date-button') || document.createElement('button');
        if (!dateButton.querySelector('svg')) {
            dateButton.setAttribute('aria-haspopup', 'dialog');
            dateButton.classList.add('button', 'button-icon-only', 'date-button');
            dateButton.setAttribute('aria-label', this.#textOpen);
            dateButton.setAttribute('type', 'button');
            const svg = CE.createSvgIcon("M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z");
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
            const svgClose = CE.createSvgIcon('m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z');
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
        this.#datePickerObserver.observe(this, CE.mutationObserverConfig);
    }



    #hasRelevantMutationHappened(addedNodes, removedNodes, target, attributeName) {
        if (
            attributeName === 'disabled' && target?.tagName === 'INPUT' ||
            attributeName === 'required' && target?.tagName === 'INPUT' ||
            attributeName === 'class' && target?.tagName !== 'LABEL' ||
            attributeName === 'id' ||
            attributeName === 'hidden' ||
            attributeName === 'aria-hidden'
        ) {
            return true;
        }

        const relevantTagNames = ['LABEL', 'INPUT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
        const allNodes = [...addedNodes, ...removedNodes];
        return allNodes.some(node => relevantTagNames.includes(node?.tagName));
    }

    #updateDateButton(date) {
        if (Util.isValidDate(date)) {
            const day = date.getDate();
            const month = date.getMonth();
            const year = date.getFullYear();
            const ariaLabel = this.#textSelectedDate
                .replace('DAY', day)
                .replace('MONTH', this.#MONTHS[month])
                .replace('YEAR', year);
            this.querySelector('.date-button').setAttribute('aria-label', `${this.#textOpen}, ${ariaLabel}`);
        }
        else {
            this.querySelector('.date-button').setAttribute('aria-label', this.#textOpen);
        }
    }

    #updateSelectedDateAttr(date) {
        if (Util.isValidDate(date)) {
            this.querySelector('fds-date-picker-grid').setAttribute('selected-date', Util.ISOFormatFromDate(date));
        }
        else {
            this.querySelector('fds-date-picker-grid').setAttribute('selected-date', '');
        }
    }

    #closeOnFocusOut(event) {
        if (!this.contains(event.relatedTarget)) {
            // If anything is entered in the input field, the date picker must match
            if (this.querySelector('input').value !== '') {
                const dayMonthYearFormat = true;
                const date = Util.stringToDate(this.querySelector('input').value, dayMonthYearFormat);

                this.#updateDateButton(date);
                this.#updateSelectedDateAttr(date);
            }
            this.close();
        }
    }

    #datePickerButtonClicked() {
        if (this.querySelector('input').value !== '') {
            const dayMonthYearFormat = true;
            const date = Util.stringToDate(this.querySelector('input').value, dayMonthYearFormat);

            this.#updateDateButton(date);
            this.#updateSelectedDateAttr(date);
        }

        this.toggle();

        if (!this.querySelector('.ce-date-picker').classList.contains('d-none')) {
            this.querySelector('fds-date-picker-grid').focusFocusableDate();
        }
    }

    #dateSelected() {
        const selectedDate = Util.stringToDate(this.querySelector('fds-date-picker-grid').getAttribute('selected-date'));

        this.#updateDateButton(selectedDate);

        // Update value in input field unless focus is on the input - otherwise, you risk moving the caret during typing
        if (document.activeElement !== this.querySelector('input')) {
            if (Util.isValidDate(selectedDate)) {
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

        const inputDate = Util.stringToDate(event.target.value, dayMonthYearFormat);
        if (Util.isValidDate(inputDate)) {
            this.querySelector('fds-date-picker-grid').setAttribute('selected-date', Util.ISOFormatFromDate(inputDate));
        }
        else {
            this.querySelector('fds-date-picker-grid').setAttribute('selected-date', '');
        }
    }

    #updateOnPageshow() {
        let date = new Date('invalid');

        if (this.querySelector('input').value !== '') {
            const dayMonthYearFormat = true;
            date = Util.stringToDate(this.querySelector('input').value, dayMonthYearFormat);
            this.#updateDateButton(date);
            this.#updateSelectedDateAttr(date); // The value in the input field supersedes the selected-date attribute
        }
        else if (this.querySelector('fds-date-picker-grid').hasAttribute('selected-date')) {
            date = Util.stringToDate(this.querySelector('fds-date-picker-grid').getAttribute('selected-date'));
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
                }
                else {
                    if (event.target === this.querySelector('.close-button')) {
                        event.preventDefault();
                        if (!previousButton.hasAttribute('disabled')) {
                            previousButton.focus();
                        }
                        else {
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

        this.#handleDatePickerButtonClick = () => { this.#datePickerButtonClicked(); };
        this.#handleFocusOut = (event) => { this.#closeOnFocusOut(event); };
        this.#handleDateSelection = () => { this.#dateSelected() };
        this.#handleDateClick = () => { this.#closeAndFocusButton() };
        this.#handleCloseClick = () => { this.#closeAndFocusButton() };
        this.#handleInput = (event) => { this.#inputUpdated(event) };
        this.#handlePageShow = () => { this.#updateOnPageshow() };
        this.#handleKeydown = (event) => { this.#keyboardNavigation(event); };
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

        if (this.hasAttribute('show-required-status')) { CE.showRequiredStatus(label, input, this.getAttribute('show-required-status')); }

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
        CE.notifySummaryOnDisconnect(this)

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

        if (attribute === 'show-required-status' && (oldValue !== newValue)) {
            const label = this.querySelector('label');
            const input = this.querySelector('input');
            CE.showRequiredStatus(label, input, newValue);
        }

        if (attribute === 'format' && (oldValue !== newValue)) {
            if (document.activeElement !== this.querySelector('input')) {

                // If the new format is valid...
                if (this.hasAttribute('format') && this.#FORMATS.includes(newValue)) {
                    const dayMonthYearFormat = true;
                    const date = Util.stringToDate(this.querySelector('input').value, dayMonthYearFormat);

                    // ...and if the input field contains a valid date...
                    if (Util.isValidDate(date)) {
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

        if (attribute === 'text-months') { this.#updateTextMonths(newValue); }
    }

    // #endregion
}

function registerDatePicker() {
    if (customElements.get('fds-date-picker') === undefined) {
        window.customElements.define('fds-date-picker', FDSDatePicker);
    }
}

export default registerDatePicker;