export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        border: 1px solid var(--tab-panel-border-color);
        width: 100%;
        overflow: auto hidden;
        background-color: var(--tab-panel-background-color);
    }

    :host(:focus) {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    .scroll-container {
        display: block;
        width: fit-content;
        min-width: 100%;
        padding: 24px;
    }
`;