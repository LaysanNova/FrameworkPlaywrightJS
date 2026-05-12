import {expect, test} from "../fixtures/table-page";
import {ROWS_PER_PAGE, SEARCH_VALUE} from "../pages/data/testData";
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
            await employeeTable.searchPlaceholder.fill(value);
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

                const hasNextPage  = await employeeTable.paginateNext.isEnabled();
                if (!hasNextPage ) break;

                await employeeTable.paginateNext.click();
                currentPage++;
            }
        }
    });


    test('Verify default first page loads correctly and pagination function is correct', async ({employeeTable}) => {
        const rowCount = await employeeTable.rowCount();

        const dropdown = await employeeTable.rowsPerPage;
        await expect(dropdown).toHaveValue(ROWS_PER_PAGE.FIVE.toString());
        expect(rowCount).toEqual(ROWS_PER_PAGE.FIVE);

        await expect(await employeeTable.paginateFirst).toBeDisabled();
        await expect(await employeeTable.paginatePrev).toBeDisabled();
        await expect(await employeeTable.paginationInfo).toContainText('Page 1 of 3');

        await expect(await employeeTable.paginateNext).toBeEnabled();
        await expect(await employeeTable.paginateLast).toBeEnabled();

        await employeeTable.clickPaginationNext();
        await expect(await employeeTable.paginatePrev).toBeEnabled();
        await expect(await employeeTable.paginateFirst).toBeEnabled();


        await employeeTable.clickPaginationLast();
        await expect(await employeeTable.paginateNext).toBeDisabled();
        await expect(await employeeTable.paginateLast).toBeDisabled();
        await expect(await employeeTable.paginationInfo).toContainText('Page 3 of 3');
    });

    test('Verify pagination keeps consistent data', async ({employeeTable}) => {
        const rows = await employeeTable.getTableRows();
        const firstPageData = await rows.allTextContents();

        await employeeTable.clickPaginationLast();
        const lastPageData = await rows.allTextContents();
        expect(lastPageData).not.toEqual(firstPageData);

        await employeeTable.clickPaginationFirst();
        const firstPageDataAgain = await rows.allTextContents();
        expect(firstPageDataAgain).toEqual(firstPageData);
    });

    // test('Click Next → goes to next page', async ({employeeTable}) => {
    //
    // });
    //
    // test('Click Previous → goes back one page', async ({employeeTable}) => {
    //
    // });
    //
    //
    // test('Click First page → goes to page 1 (if exists)', async ({employeeTable}) => {
    //
    // });
    //
    // test('Click Last page → goes to last page (if exists)', async ({employeeTable}) => {
    //     const paginationInfo = extractPaginationInfo(await employeeTable.paginationInfo.textContent());
    //     console.log(`Total pages: ${paginationInfo}`);
    //
    //
    //     await employeeTable.clickPaginationNext();
    //     await expect(await employeeTable.paginateFirst).toBeEnabled();
    // });
});

//Verify Item Counts: Confirm that the number of items displayed on each page matches the expected "items per page" setting.
//Test Navigation Links: Click "Next," "Previous," and specific page numbers to ensure the correct data loads.
//Validate Page State: Ensure the current page number is highlighted or visually distinct (e.g., active class).
//Validate Page State: Ensure the current page number is highlighted or visually distinct (e.g., active class).
//  First/Last Page: Verify that "Previous" is disabled on page 1 and "Next" is disabled on the last page.
//  Zero Items: Verify that no pagination controls are shown when no data is available.
//  Single Page: Verify that pagination controls are hidden if all items fit on one page.
//URL/State Persistence: Confirm that navigating to a specific page updates the URL (e.g., ?page=3) so the page can be bookmarked or shared.


// 1. Basic navigation (core functionality)
// Verify default page loads correctly (usually page 1)
// Click Next → goes to next page
// Click Previous → goes back one page
// Click specific page number → opens correct page
// Click First page → goes to page 1 (if exists)
//     Click Last page → goes to last page (if exists)
//     2. Boundary conditions
// On first page:
//     Previous is disabled / inactive
// On last page:
//     Next is disabled / inactive
// Try clicking Next on last page → no change happens
// Try clicking Previous on first page → no change happens
// 3. Data correctness
// Each page shows correct number of items (e.g. 10 per page)
// No duplicate records between pages
// No missing records across pagination
// Last page shows remaining items correctly (less than page size)
// 4. Page state consistency
// Current page is highlighted correctly
// Page number updates correctly in UI
// URL updates correctly (if pagination is URL-based)
// Refreshing page keeps correct page state (if required)
//     5. Navigation behavior under actions
// Pagination works after sorting
// Pagination works after filtering/search
// Switching filter resets or keeps page correctly (based on requirements)
// Data stays consistent after refresh or re-fetch
// 6. Edge cases
// Only 1 page:
//     pagination controls hidden or disabled
// No data:
//     empty state shown, no pagination displayed
// Very large number of pages:
//     page numbers render correctly (or use ellipsis like “…”)
// API failure:
//     error shown, pagination doesn’t break UI
// 7. UI/UX checks
// Buttons are enabled/disabled correctly
// Loading indicator appears when switching pages (if async)
//     No flickering or UI glitches on page change
// Smooth transition between pages
// 8. Performance (important for QA interviews)
// Page switch is fast and responsive
//     No duplicate API calls on single click
//     No lag when jumping between distant pages
//     9. Accessibility (bonus but strong signal)
//     Buttons are keyboard accessible (Tab, Enter)
//     Screen reader labels exist for pagination controls
//     If you want to sound strong in interview