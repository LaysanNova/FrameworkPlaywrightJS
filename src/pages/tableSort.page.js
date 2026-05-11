export default class TableSortPage {
    #table;
    #columns;
    #rows;
    constructor(page) {
        this.page = page;
        this.#table = page.locator('#sort');
        this.#columns = {
            name: {
                label: 'Name',
                type: 'text',
            },
            birthday: {
                label: 'Birthday',
                type: 'date',
            },
            groceryItem: {
                label: 'Grocery item',
                type: 'text',
            },
            price: {
                label: 'Price',
                type: 'currency',
            },
            version: {
                label: 'Version',
                type: 'version',
            },
            filesize: {
                label: 'Filesize',
                type: 'filesize',
            },
        };

        this.#rows = this.#table.locator('tbody tr');
    }

    async #clickHeader(headerName) {
        await this.#table
            .getByRole('columnheader', { name: headerName })
            .click();
    }

    async sortBy(columnKey) {
        const header = this.#columns[columnKey].label;
        if (!header) throw new Error(`Unknown column: ${columnKey}`);

        await this.#clickHeader(header);
    }

    async #getColumnIndex(columnKey) {
        const headers = this.#table.locator('thead th');
        const texts = await headers.allTextContents();
        return texts.findIndex(t => t.trim() === this.#columns[columnKey]);
    }

    async getRows() {
        const rows = this.#rows;
        const count = await rows.count();

        const data = [];

        for (let i = 0; i < count; i++) {
            const cells = await this.#rows.nth(i).locator('td').allTextContents();

            data.push({
                id: cells[0],
                name: cells[1],
                birthday: cells[2],
                groceryItem: cells[3],
                price: cells[4],
                version: cells[5],
                filesize: cells[6],
            });
        }
        return data;
    }

    async getCell(rowIndex, columnName) {
        const colIndex = await this.#getColumnIndex(columnName);
        const rows = await this.#rows;

        return await rows.nth(rowIndex).locator("td").nth(colIndex).textContent();
    }

    get columns() {
        return this.#columns;
    }
}