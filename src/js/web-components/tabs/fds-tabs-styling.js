export const styles = (breakpoint) => `
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    :host {
        display: block;
    }

    div[role="tablist"] {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        width: var(--tabs-tablist-width);
        gap: 8px;
        margin-bottom: 8px;
    }

    @media (min-width: ${breakpoint}) {
        div[role="tablist"] {
            gap: 16px;
            margin-bottom: 16px;
        }
    }
`;