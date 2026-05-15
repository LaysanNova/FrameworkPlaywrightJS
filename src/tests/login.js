import {expect, test} from "../fixtures/page-setup";

test('User should be able to log in successfully', async ({ loginPage }) => {
    await loginPage.fillUsernameInput(process.env.USER_NAME);
    await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
    const newPage = await loginPage.clickLoginBtn();

    await expect(newPage.getMenu().userElement).toBeVisible();
    await expect(newPage.getMenu().userElement).toHaveText(process.env.USER_NAME);
});
