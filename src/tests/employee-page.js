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
import {getSortedValues} from "../utils/sorting/getSortedValues";
import {step} from "allure-js-commons";


test.describe('Table validation', () => {
    test('Assert table has correct number of rows', async ({employeeTable}) => {
        const totalEmployees = await employeeTable.getTotalEmployees();
        for (const rowsPerPage of ROWS_PER_PAGE.values) {

            await employeeTable.clickRowsPerPage(rowsPerPage);

            await step(`Verify table has ${ rowsPerPage } rows.`, async () => {
                const rowCount = await employeeTable.rowCount();

                expect(rowCount).toEqual(Math.min(rowsPerPage, totalEmployees));
            });
        }
    });

    test('Test column sorting (asc/desc)', async ({employeeTable}) => {
        await employeeTable.clickRowsPerPage(ROWS_PER_PAGE.TWENTY_FIVE);
        let rows;
        for (const [key, column] of Object.entries(employeeTable.columns)) {
            for (const direction of ['asc', 'desc']) {
                await employeeTable.sortBy(key);

                await step(`'${key.toUpperCase()}' column should be sorted in ${direction} order`, async () => {
                    rows = await employeeTable.getRows();
                    const {actual, expected} = await getSortedValues(rows, key, column.type, direction);
                    expect(actual).toEqual(expected);
                });
            }
        }
    });

    test('Verify search filtering works)', async ({employeeTable}) => {
        let initial;

        await step(`Get rows before filtering.`, async () => {
            initial = await employeeTable.getRows();
        });

        for (const value of SEARCH_VALUE) {
            await employeeTable.fillSearchInput(value);

            await step(`Verify table is not empty and every row has value '${ value }.`, async () => {
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
            });
        }
        await employeeTable.clearSearch();

        await step(`Verify table is not filtered after reset.`, async () => {
            const reset = await employeeTable.getRows();

            expect(
                reset.length,
                `Clear search failed: expected ${initial.length} rows, but got ${reset.length}. Reset rows: ${JSON.stringify(reset)}`
            ).toBe(initial.length);
        });
    });
});

