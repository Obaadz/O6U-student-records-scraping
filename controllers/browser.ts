import puppeteer, { Browser, Page } from "puppeteer";
import { ERROR_MESSAGES } from "../types/Enums";
import { StudentAuth } from "../types/student";

export class O6U {
  static readonly HOME_PAGE = "https://o6u.edu.eg/default.aspx?id=70";
  static readonly RECORDS_PAGE = "https://o6u.edu.eg/historicalresults.aspx";
  private static browser: Browser;
  private page: Page;

  static async initialize() {
    let page: Page | null = null;

    if (!O6U.isBrowserOpen()) {
      O6U.browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      /*
        Retrieve the first open page in the browser.
        This is necessary because 'puppeteer.launch()' opens already a new tab when it is called.
        So instead of creating a new tab below, we can use the already-open tab.
      */
      page = (await O6U.browser.pages())[0];
    }

    if (!page) page = await O6U.openNewPage();

    await Promise.all([
      page.goto(O6U.HOME_PAGE),
      page.waitForNetworkIdle({ idleTime: 3000 }),
    ]);

    return new O6U(page);
  }

  constructor(page: Page) {
    this.page = page;

    console.log("O6U new instance created successfully...");
  }

  private static async openNewPage(): Promise<Page> {
    const page = await O6U.browser.newPage();

    return page;
  }

  async login(studentAuth: StudentAuth) {
    const MAX_RETRIES = 1;
    let retries = 0;

    while (retries <= MAX_RETRIES) {
      try {
        await Promise.all([
          this.typeOnField("#ucHeader_txtUserName", studentAuth.email),
          this.typeOnField("#ucHeader_txtPassword", studentAuth.password),
          this.clickOnButton("#ucHeader_btnLogin"),
          this.page.waitForNetworkIdle({ idleTime: 3000 }),
        ]);

        break;
      } catch (err) {
        retries++;

        if (retries > MAX_RETRIES) throw new Error(ERROR_MESSAGES.SERVER_ERROR);
      }
    }

    if (!(await this.isLoggedIn()))
      throw new Error(ERROR_MESSAGES.INCORRECT_EMAIL_OR_PASSWORD);

    return this;
  }

  private async typeOnField(selector: string, value: string) {
    await this.page.$eval(selector, (el, value) => (el.value = value), value);
  }

  private async clickOnButton(selector: string) {
    await this.page.$eval(selector, (el) => el.click());
  }

  async goToRecordsPage() {
    await Promise.all([
      this.page.goto(O6U.RECORDS_PAGE),
      this.page.waitForNetworkIdle({ idleTime: 3000 }),
    ]);
  }

  private async isLoggedIn() {
    const isLoggedIn = (await this.page.$(".StudentInfo")) ? true : false;

    return isLoggedIn;
  }

  async getStudentName(): Promise<string> {
    try {
      const studentName = await this.page.$eval(".Stdname", (el) => el.innerText);

      return studentName;
    } catch (err) {
      throw new Error(ERROR_MESSAGES.NOT_LOGGED_IN);
    }
  }

  static async getBrowserPagesCount(): Promise<number> {
    const pages = await O6U.browser.pages();

    return pages.length;
  }

  async closePage() {
    await this.page.close();
  }

  static async closeBrowser() {
    if (O6U.isBrowserOpen()) await O6U.browser.close();
  }

  private static isBrowserOpen() {
    return O6U.browser?.isConnected();
  }
}
