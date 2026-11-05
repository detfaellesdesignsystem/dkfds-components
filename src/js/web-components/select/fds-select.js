import * as CE from '../custom-element-utils';

class FDSSelect extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['show-required-status'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get showRequiredStatus() { return this.getAttribute('show-required-status'); }
    set showRequiredStatus(value) { value === null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #mutationObserver = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {

            // A relevant child element was added or removed.
            const relevantTagNames = ['LABEL', 'SELECT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT'];
            const allNodes = [...addedNodes, ...removedNodes];
            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                this.#setAccessibilityAttributes();

                if (this.hasAttribute('show-required-status')) {
                    const label = this.querySelector('label');
                    const select = this.querySelector('select');
                    CE.showRequiredStatus(label, select, this.getAttribute('show-required-status'));
                }

                break;
            }

            // The select's required attribute changed
            if (attributeName === 'required' && target?.tagName === 'SELECT') {
                if (this.hasAttribute('show-required-status')) {
                    const label = this.querySelector('label');
                    CE.showRequiredStatus(label, target, this.getAttribute('show-required-status'));
                }
            }
            // Attributes which might affect aria-describedby
            else if (attributeName === 'id' || attributeName === 'hidden' || attributeName === 'aria-hidden' || attributeName === 'class') {
                this.#setAccessibilityAttributes();

                if (attributeName === 'hidden' && target === this) {
                    CE.notifySummaryOnVisibilityChange(this);
                }
            }
        }
    }

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setAccessibilityAttributes() {
        const label = this.querySelector('label');
        const select = this.querySelector('select');
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');

        CE.associateLabelWithElement(label, select, 'sel');
        CE.setAriaDescribedBy(select, errorMessages, helpTexts);
        CE.setInvalid(select, errorMessages);
    }

    #connectMutationObserver(config = CE.mutationObserverConfig) {
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
            CE.showRequiredStatus(label, select, this.getAttribute('show-required-status'));
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
        CE.notifySummaryOnDisconnect(this);
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
                CE.showRequiredStatus(label, select, newValue);
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

export default registerSelect;