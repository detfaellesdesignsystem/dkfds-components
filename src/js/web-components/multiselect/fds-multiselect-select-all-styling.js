export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        cursor: pointer;
        color: var(--color-black);
        font-size: 1.6rem;
        line-height: 1.5;
        margin-bottom: 8px;
        padding-bottom: 7px;
        border-bottom: 1px solid var(--color-gray-200);
    }

    .select-all-wrapper {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding-left: 15px;
    }

    :host(:hover) .select-all-wrapper {
        background-color: var(--color-gray-100);
    }

    :host(:active) .select-all-wrapper {
        background-color: var(--color-gray-200);
    }

    .select-all-box {
        flex: 0 0 auto;
        width: 2.4rem;
        height: 2.4rem;
        border: 2px solid var(--color-black);
        border-radius: 4px;
        background-color: var(--color-white);
        margin-top: 8px;
    }

    .select-all-box .check-icon,
    .select-all-box .indeterminate-icon {
        display: none;
    }

    :host([aria-checked="true"]) .select-all-box,
    :host([aria-checked="mixed"]) .select-all-box {
        background-color: var(--color-black);
        border: 0;
    }

    :host([aria-checked="true"]) .select-all-box .check-icon {
        display: block;
        fill: var(--color-white);
    }

    :host([aria-checked="mixed"]) .select-all-box .indeterminate-icon {
        display: block;
        fill: var(--color-white);
    }

    .select-all-label {
        flex: 1 1 auto;
        min-width: 0;
        overflow-wrap: break-word;
        padding-left: 0;
        padding-top: 8px;
        padding-bottom: 8px;
    }

    :host([data-active][data-listbox-focused]) .select-all-wrapper {
        outline: 3px solid #454545;
        outline-offset: -3px;
    }

`;