import { test, expect } from '../fixtures/page-setup';
import { PAST_PAGE_TITLE } from '../pages/data/testData';

test.describe('Past News Page validation', () => {
  test('Past page title validation', async ({pastPage}) => {
    await expect(pastPage.page).toHaveTitle(PAST_PAGE_TITLE);
  });
});
