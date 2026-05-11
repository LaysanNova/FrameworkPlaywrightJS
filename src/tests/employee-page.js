import {expect, test} from "../fixtures/table-page";
import {ROWS_PER_PAGE, SEARCH_VALUE} from "../pages/data/testData";
import {capitalizeFirstLetter, getLast} from "../utils/helper";
import {getSortedValues} from "../utils/sorting/getSortedValues";


test.describe('Table validation', () => {
    test('Assert table has correct number of rows', async ({employeeTable}) => {
        const rowsPerPageOptions = ROWS_PER_PAGE.values;

        for (const rowsPerPage of rowsPerPageOptions) {

            await employeeTable.clickRowsPerPage(rowsPerPage);

            const rowCount = await employeeTable.rowCount();
            const isLast = rowsPerPage === getLast(rowsPerPageOptions);
            await expect(rowCount)[isLast ? 'toBeLessThanOrEqual' : 'toBe'](rowsPerPage);
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

        await employeeTable.searchPlaceholder.fill(SEARCH_VALUE);
        const filteredRows = await employeeTable.getRows();

        expect(filteredRows.length).toBeLessThan(initial.length);

        for (const row of filteredRows) {
            const matches = [row.first, row.last, row.email]
                .some(field =>
                    field.toLowerCase().includes(SEARCH_VALUE.toLowerCase())
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
    });
});


