import {expect, test} from "../fixtures/table-page";
import {
    ALL_DEPARTMENTS, ALL_STATUS,
    DEPARTMENTS,
    EMPLOYEE_ROWS,
    EMPLOYEES_COLUMNS,
    ROWS_PER_PAGE,
    SEARCH_VALUE,
    STATUS
} from "../pages/data/testData";
import {capitalizeFirstLetter} from "../utils/helper";
import {getSortedValues} from "../utils/sorting/getSortedValues";


test.describe('Table validation', () => {
    test('Assert table has correct number of rows', async ({employeeTable}) => {
        const totalEmployees = await employeeTable.getTotalEmployees();
        for (const rowsPerPage of ROWS_PER_PAGE.values) {

            await employeeTable.clickRowsPerPage(rowsPerPage);
            const rowCount = await employeeTable.rowCount();

            expect(rowCount).toEqual(Math.min(rowsPerPage, totalEmployees));

        }
    });

    test('Test column sorting (asc/desc)', async ({employeeTable}) => {
        await employeeTable.clickRowsPerPage(ROWS_PER_PAGE.TWENTY_FIVE);
        let rows;
        for (const [key, column] of Object.entries(employeeTable.columns)) {
            for (const direction of ['asc', 'desc']) {
                await test.step(`Sort column: ${key}`, async () => {
                    await employeeTable.sortBy(key);
                    rows = await employeeTable.getRows();

                    const { actual, expected } = await getSortedValues(rows, key, column.type, direction);

                    expect(
                        actual,
                        `'${capitalizeFirstLetter(key)}' column should be sorted in ${direction} order`
                    ).toEqual(expected);
                });
            }
        }
    });

    test('Verify search filtering works)', async ({employeeTable}) => {
        const initial = await employeeTable.getRows();

        for (const value of SEARCH_VALUE) {
            await employeeTable.searchInput.fill(value);
            const filteredRows = await employeeTable.getRows();

            expect(filteredRows.length).toBeLessThan(initial.length);

            for (const row of filteredRows) {
                const matches = [row.first, row.last, row.email]
                    .some(field =>
                        field.toLowerCase().includes(value.toLowerCase())
                    );

                expect(
                    matches,
                    `Search validation failed. Expected value: ${SEARCH_VALUE}, row: ${JSON.stringify(row)}`
                ).toBeTruthy();
            }

            await employeeTable.clearSearch();
            const reset = await employeeTable.getRows();

            expect(
                reset.length,
                `Clear search failed: expected ${initial.length} rows, but got ${reset.length}. Reset rows: ${JSON.stringify(reset)}`
            ).toBe(initial.length);
        }
    });
});

test.describe('Test pagination navigation', () => {
    test('Verify Item Counts: pagination row count matches items per page', async ({ employeeTable }) => {

        const totalEmployees = await employeeTable.getTotalEmployees();

        for (const rowsPerPage of ROWS_PER_PAGE.values) {

            await employeeTable.clickRowsPerPage(rowsPerPage);

            let currentPage = 1;

            while (true) {
                const rowCount = await employeeTable.rowCount();

                const remainingEmployees = totalEmployees - rowsPerPage * (currentPage - 1);
                const expectedCount = Math.min(rowsPerPage, remainingEmployees);

                expect(
                    rowCount,
                    `Pagination mismatch:
                    Rows per page: ${rowsPerPage}
                    Page: ${currentPage}
                    Expected rows: ${expectedCount}
                    Actual rows: ${rowCount}`
                    ).toEqual(expectedCount);

                const hasNextPage  = await employeeTable.paginateNextButton.isEnabled();
                if (!hasNextPage ) break;

                await employeeTable.clickPaginationNextButton();
                currentPage++;
            }
        }
    });

    test('Verify default first page loads correctly and pagination function is correct', async ({employeeTable}) => {
        const rowCount = await employeeTable.rowCount();

        const dropdown = await employeeTable.rowsPerPage;
        await expect(dropdown).toHaveValue(ROWS_PER_PAGE.FIVE.toString());
        expect(rowCount).toEqual(ROWS_PER_PAGE.FIVE);

        await expect(await employeeTable.paginateFirstButton).toBeDisabled();
        await expect(await employeeTable.paginatePrevButton).toBeDisabled();
        await expect(await employeeTable.paginationInfo).toContainText('Page 1 of 3');

        await expect(await employeeTable.paginateNextButton).toBeEnabled();
        await expect(await employeeTable.paginateLastButton).toBeEnabled();

        await employeeTable.clickPaginationNextButton();
        await expect(await employeeTable.paginationInfo).toContainText('Page 2 of 3');
        await expect(await employeeTable.paginatePrevButton).toBeEnabled();
        await expect(await employeeTable.paginateFirstButton).toBeEnabled();

        await employeeTable.clickPaginationPrevButton();
        await expect(await employeeTable.paginationInfo).toContainText('Page 1 of 3');

        await employeeTable.clickPaginationLastButton();
        await expect(await employeeTable.paginateNextButton).toBeDisabled();
        await expect(await employeeTable.paginateLastButton).toBeDisabled();
        await expect(await employeeTable.paginationInfo).toContainText('Page 3 of 3');
    });

    test('Single Page: Verify that pagination controls are hidden if all items fit on one page.', async ({employeeTable}) => {
        await employeeTable.clickRowsPerPage(ROWS_PER_PAGE.TWENTY_FIVE);

        await expect(await employeeTable.paginationInfo).toContainText('Page 1 of 1');
        await expect(await employeeTable.paginateFirstButton).toBeDisabled();
        await expect(await employeeTable.paginatePrevButton).toBeDisabled();
        await expect(await employeeTable.paginateNextButton).toBeDisabled();
        await expect(await employeeTable.paginateLastButton).toBeDisabled();
    });

    test('Verify pagination keeps consistent data', async ({employeeTable}) => {
        const rows = await employeeTable.rowsLocator();
        const firstPageData = await rows.allTextContents();

        await employeeTable.clickPaginationLastButton();
        const lastPageData = await rows.allTextContents();
        expect(lastPageData).not.toEqual(firstPageData);

        await employeeTable.clickPaginationFirstButton();
        const firstPageDataAgain = await rows.allTextContents();
        expect(firstPageDataAgain).toEqual(firstPageData);
    });

    test('Verify disabled next page shows not-allowed cursor', async ({employeeTable}) => {
        await employeeTable.clickRowsPerPage(ROWS_PER_PAGE.TWENTY_FIVE);

        const nextPageButton = employeeTable.paginateNextButton;
        await nextPageButton.hover();
        const cursor = await nextPageButton.evaluate((el) => {
            return window.getComputedStyle(el).cursor;
        });

        expect(cursor).toBe('not-allowed');
    });
});

