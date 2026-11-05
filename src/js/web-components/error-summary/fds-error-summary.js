class FDSErrorSummary extends HTMLElement {

    // #region - ATTRIBUTES ---------------------------------------------------------------------------------

    static observedAttributes = ['ready'];

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = (event) => {
        // Only handle plain clicks, so "open in new tab" and similar keep working
        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

        const link = event.target.closest('a[href]');

        if (!link || !this.contains(link)) return;
        if (link.target && link.target !== '_self') return;
        if (!this.#isSamePageLink(link)) return;

        if (this.#focusTarget(link)) {
            event.preventDefault();
        }
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    // Check if a link goes to somewhere on the same page
    #isSamePageLink(link) {
        const isSameOrigin = link.origin === location.origin;
        const isSamePath = link.pathname === location.pathname;
        const isSameQuery = link.search === location.search;

        return isSameOrigin && isSamePath && isSameQuery;
    }

    // Scrolls the legend/label into view, then focuses the destination without scrolling.
    // Returns true if the destination was focused (so the default anchor jump can be cancelled).
    #focusTarget(link) {
        let destinationId = link.hash.slice(1);
        if (!destinationId) return false;

        // link.hash may turn e.g. "æ" in an ID into "%C3%A6". Prevent ID mismatch.
        try {
            destinationId = decodeURIComponent(destinationId);
        }
        catch {
            return false;
        }

        const destination = document.getElementById(destinationId);
        if (!destination) return false;

        const legendOrLabel = this.#getAssociatedLegendOrLabel(destination);
        if (!legendOrLabel) return false;

        legendOrLabel.scrollIntoView();
        destination.focus({ preventScroll: true });

        return true;
    }

    // Picks the element to scroll to
    #getAssociatedLegendOrLabel(destination) {
        const legend = destination.closest('fieldset')?.querySelector('legend');

        // legend

        if (legend) {
            if (destination.type === 'checkbox' || destination.type === 'radio') {
                return legend;
            }

            const legendTop = legend.getBoundingClientRect().top;
            const destinationRect = destination.getBoundingClientRect();
            const destinationBottom = destinationRect.top + destinationRect.height;

            if (destinationBottom - legendTop < window.innerHeight / 2) {
                return legend;
            }
        }

        // aria-labelledby - if several IDs, go to the first ID

        const whitespaceBetweenIds = /\s+/;

        const ariaLabelledByValue = destination.getAttribute('aria-labelledby')?.trim();
        const firstLabelledById = ariaLabelledByValue?.split(whitespaceBetweenIds)[0];

        const labelReferencedByAria = firstLabelledById ? document.getElementById(firstLabelledById) : null;
        if (labelReferencedByAria) return labelReferencedByAria;

        // label

        // Escape characters that would break a CSS selector (e.g. a quote), so the ID is safe to use below.
        const escapedId = CSS.escape(destination.id);

        const labelPointingToField = document.querySelector(`label[for="${escapedId}"]`);
        if (labelPointingToField) return labelPointingToField;

        return destination.closest('label');
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    init() {
        if (this.#initialized) return;

        if (!this.hasAttribute('role')) {
            this.setAttribute('role', 'alert');
        }

        this.addEventListener('click', this.#handleClick);

        this.#initialized = true;
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
        this.removeEventListener('click', this.#handleClick);
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (attribute === 'ready' && this.isConnected && newValue !== 'false') {
            this.init();
        }
    }

    // #endregion
}

function registerErrorSummary() {
    if (customElements.get('fds-error-summary') === undefined) {
        window.customElements.define('fds-error-summary', FDSErrorSummary);
    }
}

export default registerErrorSummary;