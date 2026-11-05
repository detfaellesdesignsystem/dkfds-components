export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 8px 15px;
        cursor: pointer;
        color: var(--color-black);
        font-size: 1.6rem;
        line-height: 1.5;
    }

    :host(:hover) {
        background-color: var(--color-gray-100);
    }

    :host(:active) {
        background-color: var(--color-gray-200);
    }

    .option-checkbox {
        flex: 0 0 auto;
        width: 2.4rem;
        height: 2.4rem;
        border: 2px solid var(--color-black);
        border-radius: 4px;
        background-color: var(--color-white);
    }

    .option-checkbox path {
        display: none;
    }

    :host([aria-selected="true"]) .option-checkbox {
        background-color: var(--color-black);
        border: 0;
    }

    :host([aria-selected="true"]) .option-checkbox path {
        display: block;
        fill: var(--color-white);
    }

    .option-label {
        flex: 1 1 auto;
        min-width: 0;
        overflow-wrap: break-word;
    }
`;