test.describe('Assert cell values by row/column', () => {
    test('Verify column headers', async ({employeeTable}) => {
        const expectedHeaders = Object.values(EMPLOYEES_COLUMNS)
            .map(column => column.label);

        await expect(employeeTable.getHeaders())
            .toHaveText(expectedHeaders);

        for (const header of expectedHeaders) {
            await expect(employeeTable.getHeader(header))
                .toBeVisible();
        }
    });

    test('Verify cell values by row/column', async ({employeeTable}) => {
        const rows = await employeeTable.getRows();

        for (const [, columnData] of Object.entries(EMPLOYEES_COLUMNS)) {
            const header = columnData.label;
            for (let i = 0; i < rows.length; i++) {
                const actual = await employeeTable.getCell(i, header);
                const columnKey = Object.entries(EMPLOYEES_COLUMNS)
                    .find(([, v]) => v.label === header)?.[0];

                const expected = EMPLOYEE_ROWS[i][columnKey];

                expect(actual).toBe(expected);

            }
        }
    });
});

test('Verify each STATUS badge has correct color', async ({ employeeTable }) => {
    await employeeTable.clickRowsPerPage(ROWS_PER_PAGE.TWENTY_FIVE);

    const rows = await employeeTable.getRows();
    for (let i = 0; i < rows.length; i++) {

        const status = await employeeTable.getCell(i, EMPLOYEES_COLUMNS.status.label);
        const badgeColor = await employeeTable.getCellStyle(i, EMPLOYEES_COLUMNS.status.label, 'color');

        const color = Object.values(STATUS).find(
            item => item.label === status
        )?.color;


        expect(badgeColor).toBe(color);
    }
});

test.describe('Test dropdown filters', () => {
    test('Verify employees are filtered by selected department', async ({ employeeTable }) => {
        const departmentList = Object.values(DEPARTMENTS);

        for (const selectedDepartment  of departmentList) {
            await employeeTable.selectDepartment(selectedDepartment );
            const rows = await employeeTable.getRows();

            for (let i = 0; i < rows.length; i++) {
                const department = await employeeTable.getCell(i, EMPLOYEES_COLUMNS.dept.label);
                expect(department).toBe(selectedDepartment);
            }
        }
        await employeeTable.selectDepartment(ALL_DEPARTMENTS);
        await expect.poll(async () => {
            return await employeeTable.rowCount();
        }).toBe(ROWS_PER_PAGE.FIVE);
    });

    test('Verify employees are filtered by selected status', async ({ employeeTable }) => {
        const statusList = Object.values(STATUS).map(status => status.label);

        for (const selectedStatus of statusList) {
            await employeeTable.selectStatus(selectedStatus);
            const rows = await employeeTable.getRows();

            for (let i = 0; i < rows.length; i++) {
                const status = await employeeTable.getCell(
                    i,
                    EMPLOYEES_COLUMNS.status.label
                );
                expect(status).toBe(selectedStatus);
            }
        }
        await employeeTable.selectStatus(ALL_STATUS);
        await expect.poll(async () => {
            return await employeeTable.rowCount();
        }).toBe(ROWS_PER_PAGE.FIVE);
    });
});




