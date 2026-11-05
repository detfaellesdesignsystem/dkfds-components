import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import breakpoints from '../../utils/breakpoints';
import { styles } from './fds-tab-styling';

class FDSTab extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['tab-key', 'breakpoint'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get tabKey() { return this.getAttribute('tab-key'); }
    set tabKey(value) { value == null ? this.removeAttribute('tab-key') : this.setAttribute('tab-key', value); }

    // Only accepts a known breakpoint key (xs, sm, md, lg, xl) - anything else defaults to 'md'.
    get breakpoint() {
        const value = this.getAttribute('breakpoint');
        return value in breakpoints ? value : 'md';
    }
    set breakpoint(value) { value == null ? this.removeAttribute('breakpoint') : this.setAttribute('breakpoint', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #sheet = new CSSStyleSheet();

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
        this.#sheet.replaceSync(styles(`${breakpoints[this.breakpoint]}px`));
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
        this.attachShadow({ mode: 'open' });
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
        }
        else if (attribute === 'breakpoint') {
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

export default registerTab;
