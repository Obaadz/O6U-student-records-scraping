import puppeteer, { Browser, Page } from "puppeteer";
import { StudentAuth } from "../types/student";

export class O6U {
  static #browser: Browser;

  static async initialize() {
    if (!O6U.#browser?.isConnected())
      O6U.#browser = await puppeteer.launch({ args: ["--no-sandbox"] });

    const page = await O6U.#openNewO6UPage();
    console.log("O6U Page Opened successfully");
    return page;
  }

  static async #openNewO6UPage(): Promise<Page> {
    const page = await O6U.#browser.newPage();

    await page.goto("https://o6u.edu.eg/default.aspx?id=70");

    return page;
  }

  static async login(page: Page, studentAuth: StudentAuth): Promise<Page> {
    await O6U.#typeOnField(page, "#ucHeader_txtUserName", studentAuth.email);
    await O6U.#typeOnField(page, "#ucHeader_txtPassword", studentAuth.password);

    await O6U.#clickOnButton(page, "#ucHeader_btnLogin");

    return page;
  }

  static async #typeOnField(page: Page, selector: string, value: string) {
    await page.$eval(selector, (el, value) => (el.value = value), value);

    return page;
  }
  static async #clickOnButton(page: Page, selector: string) {
    await page.$eval(selector, (el) => el.click());
  }

  static async closeBrowser(): Promise<void> {
    const pages = await O6U.#browser.pages();

    console.log("PAGES COUNT: ", pages.length);

    if (O6U.#browser.isConnected()) await O6U.#browser.close();
  }
}
