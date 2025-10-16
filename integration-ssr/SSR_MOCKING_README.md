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

- Next.js 15.5.5以上が必要
- experimental機能のため、将来のバージョンで変更される可能性があります
- 本番環境では使用しないでください（テスト環境専用）
