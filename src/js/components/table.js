const select = require('../utils/select');

class ResponsiveTables {
    constructor(table) {
        this.insertHeaderAsAttributes(table);
    }

    // Add data attributes needed for responsive mode.
    insertHeaderAsAttributes(tableEl){
        if (!tableEl) return

        let headerCellEls =  tableEl.getElementsByTagName('thead')[0].getElementsByTagName('th');
        if(headerCellEls.length == 0) {
          headerCellEls = tableEl.getElementsByTagName('thead')[0].getElementsByTagName('td');
        }

        if (headerCellEls.length) {
            const bodyRowEls = select('tbody tr', tableEl);
            Array.from(bodyRowEls).forEach(rowEl => {
                let cellEls = rowEl.children
                if (cellEls.length === headerCellEls.length) {
                    Array.from(headerCellEls).forEach((headerCellEl, i) => {
                        // Grab header cell text and use it body cell data title.
                        cellEls[i].setAttribute('data-title', headerCellEl.textContent)
                    });
                }
            });
        }
    }
}


module.exports = ResponsiveTables;
