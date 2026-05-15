import {EMPLOYEES_COLUMNS} from "./data/testData";

export default class EmployeePage {
    #page;
    #table;
    #rows;
    #columns;
    constructor(page) {
        this.#page = page;
        this.#table = this.#page.locator("#employees-table");
        this.#rows = this.#table.locator('tbody tr');
        this.#columns = EMPLOYEES_COLUMNS;

        this.rowsPerPage = this.#page.getByTestId('rows-per-page');
        this.searchInput = this.#page.getByRole('textbox', { name: 'Search by name, email...' });

    }

    get columns() {
        return this.#columns;
    }

    get paginateFirstButton() {
        return this.#page.getByTestId('pagination-first');
    }
    get paginatePrevButton() {
        return this.#page.getByTestId('pagination-prev');
    }

    get paginateNextButton() {
        return this.#page.getByTestId('pagination-next');
    }

    get paginateLastButton() {
        return this.#page.getByTestId('pagination-last');
    }

    get paginationInfo() {
        return this.#page.getByTestId('pagination-info');
    }

    getHeaders() {
        return this.#table.getByRole('columnheader');
    }

    getHeader(headerName) {
        return this.#table.getByRole('columnheader', {
            name: headerName,
            exact: true,
        });
    }

    async clickRowsPerPage(option) {
        await this.rowsPerPage.selectOption(String(option));
    }

    rowCount() {
        return this.#rows.count();
    }

    async #clickHeader(headerName) {
        await this.#table
            .getByRole('columnheader', { name: headerName })
            .click();
    }

    // async getRowData(rowIndex: number) {
    //     const row = this.rows.nth(rowIndex);
    //
    //     return {
    //         first: await row.locator('.rt-td').nth(0).textContent(),
    //         last: await row.locator('.rt-td').nth(1).textContent(),
    //         age: await row.locator('.rt-td').nth(3).textContent(),
    //     };
    // }

    async sortBy(columnKey) {
        const header = this.#columns[columnKey].label;
        if (!header) throw new Error(`Unknown column: ${columnKey}`);

        await this.#clickHeader(header);
    }

    async getRows() {
        const rows = this.#rows;
        const count = await rows.count();

        const keys = Object.keys(this.#columns);
        const data = [];


        for (let i = 0; i < count; i++) {
            const row = rows.nth(i);

            const cells = await row
                .locator('td')
                .allTextContents();

            data.push(
                Object.fromEntries(
                    keys.map((key, index) => [key, cells[index]])
                )
            );
        }

        return data;
    }

    rowsLocator() {
        return this.#rows;
    }

    async searchFor(value){
        await this.searchInput.fill(value);
    }

    async clearSearch(){
        await this.searchFor("");
    }

    async clickPaginationFirstButton(){
        await this.paginateFirstButton.click();
    }

    async clickPaginationPrevButton(){
        await this.paginatePrevButton.click();
    }

    async clickPaginationNextButton(){
        await this.paginateNextButton.click();
    }

    async clickPaginationLastButton(){
        await this.paginateLastButton.click();
    }

    async getTotalEmployees(){
        return await this.#page
            .getByText('Total Employees')
            .locator('xpath=following-sibling::div[1]')
            .textContent();
    }
}
