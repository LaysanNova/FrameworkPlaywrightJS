import {EMPLOYEES_COLUMNS} from "./data/testData";
import {step} from "allure-js-commons";
import {test} from "../fixtures/table-page";

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

        this.departmentDropdown = this.#page.getByTestId('department-filter');
        this.statusDropdown = this.#page.getByTestId('status-filter');

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

    async fillSearchInput(text) {
        await step(`Fill 'Search by name, email field' with text '${text}'.`, async () => {
            await this.searchInput.fill(text);
        });
    }

    async clickRowsPerPage(option) {
        await step(`Select option rows per page ${option}`, async () => {
            await this.rowsPerPage.selectOption(String(option));
        });
    }

    rowCount() {
        return this.#rows.count();
    }

    async #clickHeader(headerName) {
        await step(`Click Header ${headerName}`, async () => {
            await this.#table
                .getByRole('columnheader', {name: headerName})
                .click();
        });
    }

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
        await step(`Clear the search field..`, async () => {
            await this.searchFor("");
        });
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

    async #getColumnIndex(columnKey) {
        const headers = this.#table.locator('thead th');
        const texts = await headers.allTextContents();
        const normalize = (columnKey) => columnKey.trim().toLowerCase();

        return texts.findIndex(
            (text) => normalize(text) === normalize(columnKey)
        );
    }

    async getCell(rowIndex, columnName) {
        const colIndex = await this.#getColumnIndex(columnName);

        return (await this.#rows.nth(rowIndex).locator("td").nth(colIndex).textContent()).trim();
    }

    async getCellStyle(rowIndex, columnName, styleProperty) {
        const colIndex = await this.#getColumnIndex(columnName);

        const cell = this.#rows
            .nth(rowIndex)
            .locator('td')
            .nth(colIndex);

        const target = await cell.locator('span').count()
            ? cell.locator('span').first()
            : cell;

        return await target.evaluate(
            (el, property) => getComputedStyle(el)[property],
            styleProperty
        );
    }

    async selectDepartment(department) {
        await test.step(`Filter by department: ${department}`, async () => {
            await this.departmentDropdown.selectOption(department);
        });
    }

    async selectStatus(status) {
        await test.step(`Filter by status: ${status}`, async () => {
        await this.statusDropdown.selectOption(status);
        });
    }
}