import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSHelpText extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['id', 'hidden'];

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #rendered;
    #parentWrapper;

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #render() {
        if (this.#rendered) return;

        this.classList.add('help-text');

        this.#rendered = true;
    }

    #shouldBeHidden(hiddenValue) {
        return hiddenValue === 'true' || hiddenValue === '';
    }

    #setAriaHidden() {
        this.setAttribute('aria-hidden', 'true');
    }

    #removeAriaHidden() {
        this.removeAttribute('aria-hidden');
    }

    #notifyParent() {
        this.#parentWrapper?.dispatchEvent(new CustomEvent('help-text-visibility-changed', {
            bubbles: true,
            detail: {
                helptextId: this.id,
                isHidden: this.#shouldBeHidden(this.getAttribute('hidden'))
            }
        }));
    }

    // #endregion

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();
        this.#rendered = false;
        this.#parentWrapper = null;
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (this.#rendered) return;

        this.#render();

        if (!this.id) {
            this.id = generateAndVerifyUniqueId('help');
        }

        // Handle initial hidden state
        if (this.#shouldBeHidden(this.getAttribute('hidden'))) {
            this.#setAriaHidden();
        }

        // During disconnect, the custom element may lose connection to the wrapper.
        // Save the wrapper and use it to dispatch events - otherwise, the events may be lost.
        this.#parentWrapper = this.closest('fds-input, fds-checkbox, fds-checkbox-group, fds-radio-button, fds-radio-button-group, fds-date-input, fds-multiselect');
        this.#parentWrapper?.dispatchEvent(new Event('help-text-callback'));
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#parentWrapper?.dispatchEvent(new Event('help-text-callback'));

        this.#parentWrapper = null;
        this.#rendered = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#rendered) return;

        if (attribute === 'hidden' && oldValue !== newValue) {
            if (this.#shouldBeHidden(newValue)) {
                this.#setAriaHidden();
            } else {
                this.#removeAriaHidden();
            }
            this.#notifyParent();
        }

        this.#parentWrapper?.dispatchEvent(new Event('help-text-callback'));
    }

    // #endregion
}

function registerHelpText() {
    if (customElements.get('fds-help-text') === undefined) {
        window.customElements.define('fds-help-text', FDSHelpText);
    }
}

export default registerHelpText;