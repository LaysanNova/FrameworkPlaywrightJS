import logger from "../../utils/logger/logger";

const log = logger.child({ component: "MenuComponent" });

export default class MenuComponent {
  constructor(page) {
    this.page = page;

    this.newLink = this.page.getByRole('link', { name: 'new', exact: true });
    this.pastLink = this.page.getByRole('link', { name: 'past', exact: true });
    this.hnameLink = this.page.locator('.hnname');
    this.loginLink = this.page.getByRole('link', { name: 'login', exact: true });

    this.userElement = this.page.locator('#me');
  }

  async goToNew() {
    log.info("Navigating to 'new' page");

    try {
      await Promise.all([
        this.page.waitForURL('**/newest'),
        this.newLink.click(),
      ]);

      log.info("Successfully navigated to 'new' page");
    } catch (error) {
      log.error({ error: error.message }, "Failed to navigate to 'new'");
      throw error;
    }
  }

  async goToPast() {
    log.info("Navigating to 'past' page");

    try {
      await Promise.all([
        this.page.waitForURL('**/front'),
        this.pastLink.click(),
      ]);

      log.info("Successfully navigated to 'past' page");
    } catch (error) {
      log.error({ error: error.message }, "Failed to navigate to 'past'");
      throw error;
    }
  }

  async goToHackerNews() {
    log.info("Navigating to 'Hacker News'");

    try {
      await Promise.all([
        this.page.waitForURL('**/news'),
        this.hnameLink.click(),
      ]);

      log.info("Successfully navigated to 'Hacker News'");
    } catch (error) {
      log.error({ error: error.message }, "Failed to navigate to 'Hacker News'");
      throw error;
    }
  }

  async goToLogin() {
    try {
      await Promise.all([
        this.page.waitForURL(/\/login/),
        this.loginLink.click(),
      ]);

      log.info("Successfully navigated to 'login'");
    } catch (error) {
      log.error({ error: error.message }, "Failed to navigate to 'login'");
      throw error;
    }
  }

  getUserElements() {
    return this.userElement;
  }
}
