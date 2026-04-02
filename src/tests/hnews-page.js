import { test, expect } from '../fixtures/page-setup';
import {HACKER_NEWS_PAGE_TITLE} from "../pages/data/testData";


test.describe('Hacker News Page validation', () => {
    test('Hacker news page title validation', async ({ hnewsPage }) => {
        await expect(hnewsPage.getPage()).toHaveTitle(HACKER_NEWS_PAGE_TITLE);
    });
});