import * as CE from '../custom-element-utils';
import * as TooltipUtils from './fds-tooltip-utils';
import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSTooltipIcon extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['tooltip-text', 'sr-label', 'placement', 'tooltip-id'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get tooltipText() { return this.getAttribute('tooltip-text'); }
    set tooltipText(value) { value == null ? this.removeAttribute('tooltip-text') : this.setAttribute('tooltip-text', value); }

    get srLabel() { return this.getAttribute('sr-label'); }
    set srLabel(value) { value == null ? this.removeAttribute('sr-label') : this.setAttribute('sr-label', value); }

    get placement() { return this.getAttribute('placement') ?? 'above'; }
    set placement(value) { value == null ? this.removeAttribute('placement') : this.setAttribute('placement', value); }

    get tooltipId() { return this.getAttribute('tooltip-id'); }
    set tooltipId(value) { value == null ? this.removeAttribute('tooltip-id') : this.setAttribute('tooltip-id', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #intersectionObserver = null;
    #dialog = null; // The dialog that has the 'cancel' listener while the tooltip is open inside a dialog

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = () => {
        this.toggle();
    };

    // Close when focus moves outside the component. Listen for focusin on document rather
    // than focusout on this element since a click may not focus the button in Safari.
    #handleOutsideFocus = (event) => {
        if (!this.contains(event.target)) {
            this.close();
        }
    };

    #handleKeydown = (event) => {
        switch (event.key) {
            case 'Escape':
                // #handleDialogCancel handles presses on Escape so #handleKeydown should be ignored inside dialogs
                const notInsideDialog = !this.closest('dialog');

                if (this.querySelector('button').getAttribute('aria-expanded') !== 'false' && notInsideDialog) {
                    this.close();
                    this.querySelector('button').focus();
                    event.stopImmediatePropagation();
                }
                break;
        }
    };

    #handleResize = () => {
        this.#updatePosition();
    };

    #handleScroll = () => {
        this.#updatePosition();
    };

    #handleIntersection = (entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                this.close();
            }
        });
    };

    #handleOutsideClick = (event) => {
        if (!this.contains(event.target)) {
            this.close();
        }
    };

    // Closes the tooltip instead of the dialog when Escape is pressed inside a dialog
    #handleDialogCancel = (event) => {
        event.preventDefault();
        this.close();
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        // Reuse the id when possible
        const uniqueId = this.getAttribute('tooltip-id') || this.querySelector('.tooltip')?.id || generateAndVerifyUniqueId('tooltip-');

        let button = this.querySelector('button');
        if (button === null) {
            button = document.createElement('button');
            button.classList.add('button', 'button-unstyled');
            button.setAttribute('type', 'button');
            button.setAttribute('aria-controls', uniqueId);
            this.appendChild(button);
            const helpIcon = CE.createSvgIcon('M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z');
            button.appendChild(helpIcon);
        }
        button.setAttribute('aria-label', this.getAttribute('sr-label'));
        button.setAttribute('aria-expanded', 'false');

        let ariaLive = this.querySelector('[aria-live]');
        if (ariaLive === null) {
            ariaLive = document.createElement('span');
            ariaLive.setAttribute('aria-atomic', 'true');
            ariaLive.setAttribute('aria-live', 'assertive');
            this.appendChild(ariaLive);
        }

        let tooltip = this.querySelector('.tooltip');
        if (tooltip === null) {
            tooltip = document.createElement('span');
            tooltip.setAttribute('id', uniqueId);
            tooltip.classList.add('tooltip');
            ariaLive.appendChild(tooltip);
        }
        tooltip.style.display = 'none';

        let tooltipArrow = this.querySelector('.tooltip-arrow');
        if (tooltipArrow === null) {
            tooltipArrow = document.createElement('span');
            tooltipArrow.classList.add('tooltip-arrow');
            this.appendChild(tooltipArrow);
        }
        tooltipArrow.setAttribute('aria-hidden', 'true');
        tooltipArrow.style.display = 'none';
    }

    #addEventListeners() {
        this.querySelector('button').addEventListener('click', this.#handleClick, false);
        this.addEventListener('keydown', this.#handleKeydown, false);
    }

    #removeEventListeners() {
        this.querySelector('button')?.removeEventListener('click', this.#handleClick, false);
        this.removeEventListener('keydown', this.#handleKeydown, false);
    }

    #connectIntersectionObserver() {
        if (this.#intersectionObserver) return;

        this.#intersectionObserver = new IntersectionObserver(this.#handleIntersection, { threshold: 0 });
        this.#intersectionObserver.observe(this.querySelector('button'));
    }

    #disconnectIntersectionObserver() {
        if (this.#intersectionObserver) {
            this.#intersectionObserver.disconnect();
            this.#intersectionObserver = null;
        }
    }

    #updatePosition() {
        // Width must be set before left, as left depends on tooltip width
        TooltipUtils.setTooltipWidth(this.querySelector('.tooltip'));
        TooltipUtils.setTooltipLeft(this.querySelector('.tooltip'), this.querySelector('button'));
        TooltipUtils.setVerticalPlacement(this.querySelector('.tooltip'), this.querySelector('.tooltip-arrow'), this.querySelector('button'), this.placement);
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        if (!this.hasAttribute('tooltip-text') || !this.hasAttribute('sr-label')) return;
        this.#setupHTML();
        this.#addEventListeners();
        this.#initialized = true;
    }

    open() {
        this.querySelector('button').setAttribute('aria-expanded', 'true');
        this.querySelector('.tooltip-arrow').style.display = 'block';
        this.querySelector('.tooltip').style.display = 'block';
        this.querySelector('.tooltip').textContent = this.getAttribute('tooltip-text');
        this.#updatePosition();

        window.addEventListener('resize', this.#handleResize, false);
        document.addEventListener('mousedown', this.#handleOutsideClick, false);
        document.addEventListener('scroll', this.#handleScroll, true);
        document.addEventListener('keydown', this.#handleKeydown, false);
        document.addEventListener('focusin', this.#handleOutsideFocus, false);
        this.#connectIntersectionObserver();

        // Let the tooltip consume Escape key press before an ancestor dialog does.
        // The dialog is stored so the listener can be removed even if the element is detached.
        this.#dialog = this.closest('dialog');
        this.#dialog?.addEventListener('cancel', this.#handleDialogCancel);
    }

    close() {
        this.querySelector('button').setAttribute('aria-expanded', 'false');
        this.querySelector('.tooltip').style.display = 'none';
        this.querySelector('.tooltip-arrow').style.display = 'none';
        this.querySelector('.tooltip').textContent = '';

        window.removeEventListener('resize', this.#handleResize, false);
        document.removeEventListener('mousedown', this.#handleOutsideClick, false);
        document.removeEventListener('scroll', this.#handleScroll, true);
        document.removeEventListener('keydown', this.#handleKeydown, false);
        document.removeEventListener('focusin', this.#handleOutsideFocus, false);
        this.#disconnectIntersectionObserver();

        this.#dialog?.removeEventListener('cancel', this.#handleDialogCancel);
        this.#dialog = null;
    }

    toggle() {
        this.querySelector('button').getAttribute('aria-expanded') === 'false' ? this.open() : this.close();
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

        // Remove observer and event listeners that are temporarily added when the tooltip is open
        window.removeEventListener('resize', this.#handleResize, false);
        document.removeEventListener('mousedown', this.#handleOutsideClick, false);
        document.removeEventListener('scroll', this.#handleScroll, true);
        document.removeEventListener('keydown', this.#handleKeydown, false);
        document.removeEventListener('focusin', this.#handleOutsideFocus, false);
        this.#disconnectIntersectionObserver();

        this.#dialog?.removeEventListener('cancel', this.#handleDialogCancel);
        this.#dialog = null;

        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {
            case 'tooltip-text':
                if (this.querySelector('button').getAttribute('aria-expanded') === 'true') {
                    this.querySelector('.tooltip').textContent = newValue;
                    this.#updatePosition();
                }
                break;
            case 'sr-label':
                this.querySelector('button').setAttribute('aria-label', newValue);
                break;
            case 'placement':
                if (this.querySelector('button').getAttribute('aria-expanded') === 'true') {
                    this.#updatePosition();
                }
                break;
            case 'tooltip-id':
                if (newValue !== null) {
                    const tooltip = this.querySelector('.tooltip');
                    tooltip.setAttribute('id', newValue);
                    this.querySelector('button').setAttribute('aria-controls', newValue);
                }
                break;
        }
    }

    // #endregion
}

function registerTooltipIcon() {
    if (!customElements.get('fds-tooltip-icon')) {
        customElements.define('fds-tooltip-icon', FDSTooltipIcon);
    }
}

export default registerTooltipIcon;