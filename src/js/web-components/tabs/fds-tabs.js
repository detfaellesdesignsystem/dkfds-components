import { styles } from './fds-tabs-styling';
import breakpoints from '../../utils/breakpoints';

const mutationObserverConfig = {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['tab-key'],
};

class FDSTabs extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['breakpoint'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get defaultTab() { return this.getAttribute('default-tab'); }
    set defaultTab(value) { value == null ? this.removeAttribute('default-tab') : this.setAttribute('default-tab', value); }

    get breakpoint() {
        const value = this.getAttribute('breakpoint');
        return (value in breakpoints) ? value : 'md';
    }
    set breakpoint(value) { value == null ? this.removeAttribute('breakpoint') : this.setAttribute('breakpoint', value); }


    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;
    #mutationObserver = null;
    #sheet = new CSSStyleSheet();

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = (event) => {
        const tabElement = event.composedPath().find((node) => node.nodeName === 'FDS-TAB');
        if (!tabElement || !tabElement.tabKey) return;

        this.selectTab(tabElement.tabKey);
    };

    #handleKeyDown = (event) => {
        const tabElement = event.composedPath().find((node) => node.nodeName === 'FDS-TAB');
        if (!tabElement) return;

        const assignedTabs = this.shadowRoot.querySelector('#tab-slot').assignedElements();
        const currentIndex = assignedTabs.indexOf(tabElement);
        if (currentIndex === -1) return;

        let newIndex;

        switch (event.key) {
            case 'ArrowLeft':
                newIndex = currentIndex - 1;
                if (newIndex < 0) { newIndex = assignedTabs.length - 1; }
                break;
            case 'ArrowRight':
                newIndex = currentIndex + 1;
                if (newIndex >= assignedTabs.length) { newIndex = 0; }
                break;
            case 'Home':
                newIndex = 0;
                break;
            case 'End':
                newIndex = assignedTabs.length - 1;
                break;
            default:
                return;
        }

        event.preventDefault(); // Prevent default ArrowLeft, ArrowRight, Home, and End

        const newTab = assignedTabs[newIndex];
        newTab.focus();
        this.selectTab(newTab.tabKey);
    };

    #handleMutations = () => {
        this.#updateSlotAssignments();
        this.#ensureValidSelection();
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        if (this.shadowRoot.querySelector('div[role="tablist"]')) return;

        const wrapper = document.createElement('div');
        wrapper.setAttribute('role', 'tablist');

        const tabSlot = document.createElement('slot');
        tabSlot.id = 'tab-slot';
        wrapper.appendChild(tabSlot);

        const panelSlot = document.createElement('slot');
        panelSlot.id = 'panel-slot';

        this.shadowRoot.appendChild(wrapper);
        this.shadowRoot.appendChild(panelSlot);
    }

    #getSelectedTab() {
        return this.dataset.selectedTab ?? null;
    }

    #setSelectedTab(tabKey) {
        if (tabKey == null) {
            delete this.dataset.selectedTab;
        }
        else {
            this.dataset.selectedTab = tabKey;
        }
    }

    #applyStyles() {
        this.#sheet.replaceSync(styles(`${breakpoints[this.breakpoint]}px`));
    }

    // Returns a Map of (tab-key, element) for all direct children matching the given tag name.
    #createTabKeyMap(tagName) {
        const validTabKeyElements = new Map();

        for (const child of this.children) {
            const isValidTabKeyElement = child.tagName === tagName && child.tabKey;

            if (isValidTabKeyElement) {
                if (validTabKeyElements.has(child.tabKey)) {
                    console.warn(`fds-tabs: duplicate tab-key "${child.tabKey}" on ${tagName.toLowerCase()}.`, child);
                }
                else {
                    validTabKeyElements.set(child.tabKey, child);
                }
            }
        }

        return validTabKeyElements;
    }

    // Assign valid tab and tab-panel pairs to slots
    #updateSlotAssignments() {
        const tabsByKey = this.#createTabKeyMap('FDS-TAB');
        const panelsByKey = this.#createTabKeyMap('FDS-TAB-PANEL');

        const pairedTabs = [];
        const pairedPanels = [];

        for (const [tabKey, tab] of tabsByKey) {
            const panel = panelsByKey.get(tabKey);
            if (panel) {
                tab.setAttribute('aria-controls', panel.id);
                panel.setAttribute('aria-labelledby', tab.id);
                tab.breakpoint = this.breakpoint;

                if (tabKey === this.#getSelectedTab()) {
                    tab.setAttribute('aria-selected', 'true');
                    tab.tabIndex = 0;
                    panel.hidden = false;
                }
                else {
                    tab.setAttribute('aria-selected', 'false');
                    tab.tabIndex = -1;
                    panel.hidden = true;
                }

                pairedTabs.push(tab);
                pairedPanels.push(panel);
            }
        }

        this.shadowRoot.querySelector('#tab-slot').assign(...pairedTabs);
        this.shadowRoot.querySelector('#panel-slot').assign(...pairedPanels);
    }

    // Sets the initial selection: default-tab if it matches a valid tab, otherwise the first one.
    #selectInitialTab() {
        const assignedTabs = this.shadowRoot.querySelector('#tab-slot').assignedElements();
        if (assignedTabs.length === 0) return;

        const hasDefaultTab = assignedTabs.some((tab) => tab.tabKey === this.defaultTab);
        const initialTabKey = hasDefaultTab ? this.defaultTab : assignedTabs[0].tabKey;

        this.selectTab(initialTabKey, false);
    }

    // Called after tabs/panels are added or removed. If the current selection is no longer valid,
    // falls back to the first remaining tab, or clears the selection entirely if none remain.
    #ensureValidSelection() {
        const assignedTabs = this.shadowRoot.querySelector('#tab-slot').assignedElements();

        const isStillValid = assignedTabs.some((tab) => tab.tabKey === this.#getSelectedTab());
        if (isStillValid) return;

        if (assignedTabs.length > 0) {
            this.selectTab(assignedTabs[0].tabKey);
        }
        else {
            this.#setSelectedTab(null);
        }
    }

    #connectMutationObserver() {
        if (this.#mutationObserver) return;
        this.#mutationObserver = new MutationObserver(this.#handleMutations);
        this.#mutationObserver.observe(this, mutationObserverConfig);
    }

    #disconnectMutationObserver() {
        if (this.#mutationObserver) {
            this.#mutationObserver.disconnect();
            this.#mutationObserver = null;
        }
    }

    #addEventListeners() {
        this.addEventListener('click', this.#handleClick);
        this.addEventListener('keydown', this.#handleKeyDown);
    }

    #removeEventListeners() {
        this.removeEventListener('click', this.#handleClick);
        this.removeEventListener('keydown', this.#handleKeyDown);
    }

    #init() {
        // Ensures custom element children are upgraded before reading their properties (e.g. after insertions with innerHTML or devtools edits)
        customElements.upgrade(this); 

        this.#applyStyles();
        this.#setupHTML();
        this.#updateSlotAssignments();
        this.#selectInitialTab();
        this.#addEventListeners();
        this.#connectMutationObserver();
        this.#initialized = true;
    }

    // #endregion

    // #region - CONSTRUCTOR (do not access or add attributes in the constructor) ---------------------------

    constructor() {
        super();
        this.attachShadow({ mode: 'open', slotAssignment: 'manual' });
        this.shadowRoot.adoptedStyleSheets = [this.#sheet];
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    selectTab(tabKey, dispatch = true) {
        if (tabKey === this.#getSelectedTab()) return;

        const assignedTabs = this.shadowRoot.querySelector('#tab-slot').assignedElements();
        const assignedPanels = this.shadowRoot.querySelector('#panel-slot').assignedElements();

        const newTab = assignedTabs.find((tab) => tab.tabKey === tabKey);
        if (!newTab) return; // Return if the tab to select doesn't exist

        const previousTabKey = this.#getSelectedTab();

        const previouslySelectedTabs = this.querySelectorAll(':scope > fds-tab[aria-selected="true"]');
        for (const tab of previouslySelectedTabs) {
            tab.setAttribute('aria-selected', 'false');
            tab.tabIndex = -1;
        }

        newTab.setAttribute('aria-selected', 'true');
        newTab.tabIndex = 0;

        for (const panel of assignedPanels) {
            panel.hidden = panel.tabKey !== tabKey;
        }

        this.#setSelectedTab(tabKey);

        if (dispatch) {
            this.dispatchEvent(new CustomEvent('fds-tab-changed', {
                bubbles: true,
                detail: {
                    selectedTab: tabKey,
                    previousTab: previousTabKey,
                },
            }));
        }
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.#init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.#removeEventListeners();
        this.#disconnectMutationObserver();
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        if (attribute === 'breakpoint') {
            this.#applyStyles();
            this.#updateSlotAssignments();
        }
    }

    // #endregion
}

function registerTabs() {
    if (!customElements.get('fds-tabs')) {
        customElements.define('fds-tabs', FDSTabs);
    }
}

export default registerTabs;
