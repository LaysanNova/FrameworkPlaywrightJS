import { step } from "allure-js-commons";
import NewPage from "./new.page";

export default class LoginPage {
    constructor(page) {
        this.page = page;

        this.loginLink = this.page.getByRole('link', { name: 'login' })

        this.loginForm = this.page.locator('form')
            .filter({ hasText: 'username:password: login' });
        this.usernameInput = this.loginForm.locator('input[name="acct"]');
        this.passwordInput = this.loginForm.locator('input[name="pw"]');
        this.loginBtn = this.page.getByRole('button', {name: 'Login'});
    }


    async fillUsernameInput(name){
        await step("Fill username", async () => {
            await this.usernameInput.fill(name);
        });
    }

    async fillPasswordInput(password) {
        await step("Fill password", async () => {
            await this.passwordInput.fill(password);
        });

    }

    async clickLoginBtn() {
        await step("Click login button", async () => {
            await this.loginBtn.click();
        });
        
        return new NewPage(this.page);
    }

    async clickLoginLink() {
        await this.loginLink.click();
    }
}