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

    button,
    select {
        text-transform: none;
        appearance: none;
        font-family: inherit;
        font-size: 100%;
        line-height: 1.5;
        margin: 0;
        color: #1a1a1a;
    }

    button:focus,
    input:focus,
    select:focus {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    :host {
        display: block;
        border: 1px solid #8E8E8E;
        background-color: white;
        max-width: calc(7 * 40px + 8 * 0.4rem + 2px);
        border-radius: 8px;
        overflow: auto;
    }

    .grid-container {
        width: fit-content;
    }

    .grid-container:focus {
        outline: 0;
    }

    .date-picker-header {
        display: flex;
        justify-content: space-between;
        background-color: #F5F5F5;
        padding-top: 4px;
        padding-bottom: 4px;
        min-width: 220px;
        position: relative;
        z-index: 3;
    }

    .month-year-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }

    .month-wrapper,
    .year-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        margin-left: 4px;
        margin-right: 4px;
    }

    .select-arrow {
        position: absolute;
        width: 24px;
        right: 0;
        pointer-events: none;
    }

    .selected-month,
    .selected-year {
        border: 0;
        background-color: #F5F5F5;
        border-radius: 8px;
        background-position: 100%;
        background-size: 2.4rem;
        padding-right: 24px;
        padding-left: 8px;
        font-weight: 600;
        height: calc(1.6rem + 24px);
        cursor: pointer;
    }

    .selected-month:hover,
    .selected-year:hover {
        background-color: #DCDCDC;
    }

    .selected-month:active,
    .selected-year:active {
        background-color: #BFBFBF;
    }

    .selected-month:focus,
    .selected-year:focus {
        outline-offset: -3px;
    }

    .selected-month option,
    .selected-year option {
        background-color: #ffffff;
    }

    .previous-month,
    .next-month {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1.5;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        margin: 0;
        overflow-wrap: break-word;
        max-width: 100%;
        font-weight: inherit;
        font-size: 1.6rem;
        min-height: 32px;
        padding: 2px;
        border-width: 2px;
        border-style: solid;
        text-decoration: none;
        border-color: transparent;
        color: #1a1a1a;
        background-color: transparent;
        width: 40px;
        height: 40px;
        border-radius: 20px;
    }

    .previous-month {
        margin-left: 4px;
    }

    .next-month {
        margin-right: 4px;
    }

    .previous-month:hover,
    .next-month:hover {
        border-color: #DCDCDC;
        color: #1a1a1a;
        background-color: #DCDCDC;
    }

    .previous-month:active,
    .next-month:active {
        border-color: #BFBFBF;
        color: #1a1a1a;
        background-color: #BFBFBF;
    }

    .previous-month:disabled,
    .next-month:disabled {
        opacity: 0.25;
        cursor: not-allowed;
        box-shadow: none !important;
        border-color: transparent;
        color: #1a1a1a;
        background-color: transparent;
    }

    .previous-month svg,
    .next-month svg {
        margin: 0;
        fill: currentColor;
        width: 2.4rem;
        pointer-events: none;
    }

    table {
        border-collapse: separate;
        border-spacing: 0.4rem;
        min-width: 220px;
    }

    thead th {
        position: relative;
        font-size: 1.4rem;
        font-weight: 400;
        height: 40px;
    }

    thead th span[aria-hidden="true"] {
        position: relative;
        z-index: 1;
        top: -4px;
    }

    thead th::before {
        content: '';
        position: absolute;
        z-index: 1;
        background-color: #F5F5F5;
        display: block;
        left: calc(0rem - 0.4rem);
        top: calc(0rem - 0.4rem - 4px);
        width: calc(100% + 2 * 0.4rem);
        height: calc(100% + 2 * 0.4rem);
        border-bottom: 1px solid #DCDCDC;
    }

    td {
        height: 40px;
        width: 40px;
        max-width: 40px;
        text-align: center;
        border-radius: 20px;
    }

    td[data-date]:focus {
        outline: 3px solid #454545;
        outline-offset: 1px;
    }

    td:not([data-date]):focus {
        outline: none;
    }

    td[aria-selected] {
        cursor: pointer;
    }

    td[aria-selected]:hover {
        background-color: #F5F5F5;
        text-decoration: underline;
    }

    td[aria-selected]:active {
        background-color: #DCDCDC;
        text-decoration: underline;
    }

    td[aria-selected="true"],
    td[aria-selected="true"]:hover,
    td[aria-selected="true"]:active {
        background-color: #1a1a1a;
        color: #ffffff;
        text-decoration: none;
    }

    td[aria-disabled="true"] {
        opacity: 0.25;
    }

    td[aria-disabled="true"]:focus {
        outline: none;
    }

    td[aria-current="date"] {
        font-weight: 700;
        text-decoration: underline;
    }

    td[aria-current="date"][aria-selected="true"]:hover,
    td[aria-current="date"][aria-selected="true"]:active {
        text-decoration: underline;
    }
`;