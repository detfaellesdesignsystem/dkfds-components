const select = require('../utils/select');
const domready = require('domready');
const forEach = require('array-foreach');

domready(() => {
	new ResponsiveTables();
});
export default class ResponsiveTables {
    constructor() {
        const allTables = select('table:not(.dataTable)');
        forEach(allTables, table => {
            this.insertHeaderAsAttributes(table);
        });
    }

    // Add data attributes needed for responsive mode.
    insertHeaderAsAttributes(tableEl){
        if (!tableEl) return

        const headerCellEls =  select('thead th, thead td', tableEl);

        //const headerCellEls = select(el.querySelectorAll('thead th, thead td');

        if (headerCellEls.length) {
            const bodyRowEls = select('tbody tr', tableEl);
            Array.from(bodyRowEls).forEach(rowEl => {
                let cellEls = rowEl.children;
                if (cellEls.length === headerCellEls.length) {
                    Array.from(headerCellEls).forEach((headerCellEl, i) => {
                        // Grab header cell text and use it body cell data title.
                        cellEls[i].setAttribute('data-title', headerCellEl.textContent)
                    })
                }
            })
        }
    }
}
