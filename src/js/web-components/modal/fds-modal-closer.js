class FDSModalCloser extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['return-value', 'ready'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get returnValue() { return this.getAttribute('return-value'); }
    set returnValue(value) { value == null ? this.removeAttribute('return-value') : this.setAttribute('return-value', value); }

    get ready() { return this.getAttribute('ready') !== 'false'; }
    set ready(value) { this.setAttribute('ready', value ? 'true' : 'false'); }

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
            detail: { returnValue },
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

export default registerModalCloser;
