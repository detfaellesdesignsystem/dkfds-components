import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSAccordion extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['heading', 'heading-level', 'expanded', 'content-id', 'variant-text', 'variant-icon', 'ready'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get heading() { return this.getAttribute('heading'); }
    set heading(val) { this.setAttribute('heading', val); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized;
    #handleAccordionClick;
    #accordionObserver = null;

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #getHeadingElement() {
        return this.querySelector(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6');
    }

    #getContentElement() {
        return this.querySelector(':scope > .accordion-content');
    }

    #normalizeHeadingLevel(headingLevel) {
        const normalizedHeadingLevel = (headingLevel || 'h3').toLowerCase();
        return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(normalizedHeadingLevel) ? normalizedHeadingLevel : 'h3';
    }

    #ensureDOM() {
        const headingLevel = this.#normalizeHeadingLevel(this.getAttribute('heading-level'));

        let headingElement = this.#getHeadingElement();
        let contentElement = this.querySelector(':scope > div');

        // Attribute mode:
        // No heading markup provided, so create canonical structure from attributes
        if (!headingElement) {
            headingElement = document.createElement(headingLevel);

            const buttonElement = document.createElement('button');
            buttonElement.classList.add('accordion-button');
            buttonElement.setAttribute('type', 'button');

            const titleElement = document.createElement('span');
            titleElement.classList.add('accordion-title');
            titleElement.textContent = this.getAttribute('heading') || '';

            buttonElement.appendChild(titleElement);
            headingElement.appendChild(buttonElement);

            if (!contentElement) {
                contentElement = document.createElement('div');
                this.appendChild(contentElement);
            }

            contentElement.classList.add('accordion-content');
            this.prepend(headingElement);

            return true;
        }

        // Enhance mode:
        // Heading exists, so the supported prerendered structure must already be present
        const buttonElement = headingElement.querySelector(':scope > button');
        if (!buttonElement) {
            console.warn('<fds-accordion> Missing direct child button inside heading.');
            return false;
        }

        const titleElement = buttonElement.querySelector(':scope > span');
        if (!titleElement) {
            console.warn('<fds-accordion> Missing direct child span inside button.');
            return false;
        }

        if (!contentElement) {
            console.warn('<fds-accordion> Missing direct child div for accordion content.');
            return false;
        }

        buttonElement.classList.add('accordion-button');
        buttonElement.setAttribute('type', 'button');
        titleElement.classList.add('accordion-title');
        contentElement.classList.add('accordion-content');

        return true;
    }

    #updateHeading(heading) {
        this.querySelector('.accordion-title').textContent = heading;
    }

    #updateHeadingLevel(headingLevel) {
        const normalizedHeadingLevel = this.#normalizeHeadingLevel(headingLevel);
        let headingElement = this.#getHeadingElement();

        if (!headingElement || headingElement.tagName.toLowerCase() === normalizedHeadingLevel) return;

        const newHeadingLevel = document.createElement(normalizedHeadingLevel);
        newHeadingLevel.append(...headingElement.childNodes);
        headingElement.replaceWith(newHeadingLevel);
    }

    #setExpandedState(isExpanded) {
        const button = this.#getHeadingElement()?.querySelector('button.accordion-button');
        const content = this.#getContentElement();

        if (!button || !content) return;

        button.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        content.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
    }

    #updateExpanded(expanded) {
        const isExpanded = expanded !== null && expanded !== 'false';
        this.#setExpandedState(isExpanded);
    }

    #updateContentId(contentId) {
        this.#getHeadingElement().querySelector('.accordion-button').setAttribute('aria-controls', contentId);
        this.#getContentElement().setAttribute('id', contentId);
    }

    #ensureContentId() {
        const headingElement = this.#getHeadingElement();
        const contentElement = this.#getContentElement();

        if (!headingElement || !contentElement) return;

        const buttonHeadingId = headingElement.querySelector('.accordion-button').getAttribute('aria-controls');
        const contentId = contentElement.getAttribute('id');

        if (this.hasAttribute('content-id')) {
            this.#updateContentId(this.getAttribute('content-id'));
        }
        else if (contentId && buttonHeadingId === contentId) {
            return;
        }
        else if (contentId) {
            this.#updateContentId(contentId);
        }
        else if (buttonHeadingId) {
            this.#updateContentId(buttonHeadingId);
        }
        else {
            this.#updateContentId(generateAndVerifyUniqueId('acc'));
        }
    }

    #updateVariant(text, icon) {
        const button = this.#getHeadingElement().querySelector('button.accordion-button');

        if (text && icon) {
            let variantEl = button.querySelector('.accordion-icon');
            if (!variantEl) {
                variantEl = document.createElement('span');
                variantEl.classList.add('accordion-icon');
                button.appendChild(variantEl);
            }

            variantEl.innerHTML = '';

            const textEl = document.createElement('span');
            textEl.classList.add('icon_text');
            textEl.textContent = text;
            variantEl.appendChild(textEl);

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.classList.add('icon-svg');
            svg.setAttribute('focusable', 'false');
            svg.setAttribute('aria-hidden', 'true');

            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS(null, 'href', `#${icon}`);
            svg.appendChild(use);

            variantEl.appendChild(svg);
        }
        else if (button.querySelector('.accordion-icon')) {
            button.querySelector('.accordion-icon').remove();
        }
    }

    //Apply all current attributes to the DOM
    //Ensures that attr values take precedence if they conflict with pre-generated HTML.
    #syncAll() {
        if (this.hasAttribute('heading')) {
            this.#updateHeading(this.getAttribute('heading'));
        }

        if (this.hasAttribute('heading-level')) {
            this.#updateHeadingLevel(this.getAttribute('heading-level'));
        }

        this.#updateExpanded(this.getAttribute('expanded'));
        this.#ensureContentId();

        if (this.hasAttribute('variant-text') || this.hasAttribute('variant-icon')) {
            this.#updateVariant(
                this.getAttribute('variant-text'),
                this.getAttribute('variant-icon')
            );
        } else {
            this.#updateVariant('', '');
        }
    }

    #setupObserver() {
        if (this.#accordionObserver) return;

        this.#accordionObserver = new MutationObserver(this.#handleMutations);

        const config = {
            subtree: true,
            childList: true
        }

        this.#accordionObserver.observe(this, config);
    }

    #handleMutations = (records) => {
        const button = this.#getHeadingElement()?.querySelector('button.accordion-button');
        if (button) {
            button.addEventListener('click', this.#handleAccordionClick, false);
        }
    }

    // #endregion

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();

        this.#initialized = false;

        /* Set up instance fields for event handling */

        this.#handleAccordionClick = () => { this.toggleAccordion(); };
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        if (this.#initialized) return;

        this.#setupObserver();

        if (this.innerHTML === '') return; // Accordions must have content. If no content is found at all, don't init as some frameworks have experienced problems otherwise.

        const isValid = this.#ensureDOM();
        if (!isValid) return;

        this.#syncAll();

        const button = this.#getHeadingElement()?.querySelector('button.accordion-button');
        if (button) {
            button.addEventListener('click', this.#handleAccordionClick, false);
        }

        this.#initialized = true;
    }

    expandAccordion() {
        this.#setExpandedState(true);
        if (this.getAttribute('expanded') !== 'true') {
            this.setAttribute('expanded', 'true');
        }
        this.dispatchEvent(new CustomEvent('fds-accordion-expanded', { bubbles: true }));
    }

    collapseAccordion() {
        this.#setExpandedState(false);
        if (this.getAttribute('expanded') !== 'false') {
            this.setAttribute('expanded', 'false');
        }
        this.dispatchEvent(new CustomEvent('fds-accordion-collapsed', { bubbles: true }));
    }

    toggleAccordion() {
        this.isExpanded() ? this.collapseAccordion() : this.expandAccordion();
    }

    isExpanded() {
        return this.hasAttribute('expanded') && this.getAttribute('expanded') !== 'false';
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (this.getAttribute('ready') === 'false') return;

        this.init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        const button = this.#getHeadingElement()?.querySelector('button.accordion-button');
        if (button) {
            button.removeEventListener('click', this.#handleAccordionClick, false);
        }

        this.#initialized = false;

        if (this.#accordionObserver) {
            this.#accordionObserver.disconnect();
            this.#accordionObserver = null;
        }
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute === 'ready') {
            if (!this.#initialized && this.isConnected && newValue !== 'false') {
                this.init();
            }
            return;
        }

        if (!this.#initialized) return;

        if (attribute === 'heading') {
            this.#updateHeading(newValue);
        }

        if (attribute === 'heading-level') {
            this.#updateHeadingLevel(newValue);
        }

        if (attribute === 'expanded' && oldValue !== newValue) {
            this.#updateExpanded(newValue);
        }

        if (attribute === 'content-id') {
            if (newValue !== null && newValue !== '') {
                this.#updateContentId(newValue);
            }
        }

        if (attribute === 'variant-text') {
            if (this.hasAttribute('variant-icon')) {
                this.#updateVariant(newValue, this.getAttribute('variant-icon'));
            } else {
                this.#updateVariant(newValue, '');
            }
        }

        if (attribute === 'variant-icon') {
            if (this.hasAttribute('variant-text')) {
                this.#updateVariant(this.getAttribute('variant-text'), newValue);
            } else {
                this.#updateVariant('', newValue);
            }
        }
    }

    // #endregion
}

function registerAccordion() {
    if (customElements.get('fds-accordion') === undefined) {
        window.customElements.define('fds-accordion', FDSAccordion);
    }
}

export default registerAccordion;