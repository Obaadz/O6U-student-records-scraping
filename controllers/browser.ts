import { firefox, Browser, Page } from "playwright";

export class O6U {
  static #browser: Browser;

  static async initialize() {
    if (!O6U.#browser?.isConnected()) O6U.#browser = await firefox.launch();

    const page = await O6U.#openNewO6UPage();
    console.log("O6U Page Opened successfully");
    return page;
  }

  static async #openNewO6UPage(): Promise<Page> {
    const page = await O6U.#browser.newPage();

    await page.goto("https://o6u.edu.eg/default.aspx?id=70");

    return page;
  }

  static async closeBrowser(): Promise<void> {
    console.log("Browser Closing...");

    if (O6U.#browser.isConnected()) await O6U.#browser.close();
  }
}
