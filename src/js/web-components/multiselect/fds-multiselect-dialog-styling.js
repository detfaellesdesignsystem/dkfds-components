export const styles = `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-width: 32rem;
        max-height: min(440px, 100vh);
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 10;
        background-color: var(--color-white);
        border: 1px solid #8E8E8E;
        border-radius: 8px;
        margin-top: 4px;
        padding-top: 7px;
        padding-bottom: 7px;
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, .2);
    }

    :host([hidden]) {
        display: none;
    }
`;