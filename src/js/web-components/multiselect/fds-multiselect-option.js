import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';
import { styles } from './fds-multiselect-option-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSMultiselectOption extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['default-selected'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get value() { return this.getAttribute('value') ?? this.textContent.trim(); }
    set value(value) { value == null ? this.removeAttribute('value') : this.setAttribute('value', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        if (this.shadowRoot.querySelector('slot')) return;

        const checkbox = CE.createSvgIcon('M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z');
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
        if (!this.id) { this.id = generateAndVerifyUniqueId('multiselect-option'); }
        if (!this.hasAttribute('aria-selected')) {
            this.setAttribute('aria-selected', this.hasAttribute('default-selected') ? 'true' : 'false');
        }

        this.#initialized = true;
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

    get selected() { return this.getAttribute('aria-selected') === 'true'; }

    toggle() {
        const willBeSelected = !this.selected;
        this.setAttribute('aria-selected', willBeSelected ? 'true' : 'false');
        this.dispatchEvent(new CustomEvent(willBeSelected ? 'fds-multiselect-option-selected' : 'fds-multiselect-option-deselected', { bubbles: true }));
    }

    deselect() {
        if (!this.selected) return;
        this.setAttribute('aria-selected', 'false');
        this.dispatchEvent(new CustomEvent('fds-multiselect-option-deselected', { bubbles: true }));
    }

    reset() {
        const willBeSelected = this.hasAttribute('default-selected');
        this.setAttribute('aria-selected', willBeSelected ? 'true' : 'false');
        this.dispatchEvent(new CustomEvent(willBeSelected ? 'fds-multiselect-option-selected' : 'fds-multiselect-option-deselected', { bubbles: true }));
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
    }

    // #endregion
}

function registerMultiselectOption() {
    if (!customElements.get('fds-multiselect-option')) {
        customElements.define('fds-multiselect-option', FDSMultiselectOption);
    }
}

export default registerMultiselectOption;