test.describe('Test pagination navigation', () => {
    test('Verify Item Counts: pagination row count matches items per page', async ({ employeeTable }) => {

        const totalEmployees = await employeeTable.getTotalEmployees();

        for (const rowsPerPage of ROWS_PER_PAGE.values) {

            await employeeTable.clickRowsPerPage(rowsPerPage);

            await step(`Verify pagination for ${rowsPerPage} rows`, async () => {

                let currentPage = 1;

                while (true) {
                    const rowCount = await employeeTable.rowCount();

                    const remainingEmployees = totalEmployees - rowsPerPage * (currentPage - 1);
                    const expectedCount = Math.min(rowsPerPage, remainingEmployees);

                    expect(rowCount).toEqual(expectedCount);

                    const hasNextPage  = await employeeTable.paginateNextButton.isEnabled();
                    if (!hasNextPage ) break;

                    await employeeTable.clickPaginationNextButton();
                    currentPage++;
                }
            });
        }
    });

    test('Verify default first page loads correctly and pagination function is correct', async ({employeeTable}) => {

        await test.step('Verify default pagination state', async () => {
            const rowCount = await employeeTable.rowCount();

            await expect(await employeeTable.rowsPerPage).toHaveValue(ROWS_PER_PAGE.FIVE.toString());
            expect(rowCount).toEqual(ROWS_PER_PAGE.FIVE);

            await expect(await employeeTable.paginateFirstButton).toBeDisabled();
            await expect(await employeeTable.paginatePrevButton).toBeDisabled();
            await expect(await employeeTable.paginationInfo).toContainText('Page 1 of 3');

            await expect(await employeeTable.paginateNextButton).toBeEnabled();
            await expect(await employeeTable.paginateLastButton).toBeEnabled();
        });

        await test.step('Navigate to second page', async () => {
            await employeeTable.clickPaginationNextButton();
            await expect(await employeeTable.paginationInfo).toContainText('Page 2 of 3');
            await expect(await employeeTable.paginatePrevButton).toBeEnabled();
            await expect(await employeeTable.paginateFirstButton).toBeEnabled();
        });

        await test.step('Navigate back to first page', async () => {
            await employeeTable.clickPaginationPrevButton();
            await expect(await employeeTable.paginationInfo).toContainText('Page 1 of 3');
        });

        await test.step('Navigate to last page', async () => {
            await employeeTable.clickPaginationLastButton();
            await expect(await employeeTable.paginateNextButton).toBeDisabled();
            await expect(await employeeTable.paginateLastButton).toBeDisabled();
            await expect(await employeeTable.paginationInfo).toContainText('Page 3 of 3');
        });
    });

    test('Single Page: Verify that pagination controls are hidden if all items fit on one page.', async ({employeeTable}) => {
        await employeeTable.clickRowsPerPage(ROWS_PER_PAGE.TWENTY_FIVE);

        await test.step('Verify single page pagination state', async () => {
            await expect(await employeeTable.paginationInfo).toContainText('Page 1 of 1');
            await expect(await employeeTable.paginateFirstButton).toBeDisabled();
            await expect(await employeeTable.paginatePrevButton).toBeDisabled();
            await expect(await employeeTable.paginateNextButton).toBeDisabled();
            await expect(await employeeTable.paginateLastButton).toBeDisabled();
        });
    });

    test('Verify pagination keeps consistent data', async ({employeeTable}) => {
        let firstPageData;
        let lastPageData;
        let firstPageDataAgain;

        await test.step('Capture data from the first page', async () => {
            const rows = await employeeTable.rowsLocator();
            firstPageData = await rows.allTextContents();
        });

        await test.step('Navigate to the last page and verify data is different', async () => {
            await employeeTable.clickPaginationLastButton();
            const rows = await employeeTable.rowsLocator();
            lastPageData = await rows.allTextContents();
            expect(lastPageData).not.toEqual(firstPageData);
        });

        await test.step('Return to the first page and verify data consistency', async () => {
            await employeeTable.clickPaginationFirstButton();

            const rows = await employeeTable.rowsLocator();
            firstPageDataAgain = await rows.allTextContents();

            expect(firstPageDataAgain).toEqual(firstPageData);
        });
    });

    test('Verify disabled next page shows not-allowed cursor', async ({employeeTable}) => {
        await employeeTable.clickRowsPerPage(ROWS_PER_PAGE.TWENTY_FIVE);

        await test.step('Verify next button has not-allowed cursor when disabled', async () => {
            const nextPageButton = employeeTable.paginateNextButton;
            await nextPageButton.hover();
            const cursor = await nextPageButton.evaluate((el) => {
                return window.getComputedStyle(el).cursor;
            });

            expect(cursor).toBe('not-allowed');
        });
    });
});

test.describe('Assert cell values by row/column', () => {
    test('Verify column headers', async ({employeeTable}) => {
        const expectedHeaders = Object.values(EMPLOYEES_COLUMNS)
            .map(column => column.label);

        await test.step(`Verify headers are ${ expectedHeaders }`, async () => {
            await expect(employeeTable.getHeaders())
                .toHaveText(expectedHeaders);
        });

        await test.step(`Verify all column headers are visible`, async () => {
            for (const header of expectedHeaders) {
                await expect(employeeTable.getHeader(header))
                    .toBeVisible();
            }
        });
    });

    test('Verify cell values by row/column', async ({employeeTable}) => {
        let rows;

        await test.step(`Read data in table.`, async () => {
            rows = await employeeTable.getRows();
        });

        for (const [, columnData] of Object.entries(EMPLOYEES_COLUMNS)) {
            const header = columnData.label;
            for (let i = 0; i < rows.length; i++) {
                const columnKey = Object.entries(EMPLOYEES_COLUMNS)
                    .find(([, v]) => v.label === header)?.[0];

                const expected = EMPLOYEE_ROWS[i][columnKey];

                await test.step(`Verify cell row: '${ i + 1 }' in '${ columnKey }' column has value ${ expected }`, async () => {
                    const actual = await employeeTable.getCell(i, header);
                    expect(actual).toBe(expected);
                });
            }
        }
    });
});

