export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        padding: 0;
        overflow: hidden;
        clip-path: inset(50%);
        border: 0;
        user-select: none;
        white-space: nowrap;
    }

    :host {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #1a1a1a;
        font-size: 1.6rem;
        line-height: 2.4rem;
        width: 100%;
        min-width: 0;
        padding: 7px 47px 7px 15px;
        border: 1px solid var(--color-gray-400);
        border-radius: 8px;
        background-color: var(--color-white);
    }

    :host(:focus) {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    :host([aria-disabled="true"]) {
        color: #707070;
        cursor: not-allowed;
        border-color: var(--color-gray-200);
    }

    .opener-text {
        flex: 1 1 auto;
        min-width: 0;
        overflow-wrap: break-word;
    }

    .chevron-icon {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        width: 2.4rem;
        height: 2.4rem;
        pointer-events: none;
    }

    :host([aria-disabled="true"]) .chevron-icon {
        fill: #8E8E8E;
    }

    :host([aria-invalid="true"]) {
        border: 2px solid var(--color-error);
        padding: 6px 46px 6px 14px;
    }

    :host([aria-invalid="true"]) .chevron-icon {
        right: 15px;
    }
`;