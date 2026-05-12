import { test, expect } from '../fixtures/page-setup';
import { NEW_PAGE_TITLE, ROWS_100 } from '../pages/data/testData';
import { description, tag, severity, Severity, link, epic, step } from 'allure-js-commons';


test('User should be able to log in successfully', async ({ newPage }) => {
  await expect(newPage.getMenu().userElement).toBeVisible();
  await expect(newPage.getMenu().userElement).toHaveText(process.env.USER_NAME);
});

test.describe('New Page validation', () => {

  test('New page title validation', async ({ newPage }) => {
    await expect(newPage.page).toHaveTitle(NEW_PAGE_TITLE);
  });

  test('Validate that EXACTLY the first 100 articles are sorted from newest to oldest', async ({
    newPage,
  }) => {

    await description('Validate that EXACTLY the first 100 articles are sorted from newest to oldest.');
    await tag('Table sorting');
    await severity(Severity.CRITICAL);
    // await link(`${QASE_LINK}/SIGN-3`, 'Qase: SIGN-3');
    // await link(`${GOOGLE_DOC_LINK}ygd7jqo6djdj`, 'ATC_01_03_01');
    await epic('Newest Articles');

    const table = newPage.getTable();
    const footer = newPage.getFooter();


    let reachedLimit = false;
    let previousTime = null;

    while (!reachedLimit) {
      const rowCount = await table.rowCount();

      for (let i = 0; i < rowCount; i++) {
        const rank = await table.getRank(i);

        if (rank > ROWS_100) {
          reachedLimit = true;
          break;
        }

        const currentTime = await table.getTimestamp(i);

        if (previousTime !== null) {
          expect(currentTime).toBeLessThanOrEqual(previousTime);
        }

        previousTime = currentTime;
      }

      if (!reachedLimit) {
        await footer.loadNextRows(table);
      }
    }
  });
});
