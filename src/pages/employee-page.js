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
        this.searchPlaceholder = this.#page.getByRole('textbox', { name: 'Search by name, email...' });
    }

    get columns() {
        return this.#columns;
    }

    get paginateFirst() {
        return this.#page.getByTestId('pagination-first');
    }
    get paginatePrev() {
        return this.#page.getByTestId('pagination-prev');
    }

    get paginateNext() {
        return this.#page.getByTestId('pagination-next');
    }

    get paginateLast() {
        return this.#page.getByTestId('pagination-last');
    }

    get paginationInfo() {
        return this.#page.getByTestId('pagination-info');
    }

    getHeaders() {
        return this.#table.getByRole('columnheader');
    }
    getHeader(string) {
        return this.getHeaders().filter({ hasText: string });
    }

    async clickRowsPerPage(option) {
        await this.rowsPerPage.selectOption(String(option));
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

    async getTableRows() {
        return this.#rows;
    }

    async searchFor(value){
        await this.searchPlaceholder.fill(value);
    }

    async clearSearch(){
        await this.searchFor("");
    }

    async clickPaginationFirst(){
        await this.paginateFirst.click();
    }

    async clickPaginationPrev(){
        await this.paginatePrev.click();
    }

    async clickPaginationNext(){
        await this.paginateNext.click();
    }

    async clickPaginationLast(){
        await this.paginateLast.click();
    }

    async getTotalEmployees(){
        return await this.#page
            .getByText('Total Employees')
            .locator('xpath=following-sibling::div[1]')
            .textContent();
    }
}
