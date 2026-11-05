import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import { styles } from './fds-multiselect-dialog-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

const DEFAULT_HEADING = 'Vælg en eller flere muligheder';

class FDSMultiselectDialog extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['sr-heading'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get srHeading() { return this.getAttribute('sr-heading') ?? DEFAULT_HEADING; }
    set srHeading(value) { value == null ? this.removeAttribute('sr-heading') : this.setAttribute('sr-heading', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleMouseDown = (event) => {
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
        if (!this.id) { this.id = generateAndVerifyUniqueId('multiselect-dialog'); }
        this.hidden = true;

        this.#addEventListeners();
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
        if (!this.#initialized) { this.#init(); }
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

export default registerMultiselectDialog;