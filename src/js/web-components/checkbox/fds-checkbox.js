import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';

class FDSCheckbox extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['show-required-status', 'ready'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get showRequiredStatus() { return this.getAttribute('show-required-status'); }
    set showRequiredStatus(value) { value === null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #checkboxObserver = null;
    #input;
    #label;

    #onInputChange;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {
            const relevantTagNames = ['LABEL', 'INPUT', 'FDS-HELP-TEXT', 'FDS-ERROR-MESSAGE'];
            const allNodes = [...addedNodes, ...removedNodes];

            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                this.#input = this.#getInputElement();
                this.#label = this.#getLabelElement();

                this.#setClasses();
                CE.setDisabledClass(this.#label, this.#input);
                this.#updateAccessibilityState();

                if (this.hasAttribute('show-required-status')) {
                    CE.showRequiredStatus(this.#label, this.#input, this.getAttribute('show-required-status'));
                }

                break;
            }

            if (attributeName === 'disabled' && target === this.#getInputElement()) {
                CE.setDisabledClass(this.#getLabelElement(), target);
            }

            else if (
                (attributeName === 'required' || attributeName === 'aria-required') &&
                target === this.#getInputElement()
            ) {
                if (this.hasAttribute('show-required-status')) {
                    CE.showRequiredStatus(
                        this.#getLabelElement(),
                        target,
                        this.getAttribute('show-required-status')
                    );
                }
            }

            else if (
                attributeName === 'id' ||
                attributeName === 'hidden' ||
                attributeName === 'aria-hidden' ||
                (attributeName === 'class' && target?.tagName !== 'LABEL')
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

    #getInputElement() {
        return this.querySelector(':scope > input[type="checkbox"]');
    }

    #getLabelElement() {
        return this.querySelector(':scope > label');
    }

    #getHelpTextElements() {
        return this.querySelectorAll(':scope > fds-help-text');
    }

    #getErrorMessages() {
        return this.querySelectorAll(':scope > fds-error-message');
    }

    #setupObserver() {
        if (this.#checkboxObserver) return;

        this.#checkboxObserver = new MutationObserver(this.#handleMutations);
        this.#checkboxObserver.observe(this, CE.mutationObserverConfig);
    }

    #updateAccessibilityState() {
        const label = this.#getLabelElement();
        const input = this.#getInputElement();
        const errorMessages = this.#getErrorMessages();
        const helpTexts = this.#getHelpTextElements();

        CE.associateLabelWithElement(label, input, 'chk');
        CE.setAriaDescribedBy(input, errorMessages, helpTexts);
        CE.setInvalid(input, errorMessages);
    }

    #setClasses() {
        if (!this.#label || !this.#input) return;

        this.#label.classList.add('form-label');
        this.#input.classList.add('form-checkbox');
    }

    /* Collapsible content */

    #handleCollapsibleCheckboxes() {
        const input = this.#input;
        const possibleContent = this.querySelector(':scope > div.checkbox-content');
        if (!input || !possibleContent) return;

        // Ensure the div has the expected classes
        possibleContent.classList.add('checkbox-content');

        // Ensure the content has an ID
        if (!possibleContent.id) {
            possibleContent.id = generateAndVerifyUniqueId('exp');
        }

        const updateState = () => {
            const expanded = input.checked;

            input.setAttribute('data-aria-controls', possibleContent.id);
            input.setAttribute('data-aria-expanded', String(expanded));

            possibleContent.setAttribute('aria-hidden', String(!expanded));
            possibleContent.classList.toggle('collapsed', !expanded);
        };

        if (this.#onInputChange) {
            input.removeEventListener('change', this.#onInputChange);
        }

        this.#onInputChange = updateState;

        updateState();

        input.addEventListener('change', this.#onInputChange);
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#input = this.#getInputElement();
        this.#label = this.#getLabelElement();

        this.#setClasses();
        CE.setDisabledClass(this.#label, this.#input);
        this.#updateAccessibilityState();

        if (this.hasAttribute('show-required-status')) {
            CE.showRequiredStatus(this.#label, this.#input, this.getAttribute('show-required-status'));
        }

        this.#handleCollapsibleCheckboxes();

        this.#setupObserver();

        this.#initialized = true;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (this.getAttribute('ready') === 'false') return;

        if (!this.#initialized) { this.init(); }
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        CE.notifySummaryOnDisconnect(this);

        if (this.#input) {
            this.#input.removeEventListener('change', this.#onInputChange);
        }

        this.#initialized = false;

        if (this.#checkboxObserver) {
            this.#checkboxObserver.disconnect();
            this.#checkboxObserver = null;
        }
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute === 'ready') {
            if (!this.#initialized && this.isConnected && newValue === 'true') {
                this.init();
            }
            return;
        }

        if (!this.#initialized) return;

        if (attribute === 'show-required-status' && (oldValue !== newValue)) {
            const label = this.#getLabelElement();
            const input = this.#getInputElement();
            CE.showRequiredStatus(label, input, newValue);
        }
    }

    // #endregion
}

function registerCheckbox() {
    if (customElements.get('fds-checkbox') === undefined) {
        window.customElements.define('fds-checkbox', FDSCheckbox);
    }
}

export default registerCheckbox;