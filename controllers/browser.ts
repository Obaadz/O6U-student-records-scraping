import puppeteer, { Browser, Page } from "puppeteer";
import { StudentAuth } from "../types/student";

const O6U_WEBSITE = "https://o6u.edu.eg/default.aspx?id=70";

export class O6U {
  static #browser: Browser;
  #page: Page;

  static async initialize() {
    let page: Page | null = null;

    if (!O6U.#isBrowserOpen()) {
      O6U.#browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      /*
        Retrieve the first open page in the browser.
        This is necessary because 'puppeteer.launch()' opens already a new tab when it is called.
        So instead of creating a new tab below, we can use the already-open tab.
      */
      page = (await O6U.#browser.pages())[0];
    }

    if (!page) page = await O6U.#openNewPage();

    await Promise.all([
      page.goto(O6U_WEBSITE),
      page.waitForNetworkIdle({ idleTime: 3000 }),
    ]);

    return new O6U(page);
  }

  constructor(page: Page) {
    this.#page = page;

    console.log("O6U new instance created successfully...");
  }

  static async #openNewPage(): Promise<Page> {
    const page = await O6U.#browser.newPage();

    return page;
  }

  async login(studentAuth: StudentAuth) {
    await Promise.all([
      this.#typeOnField("#ucHeader_txtUserName", studentAuth.email),
      this.#typeOnField("#ucHeader_txtPassword", studentAuth.password),
      this.#clickOnButton("#ucHeader_btnLogin"),
    ]);
  }

  async #typeOnField(selector: string, value: string) {
    await this.#page.$eval(selector, (el, value) => (el.value = value), value);
  }

  async #clickOnButton(selector: string) {
    await this.#page.$eval(selector, (el) => el.click());
  }

  static async getBrowserPagesCount(): Promise<number> {
    const pages = await O6U.#browser.pages();

    return pages.length;
  }

  async closePage() {
    await this.#page.close();
  }

  static async closeBrowser() {
    if (O6U.#isBrowserOpen()) await O6U.#browser.close();
  }

  static #isBrowserOpen() {
    return O6U.#browser?.isConnected();
  }
}
