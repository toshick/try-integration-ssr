import { test, expect } from "playwright-ssr";

test("モックなし", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page.locator(".App")).toContainText("なまえ");
});

test("モックあり", async ({ page, webServer }) => {
  await webServer.route("http://localhost:3001/myitem", async (route) => {
    await route.fulfill({
      status: 200,
      json: {
        id: 1,
        name: "テストユーザー",
        age: 20,
      },
    });
  });

  await page.goto("/");
  // 画面にモックデータが反映されていることを確認
  await expect(page.locator(".App")).toContainText("テストユーザー");
});
