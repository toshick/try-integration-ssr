# Next.js Experimental Testmode/Playwright によるSSRモック実装

このプロジェクトでは、Next.jsのexperimental testmode/playwrightの機能を使用してSSR時のAPI呼び出しをモックする実装を行っています。

## 実装内容

### 1. Next.js設定の更新

`next.config.ts`にexperimental testProxyを有効化：

```typescript
const nextConfig: NextConfig = {
  experimental: {
    testProxy: true,
  },
};
```

### 2. Playwright起動時のアプリ起動

`playwright.config.ts`のwebServerではmockサーバとアプリを起動。

Playwrightでapiをmockするにしても、ここでのmockサーバ起動は必要だった。

```typescript
// 配列で起動コマンドを複数指定する
webServer: [
  {
    command: "pnpm mock",
  },
  {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000, // 2分のタイムアウト
    stdout: "pipe",
    stderr: "pipe",
  },
]
```

### 3. SSRモックテストの実装

1. next.onFetchによりリクエストのurlごとにレスポンスを定義する
2. 次にページにアクセスしssrリクエストを発生させる

### 4. テストの実行

```bash
# Playwrightのテストを実行
pnpm pw
```

## 注意事項

- msw@1が必要との情報がwebにあるが、msw@1.3.5、msw@2.11.5 ともに動いた
