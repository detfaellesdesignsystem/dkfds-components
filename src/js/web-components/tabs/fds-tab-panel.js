import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import { styles } from './fds-tab-panel-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSTabPanel extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['tab-key'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get tabKey() { return this.getAttribute('tab-key'); }
    set tabKey(value) { value == null ? this.removeAttribute('tab-key') : this.setAttribute('tab-key', value); }

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
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
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

export default registerTabPanel;
