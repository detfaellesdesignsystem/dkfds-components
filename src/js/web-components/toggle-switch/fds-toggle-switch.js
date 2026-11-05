class FDSToggleSwitch extends HTMLElement {

    // #region - ATTRIBUTES (can invoke attributeChangedCallback()) -----------------------------------------

    static observedAttributes = ['state', 'label', 'disabled-switch'];

    // #endregion

    // #region - GETTERS AND SETTERS ------------------------------------------------------------------------

    get state() { return this.getAttribute('state') ?? 'off'; } // Default state is 'off'
    set state(value) { value == null ? this.removeAttribute('state') : this.setAttribute('state', value); }

    get label() { return this.getAttribute('label'); }
    set label(value) { value == null ? this.removeAttribute('label') : this.setAttribute('label', value); }

    get disabledSwitch() { return this.getAttribute('disabled-switch'); }
    set disabledSwitch(value) { value == null ? this.removeAttribute('disabled-switch') : this.setAttribute('disabled-switch', value); }

    // #endregion

    // #region - PRIVATE INSTANCE FIELDS --------------------------------------------------------------------

    #initialized = false;

    // #endregion

    // #region - PRIVATE EVENT HANDLERS ---------------------------------------------------------------------

    #handleClick = () => {
        this.toggle();
    };

    // #endregion

    // #region - PRIVATE METHODS ----------------------------------------------------------------------------

    #setupHTML() {
        const button = this.querySelector('button') ?? document.createElement('button');
        const buttonText = this.querySelector('button span') ?? document.createElement('span');

        // Ensure label attribute is used as label when attribute is present
        buttonText.textContent = this.getAttribute('label') ?? buttonText.textContent;

        // Add the button text if not already present
        if (!buttonText.isConnected) {
            button.appendChild(buttonText);
        }

        // Add the button if not already present
        button.setAttribute('type', 'button');
        button.setAttribute('role', 'switch');
        if (!button.isConnected) {
            this.appendChild(button);
        }

        // Set on-off state of the button
        this.#stateChange(this.getAttribute('state'), false);

        // Set disabled state of the button
        !this.hasAttribute('disabled-switch') || this.getAttribute('disabled-switch') === 'false' ? button.removeAttribute('disabled') : button.setAttribute('disabled', '');
    }

    #stateChange(newState, dispatchEvent) {
        const button = this.querySelector('button');

        let eventName = 'fds-toggle-off';

        if (newState === 'off' || !newState) {
            button.setAttribute('aria-checked', 'false');
        }
        else {
            button.setAttribute('aria-checked', 'true');
            eventName = 'fds-toggle-on';
        }

        if (dispatchEvent && !button.disabled) {
            this.dispatchEvent(new Event(eventName));
        }
    }

    #init() {
        this.#setupHTML();
        this.querySelector('button')?.addEventListener('click', this.#handleClick);
        this.#initialized = true;
    }

    // #endregion

    // #region - PUBLIC METHODS -----------------------------------------------------------------------------

    on() {
        this.setAttribute('state', 'on');
    }

    off() {
        this.setAttribute('state', 'off');
    }

    toggle() {
        this.state === 'off' ? this.on() : this.off();
    }

    // #endregion

    // #region - ADDED TO DOCUMENT --------------------------------------------------------------------------

    connectedCallback() {
        this.#init();
    }

    // #endregion

    // #region - REMOVED FROM DOCUMENT ----------------------------------------------------------------------

    disconnectedCallback() {
        this.querySelector('button')?.removeEventListener('click', this.#handleClick);
        this.#initialized = false;
    }

    // #endregion

    // #region - ATTRIBUTE(S) CHANGED -----------------------------------------------------------------------

    attributeChangedCallback(attribute, oldValue, newValue) {
        if (!this.#initialized) return;
        if (oldValue === newValue) return;

        switch (attribute) {

            case 'state':
                this.#stateChange(newValue, true);
                break;

            case 'label':
                const span = this.querySelector('button span');
                if (span) { span.textContent = newValue ?? ''; }
                break;

            case 'disabled-switch':
                const button = this.querySelector('button');
                newValue === null || newValue === 'false' ? button.removeAttribute('disabled') : button.setAttribute('disabled', '');
                break;
        }
    }

    // #endregion
}

function registerToggleSwitch() {
    if (!customElements.get('fds-toggle-switch')) {
        customElements.define('fds-toggle-switch', FDSToggleSwitch);
    }
}

export default registerToggleSwitch;