import * as CE from '../custom-element-utils';
import { generateAndVerifyUniqueId } from '../../utils/generate-unique-id';

class FDSDropdownMenu extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['id', 'expanded', 'ready'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get ready() { return this.getAttribute('ready') !== 'false'; }
    set ready(value) { this.setAttribute('ready', value ? 'true' : 'false'); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #variant = null;
    #generatedPanelId = false;
    #plusIcon = 'M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z';
    #minusIcon = 'M200-440v-80h560v80H200Z';
    #chevronDownIcon = 'M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z';
    #chevronUpIcon = 'M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z';
    #moreVertIcon = 'M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z';

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = () => {
        this.toggle();
    };

    #handleFocusOut = (event) => {
        if (event.relatedTarget && !this.contains(event.relatedTarget)) {
            this.close();
        }
    };

    #handleKeydown = (event) => {
        if (event.key === 'Escape') {
            this.close();
            this.querySelector(':scope > .dropdown-button')?.focus();
        }
    };

    #handleItemClick = (event) => {
        const item = event.target.closest('[data-menu-item]');
        const menu = this.querySelector(':scope > .dropdown-menu');

        if (!item || !menu?.contains(item) || item.closest('fds-dropdown-menu') !== this) return;

        if (this.#variant === 'sort' && item.matches('button[data-value]')) {
            this.selectSortValue(item.dataset.value);
        }

        this.close();
    };

    #handleOutsideClick = (event) => {
        if (!this.contains(event.target)) {
            this.close();
        }
    };

    #handleResize = () => {
        this.#positionMenu();
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #isDrawerSubmenu() {
        return !!this.closest('fds-main-menu') && !this.closest('fds-main-menu .main-menu-inner');
    }

    #getSortOptions() {
        const menu = this.querySelector(':scope > .dropdown-menu');
        if (!menu) return [];

        return [...menu.querySelectorAll('button[data-value]')]
            .filter(option => option.closest('fds-dropdown-menu') === this);
    }

    #syncPanelId() {
        const menu = this.querySelector(':scope > .dropdown-menu');
        const button = this.querySelector(':scope > .dropdown-button');
        if (!menu) return;

        if (!menu.id) {
            // No panel ID was supplied: this component owns the generated ID.
            this.#generatedPanelId = true;
            menu.id = this.id ? `${this.id}-dropdown-menu-panel` : generateAndVerifyUniqueId('dropdown');
        }
        else if (this.#generatedPanelId && this.id) {
            // A parent may have assigned the dropdown's ID after initialization.
            menu.id = `${this.id}-dropdown-menu-panel`;
        }

        button?.setAttribute('aria-controls', menu.id);
    }

    #setupHTML() {
        // Dropdown button
        if (!this.querySelector(':scope > .dropdown-button')) {
            this.querySelector(':scope > button')?.classList.add('dropdown-button');
        }

        // Dropdown button icon
        if (!this.querySelector(':scope > .dropdown-button span svg')) {
            let collapsedIcon = this.#moreVertIcon;
            let expandedIcon = this.#moreVertIcon;

            if (this.closest('fds-modal fds-main-menu')) {
                collapsedIcon = this.#plusIcon;
                expandedIcon = this.#minusIcon;
            }
            else if (this.closest('fds-main-menu .main-menu-inner li:not(.more-button)')) {
                collapsedIcon = this.#chevronDownIcon;
                expandedIcon = this.#chevronUpIcon;
            }

            const span = this.querySelector(':scope > .dropdown-button span');
            const collapsed = CE.createSvgIcon(collapsedIcon);
            collapsed.classList.add('collapsed-icon');
            span?.appendChild(collapsed);

            const expanded = CE.createSvgIcon(expandedIcon);
            expanded.classList.add('expanded-icon');
            span?.appendChild(expanded);
        }

        // Dropdown menu
        if (!this.querySelector(':scope > .dropdown-menu')) {
            this.querySelector(':scope > div')?.classList.add('dropdown-menu');
        }

        this.#syncPanelId();

        this.querySelectorAll(':scope > .dropdown-menu a, :scope > .dropdown-menu button').forEach(item => {
            if (item.closest('fds-dropdown-menu') === this) {
                item.setAttribute('data-menu-item', '');
            }
        });

        if (!this.hasAttribute('expanded')) {
            this.setAttribute('expanded', 'false');
        }
        this.#updateExpanded(this.getAttribute('expanded'));

        // Don't close the dropdown when something non-clickable inside it is clicked (like a subtitle)
        if (!this.#isDrawerSubmenu()) {
            this.querySelector(':scope > .dropdown-menu')?.setAttribute('tabindex', '-1');
        }
    }

    #initializeSort() {
        const options = this.#getSortOptions();
        if (!options.length) return;

        const defaultValue = this.getAttribute('default-value');
        const initialOption = options.find(option => option.dataset.value === defaultValue) ?? options[0];

        // Initial selection updates the UI without dispatching an event.
        this.selectSortValue(initialOption.dataset.value, false);
    }

    #positionMenu() {
        const menu = this.querySelector(':scope > .dropdown-menu');
        if (!menu) return;

        menu.style.removeProperty('max-width');
        menu.style.removeProperty('left');
        menu.style.removeProperty('right');

        const rect = menu.getBoundingClientRect();
        const viewportWidth = window.visualViewport?.width ?? document.documentElement.clientWidth;

        if (menu.offsetWidth > viewportWidth) {
            menu.style.maxWidth = `${viewportWidth}px`;
        }
        else if (rect.left < 0) {
            menu.style.left = '0px';
            menu.style.right = 'auto';
        }
        else if (rect.left + menu.offsetWidth > viewportWidth) {
            menu.style.left = 'auto';
            menu.style.right = '0px';
        }
    }

    #updateExpanded(value) {
        const dropdownButton = this.querySelector(':scope > .dropdown-button');
        const menu = this.querySelector(':scope > .dropdown-menu');

        if (value === 'false') {
            dropdownButton?.setAttribute('aria-expanded', 'false');
            menu?.classList.add('collapsed');
            menu?.removeAttribute('style');
            window.removeEventListener('resize', this.#handleResize);

            if (!this.#isDrawerSubmenu()) {
                document.removeEventListener('mousedown', this.#handleOutsideClick, false);
            }

            this.dispatchEvent(new Event('fds-dropdown-menu-closed'));
        }
        else {
            dropdownButton?.setAttribute('aria-expanded', 'true');
            menu?.classList.remove('collapsed');

            if (!this.#isDrawerSubmenu()) {
                document.addEventListener('mousedown', this.#handleOutsideClick, false);
            }

            this.#positionMenu();
            window.addEventListener('resize', this.#handleResize);
            this.dispatchEvent(new Event('fds-dropdown-menu-opened'));
        }
    }

    #addEventListeners() {
        this.querySelector(':scope > .dropdown-button')?.addEventListener('click', this.#handleClick);

        if (!this.#isDrawerSubmenu()) {
            this.addEventListener('focusout', this.#handleFocusOut, false);
            this.addEventListener('keydown', this.#handleKeydown, false);
            this.querySelector(':scope > .dropdown-menu')?.addEventListener('click', this.#handleItemClick, false);
        }
    }

    #removeEventListeners() {
        this.querySelector(':scope > .dropdown-button')?.removeEventListener('click', this.#handleClick);

        if (!this.#isDrawerSubmenu()) {
            this.removeEventListener('focusout', this.#handleFocusOut, false);
            this.removeEventListener('keydown', this.#handleKeydown, false);
            this.querySelector(':scope > .dropdown-menu')?.removeEventListener('click', this.#handleItemClick, false);
        }
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        if (this.#initialized) return;

        // Read once. Changes to variant after initialization are unsupported.
        this.#variant = this.getAttribute('variant') === 'sort' ? 'sort' : null;

        this.#setupHTML();
        if (this.#variant === 'sort') { this.#initializeSort(); }
        this.#addEventListeners();
        this.#initialized = true;
    }

    toggle() {
        this.getAttribute('expanded') === 'false' ? this.setAttribute('expanded', 'true') : this.setAttribute('expanded', 'false');
    }

    open() {
        this.setAttribute('expanded', 'true');
    }

    close() {
        this.setAttribute('expanded', 'false');
    }

    selectSortValue(value, dispatch = true) {
        if (this.#variant !== 'sort') return;

        const options = this.#getSortOptions();
        const option = options.find(item => item.dataset.value === value);
        if (!option) return;

        const previousValue = this.dataset.selectedValue ?? null;
        if (value === previousValue) return;

        options.forEach(item => item.removeAttribute('aria-current'));
        option.setAttribute('aria-current', 'true');

        this.dataset.selectedValue = value;

        const label = this.querySelector(':scope > .dropdown-button .selected-value');
        if (label) { label.textContent = option.textContent.trim(); }

        if (dispatch) {
            this.dispatchEvent(new CustomEvent('fds-sort-menu-changed', {
                bubbles: true,
                detail: { value, previousValue },
            }));
        }
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
        this.#removeEventListeners();
        window.removeEventListener('resize', this.#handleResize);

        if (!this.#isDrawerSubmenu()) {
            document.removeEventListener('mousedown', this.#handleOutsideClick, false);
        }

        this.#initialized = false;
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

        if (!this.#initialized || oldValue === newValue) return;

        if (attribute === 'id') {
            this.#syncPanelId();
        }
        else if (attribute === 'expanded') {
            this.#updateExpanded(newValue);
        }
    }

    // #endregion
}

function registerDropdownMenu() {
    if (!customElements.get('fds-dropdown-menu')) {
        customElements.define('fds-dropdown-menu', FDSDropdownMenu);
    }
}

export default registerDropdownMenu;