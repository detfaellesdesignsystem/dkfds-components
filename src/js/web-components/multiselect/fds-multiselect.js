import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import * as CE from '../custom-element-utils';
import { styles } from './fds-multiselect-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSMultiselect extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static formAssociated = true;
    static observedAttributes = ['name', 'sr-tags-label', 'show-required-status', 'required', 'disabled'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get name() { return this.getAttribute('name'); }
    set name(value) { value == null ? this.removeAttribute('name') : this.setAttribute('name', value); }

    get srTagsLabel() { return this.getAttribute('sr-tags-label'); }
    set srTagsLabel(value) { value == null ? this.removeAttribute('sr-tags-label') : this.setAttribute('sr-tags-label', value); }

    get showRequiredStatus() { return this.getAttribute('show-required-status'); }
    set showRequiredStatus(value) { value == null ? this.removeAttribute('show-required-status') : this.setAttribute('show-required-status', value); }

    get required() { return this.hasAttribute('required'); }
    set required(value) { value ? this.setAttribute('required', '') : this.removeAttribute('required'); }

    get disabled() { return this.hasAttribute('disabled') || this.#formDisabled; }
    set disabled(value) { value ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

    get value() {
        const values = [];
        for (const sourceOption of this.querySelectorAll('fds-multiselect-option')) {
            if (this.#optionTags.has(sourceOption)) { values.push(sourceOption.value); }
        }
        return values;
    }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #mutationObserver = null;
    #optionTags = new Map();
    #internals;
    #formDisabled = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleOpenerExpanded = () => {
        this.querySelector('fds-multiselect-dialog')?.open();
    };

    #handleOpenerCollapsed = () => {
        this.querySelector('fds-multiselect-dialog')?.close();
    };

    #handleOptionSelected = (event) => {
        this.#addTag(event.target);
    };

    #handleOptionDeselected = (event) => {
        this.#removeTag(event.target);
    };

    #handleLabelClick = (event) => {
        const label = this.#getLabel();
        if (!label || !label.contains(event.target)) return;
        if (this.disabled) return;

        this.querySelector('fds-multiselect-opener')?.focus();
    };

    #handleTagClick = (event) => {
        const tag = event.target.closest('.tag');
        if (!tag) return;

        const sourceOption = this.#findSourceForTag(tag);
        if (!sourceOption) return;

        const opener = this.querySelector('fds-multiselect-opener');

        if (opener?.expanded) {
            opener.close();
        }

        const tags = Array.from(this.shadowRoot.querySelectorAll('.tag'));
        const index = tags.indexOf(tag);

        // Place focus on either the next tag, the previous tag if no next tag, or on the
        // opener if no tags are left at all.
        const focusTarget = tags[index + 1] ?? tags[index - 1] ?? opener;

        sourceOption.deselect();
        focusTarget?.focus();
    };

    #handleFocusOut = (event) => {
        const relatedTarget = event.relatedTarget;

        // Ensure the opener only closes when something outside the multiselect gets focus.
        const stillInside = relatedTarget && this.contains(relatedTarget);
        if (stillInside) return;

        const opener = this.querySelector('fds-multiselect-opener');
        opener?.close();
    };

    #handleKeyDown = (event) => {
        if (event.key !== 'Escape') return;

        const opener = this.querySelector('fds-multiselect-opener');
        if (!opener?.expanded) return;

        event.preventDefault();
        opener.close();
        opener.focus();
    };

    #handleMouseDown = (event) => {
        if (this.disabled) {
            event.preventDefault();
        }
    };

    #handleMutations = (records) => {
        for (const { attributeName, target } of records) {
            if (attributeName === 'hidden' && target === this) {
                CE.notifySummaryOnVisibilityChange(this);
            }
        }
        this.#wireRelationships();
    };

    #handleWindowLoad = () => {
        const tags = this.shadowRoot.querySelectorAll('.tag');
        tags.forEach(tag => this.#constrainTagWidth(tag));
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #getLabel() {
        return this.querySelector(':scope > [slot="label"]');
    }

    #findSourceForTag(tag) {
        for (const [source, tagEl] of this.#optionTags) {
            if (tagEl === tag) { return source; }
        }
        return null;
    }

    #addTag(sourceOption) {
        if (this.#optionTags.has(sourceOption)) return;

        const dialog = this.querySelector('fds-multiselect-dialog');
        const isOpen = dialog && !dialog.hidden;
        const rectBefore = isOpen ? dialog.getBoundingClientRect() : null;

        const label = sourceOption.textContent.trim();

        const tag = document.createElement('button');
        tag.classList.add('tag');
        tag.setAttribute('type', 'button');
        tag.setAttribute('aria-label', `Fjern ${label}`);

        const tagLabel = document.createElement('span');
        tagLabel.classList.add('tag-label');
        tagLabel.textContent = label;
        tag.appendChild(tagLabel);

        const closeIcon = CE.createSvgIcon('m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z');
        tag.appendChild(closeIcon);

        this.shadowRoot.querySelector('.tags').appendChild(tag);
        this.#optionTags.set(sourceOption, tag);
        tag.disabled = this.disabled;
        this.#constrainTagWidth(tag);

        this.#refreshOpener();
        this.#updateTagsGroup();
        this.#updateFormValue();
        this.#updateValidity();

        // Prevent the dialog from changing position on the screen when an option is selected
        if (isOpen) {
            const rectAfter = dialog.getBoundingClientRect();
            const difference = rectAfter.top - rectBefore.top;
            if (difference !== 0) {
                this.#getScrollableAncestor().scrollBy(0, difference);
            }
        }
    }

    #removeTag(sourceOption) {
        const tag = this.#optionTags.get(sourceOption);
        if (!tag) return;

        const dialog = this.querySelector('fds-multiselect-dialog');
        const isOpen = dialog && !dialog.hidden;
        const rectBefore = isOpen ? dialog.getBoundingClientRect() : null;

        tag.remove();
        this.#optionTags.delete(sourceOption);

        this.#refreshOpener();
        this.#updateTagsGroup();
        this.#updateFormValue();
        this.#updateValidity();

        if (isOpen) {
            const rectAfter = dialog.getBoundingClientRect();
            const difference = rectAfter.top - rectBefore.top;
            if (difference !== 0) {
                this.#getScrollableAncestor().scrollBy(0, difference);
            }
        }
    }

    #constrainTagWidth(tag) {
        const tagLabel = tag.querySelector('.tag-label');
        const textNode = tagLabel.firstChild;
        if (!textNode) return;
        const icon = tag.querySelector('.icon-svg');

        // Calculate height threshold for when a tag's text is considered to span several lines
        const tagLineHeight = parseFloat(getComputedStyle(tag).lineHeight);
        const PIXEL_BUFFER = 1; // 1 px added to avoid issues where height may be a floating number
        const singleLineHeightThreshold = tagLineHeight + PIXEL_BUFFER;

        // Reset any previously applied constraint.
        tag.style.maxWidth = '';

        const height = tag.getBoundingClientRect().height;
        if (height <= singleLineHeightThreshold) return; // Already a single line so nothing to constrain.

        // The tag wrapped onto multiple lines. Measure the widest actual rendered
        // line and set a max-width, so the box doesn't stretch wider than the text.
        const range = document.createRange();
        range.selectNodeContents(textNode);

        let widestLine = 0;
        for (const rect of range.getClientRects()) {
            if (rect.width > widestLine) { widestLine = rect.width; }
        }

        if (widestLine === 0) return;

        const tagStyle = getComputedStyle(tag);
        const paddingLeft = parseFloat(tagStyle.paddingLeft);
        const paddingRight = parseFloat(tagStyle.paddingRight);

        const iconStyle = getComputedStyle(icon);
        const marginLeft = parseFloat(iconStyle.marginLeft);
        const iconWidth = icon ? icon.getBoundingClientRect().width : 0;

        tag.style.maxWidth = `${Math.ceil(widestLine + paddingLeft + paddingRight + marginLeft + iconWidth)}px`;
    }

    #updateTagsGroup() {
        const tags = this.shadowRoot.querySelector('.tags');
        const hasTags = tags.children.length > 0;
        const label = this.#getLabel();

        if (!hasTags || !label) {
            tags.removeAttribute('role');
            tags.removeAttribute('aria-label');
            return;
        }

        tags.setAttribute('role', 'group');
        tags.setAttribute('aria-label', this.srTagsLabel ?? `Valgte muligheder for ${label.textContent}`);
    }

    #updateFormValue() {
        if (!this.name) {
            this.#internals.setFormValue(null);
            return;
        }

        const formData = new FormData();
        for (const value of this.value) {
            formData.append(this.name, value);
        }

        this.#internals.setFormValue(formData);
    }

    #updateValidity() {
        const hasValue = this.value.length > 0;

        if (this.required && !hasValue) {
            const opener = this.querySelector('fds-multiselect-opener');
            this.#internals.setValidity({ valueMissing: true }, 'Vælg mindst én mulighed', opener);
        }
        else {
            this.#internals.setValidity({});
        }
    }

    #updateRequiredStatus() {
        const label = this.#getLabel();
        const opener = this.querySelector('fds-multiselect-opener');
        if (!label || !opener) return;

        const value = this.getAttribute('show-required-status');

        if (value === null) {
            const indicator = label.querySelector(':scope > span.weight-normal');
            if (indicator) { indicator.remove(); }
            return;
        }

        CE.showRequiredStatus(label, opener, value);
    }

    #syncRequiredToOpener() {
        const opener = this.querySelector('fds-multiselect-opener');
        if (!opener) return;

        this.required ? opener.setAttribute('aria-required', 'true') : opener.removeAttribute('aria-required');
    }

    #syncDisabledState() {
        const opener = this.querySelector('fds-multiselect-opener');
        const isDisabled = this.disabled;

        if (opener) {
            if (isDisabled) {
                opener.setAttribute('aria-disabled', 'true');
                opener.removeAttribute('tabindex');
                if (opener.expanded) { opener.close(); }
            }
            else {
                opener.removeAttribute('aria-disabled');
                opener.tabIndex = 0;
            }
        }

        for (const tag of this.shadowRoot.querySelectorAll('.tag')) {
            tag.disabled = isDisabled;
        }
    }

    #getScrollableAncestor() {
        let node = this.parentElement;

        while (node) {
            const style = getComputedStyle(node);
            const isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll') && node.scrollHeight > node.clientHeight;
            if (isScrollable) { return node; }
            node = node.parentElement;
        }

        return document.scrollingElement ?? document.documentElement;
    }

    #wireRelationships() {
        // Find the elements that need to be linked.
        const label = this.#getLabel();
        const opener = this.querySelector('fds-multiselect-opener');
        const dialog = this.querySelector('fds-multiselect-dialog');

        // Give the label, opener and dialog IDs when they don't already have them.
        if (label && !label.id) { label.id = generateAndVerifyUniqueId('multiselect-label'); }
        if (opener && !opener.id) { opener.id = generateAndVerifyUniqueId('multiselect-opener'); }
        if (dialog && !dialog.id) { dialog.id = generateAndVerifyUniqueId('multiselect-dialog'); }

        // Name the opener by the label, and associate the opener with the dialog.
        if (opener) { label ? opener.setAttribute('aria-labelledby', label.id) : opener.removeAttribute('aria-labelledby'); }
        if (opener && dialog) { opener.setAttribute('aria-controls', dialog.id); }

        // Place the opener, dialog, and error messages in their shadow DOM slots.
        if (opener) { opener.setAttribute('slot', 'opener'); }
        if (dialog) { dialog.setAttribute('slot', 'dialog'); }

        for (const errorMessage of this.querySelectorAll('fds-error-message')) {
            errorMessage.setAttribute('slot', 'error');
        }

        // Update the opener's required indicator, disabled state, and help/error references.
        this.#syncRequiredToOpener();
        this.#updateRequiredStatus();
        this.#syncDisabledState();
        this.#updateAriaDescribedBy();

        const currentOptions = new Set(this.querySelectorAll('fds-multiselect-option'));

        // Remove tags whose options are no longer in this multiselect.
        for (const sourceOption of this.#optionTags.keys()) {
            if (!currentOptions.has(sourceOption)) {
                this.#removeTag(sourceOption);
            }
        }

        // Ensure each selected option has a tag.
        for (const sourceOption of currentOptions) {
            if (sourceOption.selected) {
                this.#addTag(sourceOption);
            }
        }
    }

    // fds-multiselect-opener may not have been upgraded yet when called on page load.
    // Ensure refreshOpener is called when the custom element is defined.
    #refreshOpener() {
        const opener = this.querySelector('fds-multiselect-opener');
        if (typeof opener?.refreshOpener === 'function') {
            opener.refreshOpener();
            return;
        }

        customElements.whenDefined('fds-multiselect-opener').then(() => {
            this.querySelector('fds-multiselect-opener')?.refreshOpener();
        });
    }

    #notifySummaryOnceOpenerReady() {
        customElements.whenDefined('fds-multiselect-opener').then(() => {
            CE.notifySummaryOnVisibilityChange(this);
        });
    }

    #updateAriaDescribedBy() {
        const opener = this.querySelector('fds-multiselect-opener');
        if (!opener) return;

        const errorMessages = this.querySelectorAll('fds-error-message');
        const helpTexts = this.querySelectorAll('fds-help-text');
        CE.setAriaDescribedBy(opener, errorMessages, helpTexts);
        CE.setInvalid(opener, errorMessages);
    }

    #setupHTML() {
        if (this.shadowRoot.querySelector('.opener-wrapper')) return;

        const labelSlot = document.createElement('slot');
        labelSlot.name = 'label';

        const defaultSlot = document.createElement('slot');

        const openerWrapper = document.createElement('div');
        openerWrapper.classList.add('opener-wrapper');

        const openerSlot = document.createElement('slot');
        openerSlot.name = 'opener';

        const tags = document.createElement('div');
        tags.classList.add('tags');

        const dialogSlot = document.createElement('slot');
        dialogSlot.name = 'dialog';

        openerWrapper.append(openerSlot, tags, dialogSlot);

        const errorSlot = document.createElement('slot');
        errorSlot.name = 'error';

        this.shadowRoot.append(labelSlot, defaultSlot, openerWrapper, errorSlot);
    }

    #connectMutationObserver() {
        if (this.#mutationObserver) return;
        this.#mutationObserver = new MutationObserver(this.#handleMutations);
        this.#mutationObserver.observe(this, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['hidden', 'aria-hidden', 'id', 'class']
        });
    }

    #disconnectMutationObserver() {
        if (this.#mutationObserver) {
            this.#mutationObserver.disconnect();
            this.#mutationObserver = null;
        }
    }

    #addEventListeners() {
        this.addEventListener('fds-multiselect-opener-expanded', this.#handleOpenerExpanded);
        this.addEventListener('fds-multiselect-opener-collapsed', this.#handleOpenerCollapsed);
        this.addEventListener('fds-multiselect-option-selected', this.#handleOptionSelected);
        this.addEventListener('fds-multiselect-option-deselected', this.#handleOptionDeselected);
        this.addEventListener('click', this.#handleLabelClick);
        this.addEventListener('focusout', this.#handleFocusOut);
        this.addEventListener('keydown', this.#handleKeyDown);
        this.addEventListener('mousedown', this.#handleMouseDown);
        this.shadowRoot.addEventListener('click', this.#handleTagClick);
        window.addEventListener('load', this.#handleWindowLoad, { once: true });
    }

    #removeEventListeners() {
        this.removeEventListener('fds-multiselect-opener-expanded', this.#handleOpenerExpanded);
        this.removeEventListener('fds-multiselect-opener-collapsed', this.#handleOpenerCollapsed);
        this.removeEventListener('fds-multiselect-option-selected', this.#handleOptionSelected);
        this.removeEventListener('fds-multiselect-option-deselected', this.#handleOptionDeselected);
        this.removeEventListener('click', this.#handleLabelClick);
        this.removeEventListener('focusout', this.#handleFocusOut);
        this.removeEventListener('keydown', this.#handleKeyDown);
        this.removeEventListener('mousedown', this.#handleMouseDown);
        this.shadowRoot.removeEventListener('click', this.#handleTagClick);
        window.removeEventListener('load', this.#handleWindowLoad);
    }

    #init() {
        customElements.upgrade(this);

        this.#setupHTML();
        this.#wireRelationships();
        this.#addEventListeners();
        this.#connectMutationObserver();
        this.#updateFormValue();
        this.#updateValidity();
        this.#notifySummaryOnceOpenerReady();

        this.#initialized = true;
    }

    // #endregion

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
        this.#internals = this.attachInternals();
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
        this.#removeEventListeners();
        this.#disconnectMutationObserver();
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {
            case 'name':
                this.#updateFormValue();
                break;
            case 'sr-tags-label':
                this.#updateTagsGroup();
                break;
            case 'show-required-status':
                this.#updateRequiredStatus();
                break;
            case 'required':
                this.#syncRequiredToOpener();
                this.#updateRequiredStatus();
                this.#updateValidity();
                break;
            case 'disabled':
                this.#syncDisabledState();
                break;
        }
    }

    // #endregion

    // #region - FORM-ASSOCIATED CALLBACKS ------------------------------------------------------------------

    formResetCallback() {
        for (const sourceOption of this.querySelectorAll('fds-multiselect-option')) {
            sourceOption.reset();
        }
    }

    formDisabledCallback(disabled) {
        this.#formDisabled = disabled;
        this.#syncDisabledState();
    }

    // #endregion
}

function registerMultiselect() {
    if (!customElements.get('fds-multiselect')) {
        customElements.define('fds-multiselect', FDSMultiselect);
    }
}

export default registerMultiselect;