import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';

class FDSInput extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['show-required-status', 'input-maxwidth'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get showRequiredStatus() { return this.getAttribute('show-required-status'); }
    set showRequiredStatus(value) { value === null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #inputObserver = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {

            // A relevant child element was added or removed.
            const relevantTagNames = ['LABEL', 'INPUT', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT', 'FDS-CHARACTER-LIMIT'];
            const allNodes = [...addedNodes, ...removedNodes];
            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                const label = this.querySelector('label');
                const input = this.querySelector('input');
                const errorMessages = this.querySelectorAll('fds-error-message');
                const helpTexts = this.querySelectorAll('fds-help-text');
                const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');

                CE.associateLabelWithElement(label, input, 'inp');
                CE.setAriaDescribedBy(input, errorMessages, helpTexts, characterLimit);
                CE.setInvalid(input, errorMessages);

                if (this.hasAttribute('show-required-status')) {
                    CE.showRequiredStatus(label, input, this.getAttribute('show-required-status'));
                }

                break;
            }

            // The input's required attribute changed
            if (attributeName === 'required' && target?.tagName === 'INPUT') {
                if (this.hasAttribute('show-required-status')) {
                    const label = this.querySelector('label');
                    CE.showRequiredStatus(label, target, this.getAttribute('show-required-status'));
                }
            }
            // Attributes which might affect aria-describedby
            else if (
                attributeName === 'id' ||
                attributeName === 'hidden' ||
                attributeName === 'aria-hidden' ||
                attributeName === 'class') {
                const label = this.querySelector('label');
                const input = this.querySelector('input');
                const errorMessages = this.querySelectorAll('fds-error-message');
                const helpTexts = this.querySelectorAll('fds-help-text');
                const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');

                CE.associateLabelWithElement(label, input, 'inp');
                CE.setAriaDescribedBy(input, errorMessages, helpTexts, characterLimit);
                CE.setInvalid(input, errorMessages);

                if (attributeName === 'hidden' && target === this) {
                    CE.notifySummaryOnVisibilityChange(this);
                }
            }
        }
    }

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupObserver() {
        if (this.#inputObserver) return;

        this.#inputObserver = new MutationObserver(this.#handleMutations);
        this.#inputObserver.observe(this, CE.mutationObserverConfig);
    }

    #init() {
        this.#setupObserver();

        const label = this.querySelector('label');
        const input = this.querySelector('input');
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');
        const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');

        CE.associateLabelWithElement(label, input, 'inp');
        CE.setAriaDescribedBy(input, errorMessages, helpTexts, characterLimit);
        CE.setInvalid(input, errorMessages);

        if (this.hasAttribute('show-required-status')) {
            CE.showRequiredStatus(label, input, this.getAttribute('show-required-status'));
        }

        this.#initialized = true;
    }

    #setMaxwidth(value) {
        const input = this.querySelector('input');

        if (!input) return;

        if (value !== '') {
            const maxwidthClass = [...input.classList].find(cls => cls.startsWith('input-width-') || cls.startsWith('input-char-'));
            input.classList.remove(maxwidthClass);

            if (['xxs', 'xs', 's', 'm', 'l', 'xl'].includes(value)) {
                input.classList.add(`input-width-${value}`);
            }
            else if (/^\d+$/.test(value)) {
                input.classList.add(`input-char-${value}`);
            }
        }
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }

        if (this.hasAttribute('input-maxwidth')) { this.#setMaxwidth(this.getAttribute('input-maxwidth')); }
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        CE.notifySummaryOnDisconnect(this);

        this.#initialized = false;

        if (this.#inputObserver) {
            this.#inputObserver.disconnect();
            this.#inputObserver = null;
        }
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;

        if (attribute === 'show-required-status' && (oldValue !== newValue)) {
            const label = this.querySelector('label');
            const input = this.querySelector('input');
            CE.showRequiredStatus(label, input, newValue);
        }

        if (attribute === 'input-maxwidth' && (oldValue !== newValue)) {
            if (this.hasAttribute('input-maxwidth')) {
                this.#setMaxwidth(newValue);
            }
            // The attribute has previously been used but has now been removed from the element.
            // Remove all classes set by the attribute from when it was used.
            else {
                const input = this.querySelector('input');
                if (!input) return;
                const maxwidthClass = [...input.classList].find(cls => cls.startsWith('input-width-') || cls.startsWith('input-char-'));
                input.classList.remove(maxwidthClass);
            }
        }
    }

    // #endregion
}

function registerInput() {
    if (customElements.get('fds-input') === undefined) {
        window.customElements.define('fds-input', FDSInput);
    }
}

export default registerInput;