import LoginPage from "../pages/login.page";

export async function loginUser(page) {
    const loginPage = new LoginPage(page);
    await loginPage.fillUsernameInput(process.env.USER_NAME);
    await loginPage.fillPasswordInput(process.env.USER_PASSWORD);
    await loginPage.clickLoginBtn();
}
