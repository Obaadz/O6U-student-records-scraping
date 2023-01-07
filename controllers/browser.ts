import puppeteer, { Browser, Page } from "puppeteer";
import { StudentAuth } from "../types/student";

export class O6U {
  static #browser: Browser;
  #page: Page;

  static async initialize() {
    if (!O6U.#browser?.isConnected())
      O6U.#browser = await puppeteer.launch({ args: ["--no-sandbox"] });

    const page = await O6U.#openNewO6UPage();

    return new O6U(page);
  }

  constructor(page: Page) {
    this.#page = page;

    console.log("O6U new instance created successfully...");
  }

  static async #openNewO6UPage(): Promise<Page> {
    const page = await O6U.#browser.newPage();

    await page.goto("https://o6u.edu.eg/default.aspx?id=70");
    await page.waitForNetworkIdle({ idleTime: 3000 });

    return page;
  }

  async login(studentAuth: StudentAuth) {
    await this.#typeOnField("#ucHeader_txtUserName", studentAuth.email);
    await this.#typeOnField("#ucHeader_txtPassword", studentAuth.password);

    await this.#clickOnButton("#ucHeader_btnLogin");
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

  static async closeBrowser() {
    if (O6U.#browser.isConnected()) await O6U.#browser.close();
  }
}
