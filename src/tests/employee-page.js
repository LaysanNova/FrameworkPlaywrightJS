import {expect, test} from "../fixtures/table-page";
import {EMPLOYEES_COLUMNS, ROWS_PER_PAGE, SEARCH_VALUE} from "../pages/data/testData";
import {capitalizeFirstLetter, extractPaginationInfo} from "../utils/helper";
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

    test('Verify cell values by row', async ({employeeTable}) => {
        // const rowData = await employeeTable.getRowData(0);
        //
        // expect(rowData).toEqual({
        //     first: 'David',
        //     last: 'Jones',
        //     age: '45',
        // });
    });
});





