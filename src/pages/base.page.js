import MenuComponent from './components/menu.component';
import TableComponent from './components/table.component';
import FooterComponent from './components/footer.component';

export default class BasePage {
  #menu;
  #table;
  #footer;
  #page;

  constructor(page) {
    this.#page = page;
    this.#menu = new MenuComponent(page);
    this.#table = new TableComponent(page);
    this.#footer = new FooterComponent(page);
  }

  getMenu() {
    return this.#menu;
  }

  getTable() {
    return this.#table;
  }

  getFooter() {
    return this.#footer;
  }

  getPage() {
    return this.#page;
  }
}
