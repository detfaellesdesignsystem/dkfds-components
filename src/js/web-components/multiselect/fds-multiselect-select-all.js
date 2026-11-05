import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';
import { styles } from './fds-multiselect-select-all-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const DEFAULT_LABEL = 'Vælg alle';
const DEFAULT_TEXT_CHECKED = 'valgt';
const DEFAULT_TEXT_UNCHECKED = 'ikke valgt';
const DEFAULT_TEXT_MIXED = 'delvist valgt';

class FDSMultiselectSelectAll extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['aria-checked', 'label', 'sr-text-checked', 'sr-text-unchecked', 'sr-text-mixed'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get label() { return this.getAttribute('label') || DEFAULT_LABEL; }
    set label(value) { value == null ? this.removeAttribute('label') : this.setAttribute('label', value); }

    get srTextChecked() { return this.getAttribute('sr-text-checked') ?? DEFAULT_TEXT_CHECKED; }
    set srTextChecked(value) { value == null ? this.removeAttribute('sr-text-checked') : this.setAttribute('sr-text-checked', value); }

    get srTextUnchecked() { return this.getAttribute('sr-text-unchecked') ?? DEFAULT_TEXT_UNCHECKED; }
    set srTextUnchecked(value) { value == null ? this.removeAttribute('sr-text-unchecked') : this.setAttribute('sr-text-unchecked', value); }

    get srTextMixed() { return this.getAttribute('sr-text-mixed') ?? DEFAULT_TEXT_MIXED; }
    set srTextMixed(value) { value == null ? this.removeAttribute('sr-text-mixed') : this.setAttribute('sr-text-mixed', value); }

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

        const checkIcon = CE.createSvgIcon('M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z');
        checkIcon.classList.add('check-icon');

        const indeterminateIcon = CE.createSvgIcon('M200-440v-80h560v80H200Z');
        indeterminateIcon.classList.add('indeterminate-icon');

        box.append(checkIcon, indeterminateIcon);

        const labelText = document.createElement('span');
        labelText.classList.add('select-all-label');

        wrapper.append(box, labelText);
        this.shadowRoot.appendChild(wrapper);
    }

    #updateVisibleLabel() {
        const labelText = this.shadowRoot.querySelector('.select-all-label');
        if (labelText) { labelText.textContent = this.label; }
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
        if (!this.id) { this.id = generateAndVerifyUniqueId('multiselect-select-all'); }
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
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    get checked() { return this.getAttribute('aria-checked') === 'true'; }

    toggle() {
        const willBeChecked = this.getAttribute('aria-checked') !== 'true';
        this.setAttribute('aria-checked', willBeChecked ? 'true' : 'false');
        this.dispatchEvent(new CustomEvent('fds-multiselect-select-all-toggled', { bubbles: true, detail: { checked: willBeChecked } }));
    }

    // Called by fds-multiselect-options
    reflectState(state) {
        this.setAttribute('aria-checked', state);
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }
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

export default registerMultiselectSelectAll;