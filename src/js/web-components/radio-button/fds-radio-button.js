import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';

class FDSRadioButton extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['ready'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get checked() {
        return this.#input?.checked ?? false;
    }

    set checked(value) {
        if (!this.#input) return;
        this.#input.checked = Boolean(value);
    }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #radioButtonObserver = null;
    #input;
    #label;

    #onInputChange;
    #updateExpandableContent;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleMutations = (records) => {
        for (const { attributeName, target, addedNodes, removedNodes } of records) {
            const relevantTagNames = ['LABEL', 'INPUT', 'FDS-HELP-TEXT'];
            const allNodes = [...addedNodes, ...removedNodes];

            if (allNodes.some(node => relevantTagNames.includes(node?.tagName))) {
                this.#input = this.#getInputElement();
                this.#label = this.#getLabelElement();

                this.#setClasses();
                CE.setDisabledClass(this.#label, this.#input);
                this.#updateAccessibilityState();

                break;
            }

            if (attributeName === 'disabled' && target === this.#getInputElement()) {
                CE.setDisabledClass(this.#getLabelElement(), target);
            }

            else if (
                attributeName === 'id' ||
                attributeName === 'hidden' ||
                attributeName === 'aria-hidden' ||
                (attributeName === 'class' && target?.tagName !== 'LABEL')
            ) {
                this.#updateAccessibilityState();
            }
        }
    }

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #getInputElement() {
        return this.querySelector(':scope > input[type="radio"]');
    }

    #getLabelElement() {
        return this.querySelector(':scope > label');
    }

    #getHelpTextElements() {
        return this.querySelectorAll(':scope > fds-help-text');
    }

    #setupObserver() {
        if (this.#radioButtonObserver) return;

        this.#radioButtonObserver = new MutationObserver(this.#handleMutations);
        this.#radioButtonObserver.observe(this, CE.mutationObserverConfig);
    }

    #updateAccessibilityState() {
        const label = this.#getLabelElement();
        const input = this.#getInputElement();
        const helpTexts = this.#getHelpTextElements();

        CE.associateLabelWithElement(label, input, 'rad');
        CE.setAriaDescribedBy(input, [], helpTexts);
    }

    #setClasses() {
        if (!this.#label || !this.#input) return;

        this.#label.classList.add('form-label');
        this.#input.classList.add('form-radio');
    }

    #handleCollapsibleContent() {
        const input = this.#input;
        const possibleContent = this.querySelector(':scope > div.radio-content');
        if (!input || !possibleContent) return;

        possibleContent.classList.add('radio-content');

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

        this.#updateExpandableContent = updateState;

        updateState();
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    collapseContent() {
        const content = this.querySelector(':scope > div.radio-content');
        if (content && this.#input) {
            this.#input.setAttribute('data-aria-expanded', 'false');
            content.setAttribute('aria-hidden', 'true');
            content.classList.add('collapsed');
        }
    }

    init() {
        this.#input = this.#getInputElement();
        this.#label = this.#getLabelElement();

        this.#setClasses();
        CE.setDisabledClass(this.#label, this.#input);
        this.#updateAccessibilityState();

        this.#handleCollapsibleContent();

        if (this.#input) {
            if (this.#onInputChange) {
                this.#input.removeEventListener('change', this.#onInputChange);
            }

            this.#onInputChange = () => {
                this.#updateExpandableContent?.();

                this.dispatchEvent(new CustomEvent('radio-changed', {
                    detail: { checked: this.#input.checked },
                    bubbles: true
                }));
            };

            this.#input.addEventListener('change', this.#onInputChange);
        }

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
        if (this.#input) {
            this.#input.removeEventListener('change', this.#onInputChange);
        }

        this.#initialized = false;

        if (this.#radioButtonObserver) {
            this.#radioButtonObserver.disconnect();
            this.#radioButtonObserver = null;
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
    }

    // #endregion
}

function registerRadioButton() {
    if (customElements.get('fds-radio-button') === undefined) {
        window.customElements.define('fds-radio-button', FDSRadioButton);
    }
}

export default registerRadioButton;