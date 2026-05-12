import {expect, test} from "../fixtures/table-page";
import {getSortedValues} from "../utils/sorting/getSortedValues";
import {capitalizeFirstLetter} from "../utils/helper";


test.describe('Sorting table', () => {
    test('Sorting table improved in cycle', async ({tableSort}) => {
        let rows;
        for (const [key, column] of Object.entries(tableSort.columns)) {
            for (const direction of ['asc', 'desc']) {
                await test.step(`Sort column: ${key}`, async () => {
                    await tableSort.sortBy(key);
                    rows = await tableSort.getRows();

                    const { actual, expected } = await getSortedValues(rows, key, column.type, direction);

                    expect(
                        actual,
                        `'${capitalizeFirstLetter(key)}' column should be sorted in ${direction} order`
                    ).toEqual(expected);
                });
            }
        }
    });
});