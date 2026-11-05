export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
    }

    :host(:focus) {
        outline: 0;
    }

    ::slotted(fds-multiselect-option),
    ::slotted(fds-multiselect-select-all) {
        min-width: 0;
    }

    :host(:focus) ::slotted(fds-multiselect-option[data-active]) {
        outline: 3px solid #454545;
        outline-offset: -3px;
    }
`;