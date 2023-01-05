import puppeteer, { Browser, Page } from "puppeteer";

export class O6U {
  static #browser: Browser;

  static async initialize() {
    if (!O6U.#browser?.isConnected())
      O6U.#browser = await puppeteer.launch({ args: ["--no-sandbox"] });

    const page = await O6U.#openNewO6UPage();
    console.log("O6u Page Opened successfully");
    return page;
  }

  static async #openNewO6UPage(): Promise<Page> {
    const page = await O6U.#browser.newPage();

    await page.goto("https://o6u.edu.eg/default.aspx?id=70");

    return page;
  }

  static async closeBrowser(): Promise<void> {
    const pages = await O6U.#browser.pages();

    console.log("PAGES COUNT: ", pages.length);

    if (O6U.#browser.isConnected()) await O6U.#browser.close();
  }
}
