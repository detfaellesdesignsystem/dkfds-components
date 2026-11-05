import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSInputAffix extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['input-prefix', 'input-suffix'];

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #init() {
        const input = this.querySelector('input');

        if (!input) return;

        if (this.hasAttribute('input-prefix')) { this.#setAffix(this.getAttribute('input-prefix'), 'prefix'); }
        if (this.hasAttribute('input-suffix')) { this.#setAffix(this.getAttribute('input-suffix'), 'suffix'); }

        this.#initialized = true;
    }

    #setAffix(value, affix) {
        let element = null;

        if (affix === 'prefix') { element = this.querySelector('.form-input-prefix'); }
        else if (affix === 'suffix') { element = this.querySelector('.form-input-suffix'); }

        if (value !== null && value !== '') {
            if (!element) {
                element = document.createElement('div');

                if (affix === 'prefix') {
                    element.className = 'form-input-prefix';
                    this.prepend(element);
                }
                else if (affix === 'suffix') {
                    element.className = 'form-input-suffix';
                    this.appendChild(element);
                }
            }
            element.setAttribute('aria-hidden', 'true');
            element.textContent = value;
        }
        else {
            element?.remove();
        }
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }
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

        if (attribute === 'input-prefix' && (oldValue !== newValue)) {
            this.#setAffix(newValue, 'prefix');
        }

        if (attribute === 'input-suffix' && (oldValue !== newValue)) {
            this.#setAffix(newValue, 'suffix');
        }
    }

    // #endregion
}

function registerInputAffix() {
    if (customElements.get('fds-input-affix') === undefined) {
        window.customElements.define('fds-input-affix', FDSInputAffix);
    }
}

export default registerInputAffix;