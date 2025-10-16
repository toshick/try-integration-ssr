import { test, expect, describe } from "next/experimental/testmode/playwright";

describe("SSRモックの実験", () => {
  test("myitemとhogeの両方のAPIをモックして、画面に反映されることを確認", async ({
    page,
    next,
  }) => {
    next.onFetch((request) => {
      console.log("リクエスト: ", request.url);
      if (request.url === "http://localhost:3001/myitem") {
        return new Response(
          JSON.stringify({
            id: 1,
            name: "テストユーザーですね",
            age: 20,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      if (request.url === "http://localhost:3001/hoge") {
        return new Response(
          JSON.stringify({
            message: "fugaaaaaa",
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      return "abort";
    });
    await page.goto("http://localhost:3000/");

    // 実際のAPIレスポンスが表示されることを確認
    await expect(page.locator('[data-testid="api-result"]')).toBeVisible();

    const html = await page.locator("main.App").innerHTML();
    console.log("HTML: ", html);

    // 画面にモックデータが反映されていることを確認
    await expect(page.locator('[data-testid="api-result"]')).toContainText(
      "テストユーザー"
    );
    await expect(page.locator(".App")).toContainText("fugaaaaaa");
  });
  test.only("hogeのみ", async ({ page, next }) => {
    next.onFetch((request) => {
      console.log("リクエスト: ", request.url);

      if (request.url === "http://localhost:3001/hoge") {
        return new Response(
          JSON.stringify({
            message: "nyaoooo",
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
      // return "abort";
    });
    await page.goto("http://localhost:3000/");

    // 実際のAPIレスポンスが表示されることを確認
    await expect(page.locator('[data-testid="api-result"]')).toBeVisible();

    const html = await page.locator("main.App").innerHTML();
    console.log("HTML: ", html);

    // 画面にモックデータが反映されていることを確認
    await expect(page.locator('[data-testid="api-result"]')).toContainText(
      "なまえ"
    );
    await expect(page.locator(".App")).toContainText("nyaoooo");
  });
});
