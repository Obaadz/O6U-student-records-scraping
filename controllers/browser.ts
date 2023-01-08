import puppeteer, { Browser, Page } from "puppeteer";
import { StudentAuth } from "../types/student";

const O6U_WEBSITE = "https://o6u.edu.eg/default.aspx?id=70";

export class O6U {
  static #browser: Browser;
  #page: Page;

  static async initialize() {
    if (!O6U.#browser?.isConnected())
      O6U.#browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

    const page = await O6U.#openNewPage();
    await page.goto(O6U_WEBSITE);

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

  async closePage() {
    await this.#page.close();
  }

  static async closeBrowser() {
    if (O6U.#browser.isConnected()) await O6U.#browser.close();
  }
}
