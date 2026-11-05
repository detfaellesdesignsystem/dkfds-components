export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        margin-top: 16px;
        margin-bottom: 16px;
    }

    :host(:first-child) {
        margin-top: 0;
    }

    :host([data-visibility="hidden"]) {
        display: none;
    }

    .alert {
        position: relative;
        border-radius: 8px;
        padding: 1.6rem;
        padding-left: 5.2rem;
        background-repeat: no-repeat;
        background-color: var(--alert-background-color);
        background-image: linear-gradient(to right, var(--alert-border-color) 4px, transparent 4px);
    }

    .alert-info {
        --alert-background-color: #e2f2fb;
        --alert-border-color: #1B86C3;
    }

    .alert-success {
        --alert-background-color: #ddf7ce;
        --alert-border-color: #358000;
    }

    .alert-warning {
        --alert-background-color: #FFEECC;
        --alert-border-color: #febb30;
    }

    .alert-error {
        --alert-background-color: #FFE0E0;
        --alert-border-color: #CC0000;
    }

    .alert-row-with-close {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1.6rem;
    }

    slot[name="heading"]::slotted(*) {
        margin-top: var(--alert-heading-margin-top) !important;
        margin-bottom: var(--alert-heading-margin-bottom) !important;
        font-size: 1.6rem !important;
        line-height: 1.5 !important;
        font-weight: 600 !important;
        color: #1a1a1a !important;
        overflow-wrap: break-word !important;
        display: block !important;
        min-width: 0 !important;
    }

    .alert-row-with-close slot[name="content"]::slotted(*),
    slot[name="content"]::slotted(*) {
        margin-top: var(--alert-content-margin-top) !important;
        margin-bottom: var(--alert-content-margin-bottom) !important;
        min-width: 0 !important;
    }

    .alert-icon,
    slot[name="icon"]::slotted(*) {
        height: 2.4rem;
        width: 2.4rem;
        vertical-align: middle;
        fill: currentColor;
        position: absolute;
        left: 2rem;
    }

    .alert-close {
        background-color: rgba(0, 0, 0, 0);
        border: 0;
        border-radius: 0;
        font-weight: 400;
        margin: 0;
        padding: 0;
        text-align: left;
        min-height: auto;
        cursor: pointer;
        color: #1a1a1a;
        text-decoration: underline;
        font-size: 1.4rem;
        line-height: 2rem;
        font-weight: 400;
        letter-spacing: .2px;
        display: inline-flex;
        align-items: center;
        flex-shrink: 0;
        white-space: nowrap;
    }

    .alert-close .icon-svg {
        margin-right: 4px;
        width: 1.6rem;
        height: 1.6rem;
        fill: currentColor;
    }
`;
