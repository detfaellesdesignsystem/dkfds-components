import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';

class FDSTextarea extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['show-required-status'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get showRequiredStatus() { return this.getAttribute('show-required-status'); }
    set showRequiredStatus(value) { value === null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #textareaObserver = null;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {

            // A relevant child element was added or removed.
            const relevantTagNames = ['LABEL', 'TEXTAREA', 'FDS-ERROR-MESSAGE', 'FDS-HELP-TEXT', 'FDS-CHARACTER-LIMIT'];
            const allNodes = [...addedNodes, ...removedNodes];
            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                const label = this.querySelector('label');
                const textarea = this.querySelector('textarea');
                const errorMessages = this.querySelectorAll('fds-error-message');
                const helpTexts = this.querySelectorAll('fds-help-text');
                const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');

                CE.associateLabelWithElement(label, textarea, 'tex');
                CE.setAriaDescribedBy(textarea, errorMessages, helpTexts, characterLimit);
                CE.setInvalid(textarea, errorMessages);

                if (this.hasAttribute('show-required-status')) {
                    CE.showRequiredStatus(label, textarea, this.getAttribute('show-required-status'));
                }

                break;
            }

            // The textarea's required attribute changed
            if (attributeName === 'required' && target?.tagName === 'TEXTAREA') {
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
                const textarea = this.querySelector('textarea');
                const errorMessages = this.querySelectorAll('fds-error-message');
                const helpTexts = this.querySelectorAll('fds-help-text');
                const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');

                CE.associateLabelWithElement(label, textarea, 'tex');
                CE.setAriaDescribedBy(textarea, errorMessages, helpTexts, characterLimit);
                CE.setInvalid(textarea, errorMessages);

                if (attributeName === 'hidden' && target === this) {
                    CE.notifySummaryOnVisibilityChange(this);
                }
            }
        }
    }

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupObserver() {
        if (this.#textareaObserver) return;

        this.#textareaObserver = new MutationObserver(this.#handleMutations);
        this.#textareaObserver.observe(this, CE.mutationObserverConfig);
    }

    #init() {
        this.#setupObserver();

        const label = this.querySelector('label');
        const textarea = this.querySelector('textarea');
        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');
        const characterLimit = this.querySelector('fds-character-limit span.sr-only[id]');

        CE.associateLabelWithElement(label, textarea, 'tex');
        CE.setAriaDescribedBy(textarea, errorMessages, helpTexts, characterLimit);
        CE.setInvalid(textarea, errorMessages);

        if (this.hasAttribute('show-required-status')) {
            CE.showRequiredStatus(label, textarea, this.getAttribute('show-required-status'));
        }

        this.#initialized = true;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        CE.notifySummaryOnDisconnect(this);

        this.#initialized = false;

        if (this.#textareaObserver) {
            this.#textareaObserver.disconnect();
            this.#textareaObserver = null;
        }
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;

        if (attribute === 'show-required-status' && (oldValue !== newValue)) {
            const label = this.querySelector('label');
            const textarea = this.querySelector('textarea');
            CE.showRequiredStatus(label, textarea, newValue);
        }
    }

    // #endregion
}

function registerTextarea() {
    if (customElements.get('fds-textarea') === undefined) {
        window.customElements.define('fds-textarea', FDSTextarea);
    }
}

export default registerTextarea;