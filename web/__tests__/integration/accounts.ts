/**
 * @jest-environment jest-environment-webdriver
 */

import * as helper from "../utils/specHelper";
import { User } from "./../../../api/src/models/User";
let url;

declare var browser: any;
declare var by: any;
declare var until: any;

describe("integration/accounts", () => {
  const email = "mario@example.com";
  const password = "P@ssw0rd";
  const userName = "Mario";

  beforeAll(async () => {
    const env = await helper.prepareForIntegrationTest();
    url = env.url;
  }, 1000 * 60 * 5);

  afterAll(async () => {
    await helper.shutdown();
  });

  test("it renders the home page", async () => {
    await browser.get(url);
    const header = await browser.findElement(by.tagName("h1")).getText();
    expect(header).toContain("Actionhero Chat Sample Project");
  });

  test("it can create an account", async () => {
    await browser.get(`${url}/sign-up`);
    await browser.findElement(by.name("userName")).sendKeys(userName);
    await browser.findElement(by.name("email")).sendKeys(email);
    await browser.findElement(by.name("password")).sendKeys(password);

    const button = await browser.findElement(by.className("btn-primary"));
    await button.click();
  });

  test(
    "it can sign in",
    async () => {
      await helper.sleep(1 * 1000);

      const url = await browser.getCurrentUrl();
      expect(url).toMatch(/sign-in/);
      await browser.get(url); // we should have been transitioned to the sign in page already, but we need to tell selenium to reload its context

      await browser.findElement(by.name("email")).sendKeys(email);
      await browser.findElement(by.name("password")).sendKeys(password);

      const button = await browser.findElement(by.className("btn-primary"));
      await button.click();

      await helper.sleep(1000);

      const header = await browser.findElement(by.tagName("h1")).getText();
      expect(header).toContain("Mario's Messages");
    },
    1000 * 20
  );

  test(
    "it can edit account information",
    async () => {
      await browser.get(`${url}/account`);
      const userNameForm = await browser.findElement(by.name("userName"));
      await userNameForm.clear();
      await userNameForm.sendKeys("SuperMario!");

      const button = await browser.findElement(by.className("btn-primary"));
      await button.click();

      await browser.get(`${url}/dashboard`);
      await helper.sleep(1000);

      const header = await browser.findElement(by.tagName("h1")).getText();
      expect(header).toContain("SuperMario!'s Messages");
    },
    1000 * 20
  );
});
