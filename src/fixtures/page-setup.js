import { test as base } from '@playwright/test';
import MenuComponent from '../pages/components/menu.component';
import NewPage from '../pages/new.page';
import PastPage from '../pages/past.page';
import HnewsPage from "../pages/hnews.page";
import {loginUser} from "../utils/login-utils";

async function navigateToPage(page, PageClass, menuAction) {
  const menu = new MenuComponent(page);

  await page.goto('/');
  // await menu.goToLogin();
  // await loginUser(page);

  await menuAction(menu);
  return new PageClass(page);
}

export const test = base.extend({
  newPage: async ({ page }, use) => {
    const newPage = await navigateToPage(page, NewPage, (menu) =>
      menu.goToNew(),
    );
    await use(newPage);
  },

  pastPage: async ({ page }, use) => {
    const pastPage = await navigateToPage(page, PastPage, (menu) =>
      menu.goToPast(),
    );
    await use(pastPage);
  },

  hnewsPage: async ({ page }, use) => {
    const hnewsPage = await navigateToPage(page, HnewsPage, (menu) =>
        menu.goToHackerNews(),
    );
    await use(hnewsPage);
  },

  smallTable: async ({ page }, use) => {
    await page.goto(process.env.TRISTEN_TABLE);

    const smallTable = new TablePage(page);
    await use(smallTable);
  },

  assertqa: async ({ page }, use) => {
    await page.goto(process.env.WEB_TABLE);

    const assertqa = new TablePage(page);
    await use(assertqa);
  }
});

export const expect = test.expect;
