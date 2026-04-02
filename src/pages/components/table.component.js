import { getUnixTimestamp } from '../../utils/helper';
import logger from "../../utils/logger/logger";

const log = logger.child({ component: "TableComponent" });

export default class TableComponent {
  constructor(page) {
    this.page = page;
    this.table = page.locator('#bigbox table');
  }

  async getRows() {
    return this.table
      .locator('tr')
      .filter({ has: this.page.locator('.titleline') });
  }

  async rowCount() {
    const rows = await this.getRows();
    const count = await rows.count();

    return count;
  }

  async getRank(index) {
    const rows = await this.getRows();
    const text = await rows.nth(index).locator('.rank').textContent();
    const rank = Number(text);

    if (isNaN(rank)) {
      log.warn({ index, text }, "Could not parse rank to a number");
    }

    return rank;
  }

  async getTitle(index) {
    const rows = await this.getRows();

    return rows.nth(index).locator('.titleline');
  }

  async clickTitleLink(index) {
    const title = await this.getTitle(index);
    await title.locator('a').first().click();
  }

  async getSubtext(rowIndex) {
    const rows = await this.getRows();
    const titleRow = rows.nth(rowIndex);
    const subtextRow = titleRow.locator('xpath=following-sibling::tr[1]');

    return subtextRow.locator('.subtext');
  }

  async getAge(rowIndex) {
    const subtextRow = await this.getSubtext(rowIndex);

    return subtextRow.locator('.age');
  }

  async getTimestamp(rowIndex) {
    const age = await this.getAge(rowIndex);
    const titleAttr = await age.getAttribute('title');

    if (!titleAttr) {
      log.error({ rowIndex }, "Missing title attribute");

      throw new Error(`Row ${rowIndex} age has no title attribute`);
    }

    const timestamp = getUnixTimestamp(titleAttr);

    if (!Number.isFinite(timestamp)) {
      log.error(
          { rowIndex, titleAttr, timestamp },
          "Failed to convert title attribute to Unix timestamp"
      );

      throw new Error(
        `Row ${rowIndex} age title cannot be parsed: "${titleAttr}"`,
      );
    }

    log.info(
        { rowIndex, timestamp },
        "Timestamp parsed successfully"
    );

    return timestamp;
  }
}
