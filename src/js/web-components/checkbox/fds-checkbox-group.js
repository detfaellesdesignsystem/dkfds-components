import * as CE from '../custom-element-utils';

class FDSCheckboxGroup extends HTMLElement {

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #checkboxGroupObserver = null;
    #fieldset;
    #legend;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {
            const relevantTagNames = [
                'FIELDSET',
                'LEGEND',
                'FDS-HELP-TEXT',
                'FDS-ERROR-MESSAGE'
            ];

            const allNodes = [...addedNodes, ...removedNodes];

            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                this.#fieldset = this.#getFieldsetElement();
                this.#legend = this.#getLegendElement();

                this.#setClasses();
                this.#setDisabledClass();
                this.#updateAccessibilityState();

                break;
            }

            if (
                attributeName === 'disabled' &&
                target === this.#getFieldsetElement()
            ) {
                target.classList.toggle('disabled', target.hasAttribute('disabled'));
            }

            else if (
                attributeName === 'id' ||
                attributeName === 'hidden' ||
                attributeName === 'aria-hidden' ||
                (attributeName === 'class' && !['LEGEND', 'FIELDSET'].includes(target?.tagName))
            ) {
                this.#updateAccessibilityState();

                if (attributeName === 'hidden' && target === this) {
                    CE.notifySummaryOnVisibilityChange(this);
                }
            }
        }
    }

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
        this.#checkboxGroupObserver.observe(this, CE.mutationObserverConfig);
    }

    #updateAccessibilityState() {
        const fieldset = this.#getFieldsetElement();
        const errorMessages = this.#getErrorMessages();
        const helpTexts = this.#getGroupHelpTexts();

        CE.setAriaDescribedBy(fieldset, errorMessages, helpTexts);
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
        if (!this.#initialized) { this.init(); }
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        CE.notifySummaryOnDisconnect(this);

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

export default registerCheckboxGroup;