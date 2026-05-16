import { test as base } from '@playwright/test';
import MenuComponent from "../pages/components/menu.component";
import LoginPage from "../pages/login.page";


export const test = base.extend({
    loginPage: async ({ page }, use) => {
        const menu = new MenuComponent(page);
        await page.goto('/');
        await menu.goToLogin();
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
});

export const expect = test.expect;