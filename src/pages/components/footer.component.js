import { expect } from 'playwright/test';
import logger from "../../utils/logger/logger";
import {step} from "allure-js-commons";


const log = logger.child({ component: "FooterComponent" });

export default class FooterComponent {
  constructor(page) {
    this.page = page;
    this.moreBtn = this.page.getByRole('link', { name: 'More', exact: true });
  }

  async clickMoreBtn() {
    await step('Click "More" Button',  async () => {
      await this.moreBtn.click();
    });
  }

  async loadNextRows(table) {
    await this.moreBtn.waitFor({ state: 'visible' });

    const lastRank = await table.getRank((await table.rowCount()) - 1);

    await this.clickMoreBtn();

    try {
      const nextRank = await table.getRank(0);
      log.info(`${ lastRank }, ${ nextRank }. Validating that new rows are loaded.`);

      expect(nextRank).toBe(lastRank + 1);
    } catch (error) {
      log.error(`${lastRank}. Table did not load new rows after clicking "More".`);

      throw new Error(`Table did not load new rows after clicking "More". Last rank is: ${lastRank}`);
    }
  }
}
