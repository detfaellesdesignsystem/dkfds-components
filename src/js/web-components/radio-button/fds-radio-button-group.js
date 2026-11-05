import * as CE from '../custom-element-utils';

class FDSRadioButtonGroup extends HTMLElement {

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #mutationObserver = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleRadioChange = (event) => {
        const changedRadioButton = event.target.closest('fds-radio-button');

        if (event.detail.checked) {
            const allRadios = this.querySelectorAll('fds-radio-button');
            allRadios.forEach(radio => {
                if (radio !== changedRadioButton) {
                    radio.collapseContent?.();
                }
            });
        }
    }

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {
            const relevantTagNames = ['FIELDSET', 'LEGEND', 'FDS-HELP-TEXT', 'FDS-ERROR-MESSAGE'];

            const allNodes = [...addedNodes, ...removedNodes];
            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                this.#updateAriaDescribedBy();
                break;
            }

            if (
                attributeName === 'id' ||
                attributeName === 'hidden' ||
                attributeName === 'aria-hidden' ||
                (attributeName === 'class' && !['LEGEND', 'FIELDSET'].includes(target?.tagName))
            ) {
                this.#updateAriaDescribedBy();

                if (attributeName === 'hidden' && target === this) {
                    CE.notifySummaryOnVisibilityChange(this);
                }
            }
        }
    }

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #updateAriaDescribedBy() {
        const fieldset = this.querySelector('fieldset');
        const errorMessages = this.querySelectorAll(':scope > fieldset > fds-error-message');
        const helpTexts = this.querySelectorAll(':scope > fieldset > fds-help-text');

        CE.setAriaDescribedBy(fieldset, errorMessages, helpTexts);
    }

    #addEventListener() {
        this.addEventListener('radio-changed', this.#handleRadioChange);
    }

    #removeEventListener() {
        this.removeEventListener('radio-changed', this.#handleRadioChange);
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
        if (!this.#initialized) { this.init(); }
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        CE.notifySummaryOnDisconnect(this);
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

export default registerRadioButtonGroup;