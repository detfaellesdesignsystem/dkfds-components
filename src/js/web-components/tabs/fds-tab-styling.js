export const styles = (breakpoint) => `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: inline-flex;
        color: #1a1a1a;
        background-color: #F5F5F5;
        max-width: 100%;
        align-items: center;
        text-align: center;
        border: 0;
        text-decoration: underline;
        overflow-wrap: anywhere;
        cursor: pointer;

        border-radius: 20px;
        min-height: 40px;
        padding: 1px 16px;
    }

    :host(:focus) {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    :host([aria-selected=true]) {
        color: white;
        font-weight: 700;
        text-decoration: none;
        background-color: #454545;
    }

    :host(:not([aria-selected=true]):hover) {
        background-color: #DCDCDC;
    }

    @media (min-width: ${breakpoint}) {
        :host {
            border-radius: 24px;
            min-height: 48px;
            padding: 1px 24px;
        }
    }

    ::slotted(.icon-svg) {
        margin-right: 8px;
        flex-shrink: 0;
    }
`;