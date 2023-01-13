import puppeteer, { Browser, Page } from "puppeteer";
import { ERROR_MESSAGES, PAGES_NAMES } from "../types/enums";
import { StudentAuth } from "../types/student";

const TIMEOUT = 60000;

export class O6U {
  static readonly HOME_PAGE = "https://o6u.edu.eg/default.aspx?id=70";
  static readonly RECORDS_PAGE = "https://o6u.edu.eg/historicalresults.aspx";
  private static browser: Browser;
  private page: Page;
  private currentPageName: PAGES_NAMES;

  static async initialize() {
    let page: Page | null = null;

    if (!O6U.isBrowserOpen()) {
      O6U.browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        timeout: TIMEOUT,
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
      page.waitForNetworkIdle({ idleTime: 1500 }),
    ]);

    return new O6U(page, PAGES_NAMES.HOME);
  }

  constructor(page: Page, currentPageName: PAGES_NAMES) {
    this.page = page;
    this.currentPageName = currentPageName;

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
          this.page.waitForNetworkIdle({ idleTime: 1500 }),
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
      this.page.waitForNetworkIdle({ idleTime: 1500 }),
    ]);

    this.currentPageName = PAGES_NAMES.RECORDS;
  }

  async getStudentName(): Promise<string> {
    if (!(await this.isLoggedIn())) throw new Error(ERROR_MESSAGES.NOT_LOGGED_IN);

    const getNameFromPage: { [key in PAGES_NAMES]: () => Promise<string> } = {
      [PAGES_NAMES.HOME]: async () =>
        await this.page.$eval(".Stdname", (el) => el.innerText),
      [PAGES_NAMES.RECORDS]: async () =>
        await this.page.$eval("#lblStdName1", (el) => el.innerText),
    };
    const studentName: string = await getNameFromPage[this.currentPageName]();

    return studentName;
  }

  async getStudentId(): Promise<string> {
    if (!(await this.isLoggedIn())) throw new Error(ERROR_MESSAGES.NOT_LOGGED_IN);
    else if (this.currentPageName !== PAGES_NAMES.RECORDS)
      throw new Error(ERROR_MESSAGES.NOT_IN_RECORDS_PAGE);

    const studentId = await this.page.$eval("#lblStdCode", (el) => el.innerText);

    return studentId;
  }

  async getStudentNationality(): Promise<string> {
    if (!(await this.isLoggedIn())) throw new Error(ERROR_MESSAGES.NOT_LOGGED_IN);
    else if (this.currentPageName !== PAGES_NAMES.RECORDS)
      throw new Error(ERROR_MESSAGES.NOT_IN_RECORDS_PAGE);

    const studentNationality = await this.page.$eval(
      "#lblNationality",
      (el) => el.innerText
    );

    return studentNationality;
  }

  async getStudentCGPA(): Promise<number> {
    if (!(await this.isLoggedIn())) throw new Error(ERROR_MESSAGES.NOT_LOGGED_IN);
    else if (this.currentPageName !== PAGES_NAMES.RECORDS)
      throw new Error(ERROR_MESSAGES.NOT_IN_RECORDS_PAGE);

    const studentCGPA: string = await this.page.evaluate(() => {
      const CGPA: string = $('span:contains("CGPA") + span')[0].innerText;

      return CGPA;
    });

    return Number(studentCGPA);
  }

  async getStudentTotalHours(): Promise<number> {
    if (!(await this.isLoggedIn())) throw new Error(ERROR_MESSAGES.NOT_LOGGED_IN);
    else if (this.currentPageName !== PAGES_NAMES.RECORDS)
      throw new Error(ERROR_MESSAGES.NOT_IN_RECORDS_PAGE);

    const studentTotalHours: string = await this.page.evaluate(() => {
      const totalHours: string = $(
        'span:contains("Total Registered Hours - Total Price:") + span'
      )[0].innerText;

      return totalHours;
    });

    return Number(studentTotalHours);
  }

  async getStudentLevel(): Promise<string> {
    if (!(await this.isLoggedIn())) throw new Error(ERROR_MESSAGES.NOT_LOGGED_IN);
    else if (this.currentPageName !== PAGES_NAMES.RECORDS)
      throw new Error(ERROR_MESSAGES.NOT_IN_RECORDS_PAGE);

    const studentLevel = await this.page.$eval("#lblStdLevel", (el) => el.innerText);

    return studentLevel;
  }

  async getStudentSection(): Promise<string> {
    if (!(await this.isLoggedIn())) throw new Error(ERROR_MESSAGES.NOT_LOGGED_IN);
    else if (this.currentPageName !== PAGES_NAMES.RECORDS)
      throw new Error(ERROR_MESSAGES.NOT_IN_RECORDS_PAGE);

    const studentSection = await this.page.$eval("#lblStdSection", (el) => el.innerText);

    return studentSection;
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

  private async isLoggedIn() {
    const isLoggedIn = (await this.page.$(".StudentInfo")) ? true : false;

    return isLoggedIn;
  }
}
