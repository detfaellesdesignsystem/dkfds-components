import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';
import { styles } from './fds-multiselect-options-styling';

const sheet = new CSSStyleSheet();
sheet.replaceSync(styles);

class FDSMultiselectOptions extends HTMLElement {

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = (event) => {
        const item = event.target.closest('fds-multiselect-select-all, fds-multiselect-option');
        if (!item) return;

        this.#setActiveOption(item);
        item.toggle();
    };

    #handleFocus = () => {
        this.querySelector('fds-multiselect-select-all')?.setAttribute('data-listbox-focused', '');

        if (this.#getActiveOption()) return;

        const items = this.#getNavigableItems();
        if (items.length > 0) { this.#setActiveOption(items[0]); }
    };

    // Needed for proper styling of the "select all" option
    #handleBlur = () => {
        this.querySelector('fds-multiselect-select-all')?.removeAttribute('data-listbox-focused');
    };

    #handleKeyDown = (event) => {
        const items = this.#getNavigableItems();
        const active = this.#getActiveOption();
        const currentIndex = active ? items.indexOf(active) : -1;

        switch (event.key) {
            case 'ArrowDown': {
                event.preventDefault();
                const nextIndex = Math.min(currentIndex + 1, items.length - 1);
                this.#setActiveOption(items[nextIndex]);
                break;
            }

            case 'ArrowUp': {
                event.preventDefault();
                const previousIndex = currentIndex < 0 ? 0 : Math.max(currentIndex - 1, 0);
                this.#setActiveOption(items[previousIndex]);
                break;
            }

            case 'Home':
                event.preventDefault();
                this.#setActiveOption(items[0]);
                break;

            case 'End':
                event.preventDefault();
                this.#setActiveOption(items[items.length - 1]);
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                active?.toggle();
                break;
        }
    };

    #handleSelectAllToggled = (event) => {
        const shouldSelectAll = event.detail.checked;

        for (const option of this.querySelectorAll('fds-multiselect-option')) {
            if (option.selected !== shouldSelectAll) { option.toggle(); }
        }
    };

    #handleOptionSelectedOrDeselected = () => {
        this.#updateSelectAllState();
    };

    #handleSlotChange = () => {
        this.#updateSelectAllState();
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #getActiveOption() {
        const activeId = this.getAttribute('aria-activedescendant');
        if (!activeId) return null;
        return this.querySelector(`#${activeId}`);
    }

    #setActiveOption(option) {
        if (!option) return;

        const previous = this.#getActiveOption();
        if (previous) { previous.removeAttribute('data-active'); }

        option.setAttribute('data-active', '');
        this.setAttribute('aria-activedescendant', option.id);
        option.scrollIntoView({ block: 'nearest' });
    }

    #getNavigableItems() {
        return Array.from(this.querySelectorAll('fds-multiselect-select-all, fds-multiselect-option'));
    }

    #updateSelectAllState() {
        const selectAll = this.querySelector('fds-multiselect-select-all');
        if (!selectAll) return;

        const options = Array.from(this.querySelectorAll('fds-multiselect-option'));
        const total = options.length;
        const selectedCount = options.filter(option => option.selected).length;

        let state = 'false';
        if (total > 0 && selectedCount === total) { state = 'true'; }
        else if (selectedCount > 0) { state = 'mixed'; }

        selectAll.reflectState(state);
    }

    #setupHTML() {
        if (this.shadowRoot.querySelector('slot')) return;

        const slot = document.createElement('slot');
        this.shadowRoot.appendChild(slot);
    }

    #addEventListeners() {
        this.addEventListener('click', this.#handleClick);
        this.addEventListener('focus', this.#handleFocus);
        this.addEventListener('blur', this.#handleBlur);
        this.addEventListener('keydown', this.#handleKeyDown);
        this.addEventListener('fds-multiselect-select-all-toggled', this.#handleSelectAllToggled);
        this.addEventListener('fds-multiselect-option-selected', this.#handleOptionSelectedOrDeselected);
        this.addEventListener('fds-multiselect-option-deselected', this.#handleOptionSelectedOrDeselected);
        this.shadowRoot.querySelector('slot').addEventListener('slotchange', this.#handleSlotChange);
    }

    #removeEventListeners() {
        this.removeEventListener('click', this.#handleClick);
        this.removeEventListener('focus', this.#handleFocus);
        this.removeEventListener('blur', this.#handleBlur);
        this.removeEventListener('keydown', this.#handleKeyDown);
        this.removeEventListener('fds-multiselect-select-all-toggled', this.#handleSelectAllToggled);
        this.removeEventListener('fds-multiselect-option-selected', this.#handleOptionSelectedOrDeselected);
        this.removeEventListener('fds-multiselect-option-deselected', this.#handleOptionSelectedOrDeselected);
        this.shadowRoot.querySelector('slot')?.removeEventListener('slotchange', this.#handleSlotChange);
    }

    #init() {
        this.#setupHTML();

        this.setAttribute('role', 'listbox');
        this.setAttribute('aria-multiselectable', 'true');
        this.tabIndex = 0;
        if (!this.id) { this.id = generateAndVerifyUniqueId('multiselect-options'); }

        this.#addEventListeners();

        // fds-multiselect-select-all / fds-multiselect-option may not yet be upgraded when this
        // runs, which would make the initial state computation see "selected" as false even for
        // default-selected options. Recompute once upgrades are guaranteed to have happened.
        Promise.all([
            customElements.whenDefined('fds-multiselect-select-all'),
            customElements.whenDefined('fds-multiselect-option')
        ]).then(() => this.#updateSelectAllState());

        this.#initialized = true;
    }

    // #endregion

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        if (!this.#initialized) { this.#init(); }
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#handleBlur();
        this.#removeEventListeners();
        this.#initialized = false;
    }

    // #endregion
}

function registerMultiselectOptions() {
    if (!customElements.get('fds-multiselect-options')) {
        customElements.define('fds-multiselect-options', FDSMultiselectOptions);
    }
}

export default registerMultiselectOptions;