test('Verify each STATUS badge has correct color', async ({ employeeTable }) => {
    await employeeTable.clickRowsPerPage(ROWS_PER_PAGE.TWENTY_FIVE);
    await test.step('Verify status badge colors per row', async () => {
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
});

test.describe('Test dropdown filters', () => {
    test('Verify employees are filtered by selected department', async ({ employeeTable }) => {
        const departmentList = Object.values(DEPARTMENTS);

        for (const selectedDepartment  of departmentList) {
            await employeeTable.selectDepartment(selectedDepartment );

            await test.step(`Verify all rows belong to department: ${selectedDepartment}`, async () => {
                const rows = await employeeTable.getRows();

                for (let i = 0; i < rows.length; i++) {
                    const department = await employeeTable.getCell(i, EMPLOYEES_COLUMNS.dept.label);
                    expect(department).toBe(selectedDepartment);
                }
            });
        }
        await employeeTable.selectDepartment(ALL_DEPARTMENTS);

        await test.step('Verify Reset department filter', async () => {
            await expect.poll(async () => {
                return await employeeTable.rowCount();
            }).toBe(ROWS_PER_PAGE.FIVE);
        });
    });

    test('Verify employees are filtered by selected status', async ({ employeeTable }) => {
        const statusList = Object.values(STATUS).map(status => status.label);

        for (const selectedStatus of statusList) {
            await employeeTable.selectStatus(selectedStatus);

            await test.step(`Verify all rows belong to status:: ${selectedStatus}`, async () => {
                const rows = await employeeTable.getRows();

                for (let i = 0; i < rows.length; i++) {
                    const status = await employeeTable.getCell(
                        i,
                        EMPLOYEES_COLUMNS.status.label
                    );
                    expect(status).toBe(selectedStatus);
                }
            });
        }

        await employeeTable.selectStatus(ALL_STATUS);

        await test.step('Verify reset status filter', async () => {
            await expect.poll(async () => {
                return await employeeTable.rowCount();
            }).toBe(ROWS_PER_PAGE.FIVE);
        });
    });

    test('Verify employees are filtered by selected department and status', async ({ employeeTable }) => {

        let rowCountAll;
        await employeeTable.clickRowsPerPage(ROWS_PER_PAGE.TWENTY_FIVE);

        await test.step(`Apply department '${DEPARTMENTS.ENGINEERING}' + status '${STATUS.ACTIVE.label}' filters`, async () => {
            rowCountAll = await employeeTable.rowCount();
            await employeeTable.selectDepartment(DEPARTMENTS.ENGINEERING );
            await employeeTable.selectStatus(STATUS.ACTIVE.label);
        });
        await test.step(
            `Verify rows have department '${DEPARTMENTS.ENGINEERING}' and status '${STATUS.ACTIVE.label}'`,
            async () => {

            const rows = await employeeTable.getRows();
            for (let i = 0; i < rows.length; i++) {
                const department = await employeeTable.getCell(i, EMPLOYEES_COLUMNS.dept.label);
                expect(department).toBe(DEPARTMENTS.ENGINEERING);

                const status = await employeeTable.getCell(i, EMPLOYEES_COLUMNS.status.label);
                expect(status).toBe(STATUS.ACTIVE.label);
            }
        });

        await employeeTable.selectDepartment(ALL_DEPARTMENTS );
        await employeeTable.selectStatus(ALL_STATUS);

        await test.step('Reset filters and verify row count restored', async () => {
            await expect.poll(async () => {
                return await employeeTable.rowCount();
            }).toBe(rowCountAll);
        });
    });
});




