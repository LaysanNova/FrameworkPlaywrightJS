export default class EmployeePage {
    #page;
    #table;
    #rows;
    #columns;
    constructor(page) {
        this.#page = page;
        this.#table = this.#page.locator("#employees-table");
        this.#rows = this.#table.locator('tbody tr');
        this.#columns = {
            id: {
                label: 'ID',
                type: 'number',
            },
            first: {
                label: 'First Name',
                type: 'text',
            },
            last: {
                label: 'Last Name',
                type: 'text',
            },
            email: {
                label: 'Email',
                type: 'text',
            },
            age: {
                label: 'Age',
                type: 'number',
            },
            salary: {
                label: 'Salary',
                type: 'currency',
            },
            dept: {
                label: 'Dept',
                type: 'text',
            },
            status: {
                label: 'Status',
                type: 'text',
            },
        };
        this.searchPlaceholder = this.#page.getByRole('textbox', { name: 'Search by name, email...' });

    }

    get columns() {
        return this.#columns;
    }

    async clickRowsPerPage(option) {
        await this.#page.getByTestId('rows-per-page').selectOption(String(option));
        await this.#page.waitForTimeout(300);
    }

    async rowCount() {
        return this.#rows.count();
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

    async getRows() {
        const rows = this.#rows;
        const count = await rows.count();

        const data = [];

        for (let i = 0; i < count; i++) {
            const cells = await this.#rows.nth(i).locator('td').allTextContents();

            data.push({
                id: cells[0],
                first: cells[1],
                last: cells[2],
                email: cells[3],
                age: cells[4],
                salary: cells[5],
                dept: cells[6],
                status: cells[7],
            });
        }
        return data;
    }

    async searchFor(value){
        await this.searchPlaceholder.fill(value);
    }

    async clearSearch(){
        await this.searchFor("");
    }
}

// await this.page.pause();