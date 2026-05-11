import {selectors, test as base} from '@playwright/test';

import TableSortPage from "../pages/tableSort.page";
import EmployeePage from "../pages/employee-page";

export const test = base.extend({
    tableSort: async ({ page }, use) => {
        await page.goto(process.env.SORT_TABLE);

        const tableSort = new TableSortPage(page);
        await use(tableSort);
    },

    employeeTable: async ({ page }, use) => {
        selectors.setTestIdAttribute('data-cy');
        await page.goto(process.env.EMPLOYEE_TABLE);

        const employeeTable = new EmployeePage(page);

        await use(employeeTable);
    }
});

export const expect = test.expect;