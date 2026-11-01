export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        position: relative;
    }

    ::slotted([slot="label"]) {
        font-size: 1.6rem;
        line-height: 2.4rem;
        font-weight: 600;
        color: #1a1a1a;
        overflow-wrap: break-word;
        display: inline-block;
        max-width: 66ch;
        cursor: default;
    }

    .opener-wrapper {
        position: relative;
        display: grid;
        margin-top: 8px;
        max-width: 32rem;
    }

    ::slotted(fds-multiselect-opener) {
        display: block;
        grid-area: 1 / 1;
        z-index: 1;
    }

    :host(:disabled) .tag {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .tags {
        grid-area: 1 / 1;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 8px 48px 8px 16px;
        pointer-events: none;
        min-width: 0;
    }

    .tag {
        pointer-events: auto;
        appearance: none;
        display: inline-flex;
        align-items: center;
        border: none;
        border-radius: 1.2rem;
        background-color: var(--color-gray-600);
        color: var(--color-white);
        font: inherit;
        font-size: 1.6rem;
        line-height: 1.5;
        cursor: pointer;
        max-width: 100%;
        font-weight: 500;
        text-align: start;
        padding: 0 0.8rem 0 0.8rem;
    }

    .tag:hover {
        background-color: var(--color-gray-500);
    }

    .tag:focus-visible {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    .tag:disabled .icon-svg {
        display: none;
    }

    .tag-label {
        display: block;
        overflow-wrap: break-word;
        min-width: 0;
    }

    :host(:disabled) ::slotted([slot="label"]) {
        color: var(--color-gray-500);
        font-weight: 500;
    }

    .tag .icon-svg {
        min-height: 1.6rem;
        min-width: 1.6rem;
        max-height: 1.6rem;
        max-width: 1.6rem;
        fill: var(--color-white);
        margin-left: 0.4rem;
    }
`;