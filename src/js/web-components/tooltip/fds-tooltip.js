import * as TooltipUtils from './fds-tooltip-utils';
import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSTooltip extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['tooltip-text', 'placement', 'purpose', 'tooltip-id'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get tooltipText() { return this.getAttribute('tooltip-text'); }
    set tooltipText(value) { value == null ? this.removeAttribute('tooltip-text') : this.setAttribute('tooltip-text', value); }

    get placement() { return this.getAttribute('placement') ?? 'above'; }
    set placement(value) { value == null ? this.removeAttribute('placement') : this.setAttribute('placement', value); }

    get purpose() { return this.getAttribute('purpose') ?? 'hint'; }
    set purpose(value) { value == null ? this.removeAttribute('purpose') : this.setAttribute('purpose', value); }

    get tooltipId() { return this.getAttribute('tooltip-id'); }
    set tooltipId(value) { value == null ? this.removeAttribute('tooltip-id') : this.setAttribute('tooltip-id', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handlePointerEnter = (event) => {
        if (event.pointerType === 'mouse') {
            this.firstElementChild.classList.add('js-hover');
            setTimeout(() => {
                if (this.firstElementChild.classList.contains('js-hover')) {
                    this.open();
                }
            }, 300);
        }
    };

    #handlePointerLeave = (event) => {
        if (event.pointerType === 'mouse') {
            this.firstElementChild.classList.remove('js-hover');
            this.close();
        }
        else if (event.pointerType === 'touch') {
            this.firstElementChild.classList.remove('js-pressing');
            this.firstElementChild.classList.remove('js-pressed');
        }
    };

    #handlePointerDown = (event) => {
        if (event.pointerType === 'touch') {
            this.firstElementChild.classList.remove('js-pressed');
            this.firstElementChild.releasePointerCapture(event.pointerId);
            this.firstElementChild.classList.add('js-pressing');
            setTimeout(() => {
                if (this.firstElementChild.classList.contains('js-pressing')) {
                    this.firstElementChild.classList.add('js-pressed');
                    this.firstElementChild.classList.remove('js-pressing');
                }
            }, 600);
        }
    };

    #handlePointerUp = (event) => {
        if (event.pointerType === 'touch') {
            if (this.firstElementChild.classList.contains('js-pressed')) {
                event.preventDefault();
                this.open();
            }
        }
    };

    #handleFocus = () => {
        this.open();
    };

    #handleFocusOut = (event) => {
        const focusLeftComponent = !this.contains(event.relatedTarget);
        if (focusLeftComponent) {
            this.close();
        }
    };

    #handleKeydown = (event) => {
        if (event.key === 'Escape') {
            if (this.querySelector('.tooltip').style.display !== 'none') {
                this.close();
                event.stopImmediatePropagation();
            }
        }
    };

    #handleClickOutside = (event) => {
        if (!this.contains(event.target)) {
            this.close();
        }
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        if (!this.hasAttribute('tooltip-text')) return;

        const triggerElements = this.querySelectorAll(':scope > :not(.tooltip):not(.tooltip-arrow)');
        if (triggerElements.length !== 1) return;

        let tooltip = this.querySelector('.tooltip');

        // Reuse the existing tooltip ID if available, to prevent a duplicate ID being appended to the trigger's aria attribute
        const fallbackId = tooltip !== null ? tooltip.getAttribute('id') : generateAndVerifyUniqueId('tooltip-');
        const uniqueId = this.getAttribute('tooltip-id') ?? fallbackId;

        if (tooltip === null) {
            tooltip = document.createElement('span');
            tooltip.setAttribute('id', uniqueId);
            tooltip.setAttribute('role', 'tooltip');
            tooltip.setAttribute('tabindex', '-1');
            tooltip.classList.add('tooltip');
            tooltip.textContent = this.getAttribute('tooltip-text');
            tooltip.style.display = 'none';
            this.appendChild(tooltip);
        }

        let tooltipArrow = this.querySelector('.tooltip-arrow');
        if (tooltipArrow === null) {
            tooltipArrow = document.createElement('span');
            tooltipArrow.classList.add('tooltip-arrow');
            tooltipArrow.setAttribute('aria-hidden', 'true');
            tooltipArrow.style.display = 'none';
            this.appendChild(tooltipArrow);
        }

        const trigger = this.firstElementChild;
        const ariaAttribute = this.purpose === 'label' ? 'aria-labelledby' : 'aria-describedby';
        const existingValue = trigger.getAttribute(ariaAttribute);
        if (existingValue === null) {
            trigger.setAttribute(ariaAttribute, uniqueId);
        }
        else if (!existingValue.includes(uniqueId)) {
            trigger.setAttribute(ariaAttribute, `${existingValue} ${uniqueId}`);
        }
    }

    #addEventListeners() {
        this.firstElementChild.addEventListener('pointerenter', this.#handlePointerEnter, false);
        this.addEventListener('pointerleave', this.#handlePointerLeave, false);
        this.firstElementChild.addEventListener('pointerdown', this.#handlePointerDown, false);
        this.firstElementChild.addEventListener('pointerup', this.#handlePointerUp, false);
        this.firstElementChild.addEventListener('focus', this.#handleFocus, false);
        this.addEventListener('focusout', this.#handleFocusOut, false);
    }

    #removeEventListeners() {
        this.firstElementChild.removeEventListener('pointerenter', this.#handlePointerEnter, false);
        this.removeEventListener('pointerleave', this.#handlePointerLeave, false);
        this.firstElementChild.removeEventListener('pointerdown', this.#handlePointerDown, false);
        this.firstElementChild.removeEventListener('pointerup', this.#handlePointerUp, false);
        this.firstElementChild.removeEventListener('focus', this.#handleFocus, false);
        this.removeEventListener('focusout', this.#handleFocusOut, false);
    }

    #updatePosition() {
        TooltipUtils.setTooltipWidth(this.querySelector('.tooltip'));
        TooltipUtils.setTooltipLeft(this.querySelector('.tooltip'), this.firstElementChild);
        TooltipUtils.setVerticalPlacement(this.querySelector('.tooltip'), this.querySelector('.tooltip-arrow'), this.firstElementChild, this.placement);
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        this.#setupHTML();
        this.#addEventListeners();
        this.#initialized = true;
    }

    open() {
        this.querySelector('.tooltip').style.display = 'block';
        this.querySelector('.tooltip-arrow').style.display = 'block';
        document.addEventListener('click', this.#handleClickOutside, false);
        document.addEventListener('keydown', this.#handleKeydown, false);
        this.#updatePosition();
    }

    close() {
        this.querySelector('.tooltip').style.display = 'none';
        this.querySelector('.tooltip-arrow').style.display = 'none';
        this.firstElementChild.classList.remove('js-hover');
        this.firstElementChild.classList.remove('js-pressing');
        this.firstElementChild.classList.remove('js-pressed');
        document.removeEventListener('click', this.#handleClickOutside, false);
        document.removeEventListener('keydown', this.#handleKeydown, false);
    }

    toggle() {
        this.querySelector('.tooltip').style.display === 'none' ? this.open() : this.close();
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#removeEventListeners();
        document.removeEventListener('click', this.#handleClickOutside, false);
        document.removeEventListener('keydown', this.#handleKeydown, false);
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {
            case 'tooltip-text':
                this.querySelector('.tooltip').textContent = newValue;
                if (this.querySelector('.tooltip').style.display !== 'none') {
                    this.#updatePosition();
                }
                break;
            case 'placement':
                if (this.querySelector('.tooltip').style.display !== 'none') {
                    this.#updatePosition();
                }
                break;
            case 'purpose':
                if (newValue !== 'hint' && newValue !== 'label' && newValue !== null) return;

                const trigger = this.firstElementChild;
                const tooltipId = this.querySelector('.tooltip').getAttribute('id');
                const addToAttribute = (newValue === 'label') ? 'aria-labelledby' : 'aria-describedby';
                const removeFromAttribute = (newValue === 'label') ? 'aria-describedby' : 'aria-labelledby';

                // Remove tooltip ID from old attribute
                const oldAttributeValue = trigger.getAttribute(removeFromAttribute);
                if (oldAttributeValue !== null) {
                    const updatedValue = oldAttributeValue.replace(tooltipId, '').trim();
                    // If the attribute is now empty, remove it entirely to keep the DOM clean
                    updatedValue ? trigger.setAttribute(removeFromAttribute, updatedValue) : trigger.removeAttribute(removeFromAttribute);
                }

                // Add tooltip ID to new attribute
                const newAttributeValue = trigger.getAttribute(addToAttribute);
                if (newAttributeValue === null) {
                    // Attribute doesn't exist yet, set it with just the tooltip ID
                    trigger.setAttribute(addToAttribute, tooltipId);
                }
                else if (!newAttributeValue.includes(tooltipId)) {
                    // Attribute already exists, append tooltip ID to preserve existing references
                    trigger.setAttribute(addToAttribute, `${newAttributeValue} ${tooltipId}`);
                }
                break;
            case 'tooltip-id':
                if (newValue !== null) {
                    const tooltip = this.querySelector('.tooltip');
                    const trigger = this.firstElementChild;
                    const ariaAttribute = this.purpose === 'label' ? 'aria-labelledby' : 'aria-describedby';
                    const idToReplace = oldValue ?? tooltip.getAttribute('id');

                    const ariaValue = trigger.getAttribute(ariaAttribute);
                    if (ariaValue !== null) {
                        trigger.setAttribute(ariaAttribute, ariaValue.replace(idToReplace, newValue).trim());
                    }

                    tooltip.setAttribute('id', newValue);
                }
                break;
        }
    }

    // #endregion
}

function registerTooltip() {
    if (!customElements.get('fds-tooltip')) {
        customElements.define('fds-tooltip', FDSTooltip);
    }
}

export default registerTooltip;