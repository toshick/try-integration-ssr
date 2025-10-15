import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// MSWの初期化フラグ
let mswInitialized = false;

async function initMSW() {
  // テスト環境でのみMSWを初期化
  if (
    process.env.NODE_ENV !== "production" &&
    typeof window === "undefined" &&
    !mswInitialized
  ) {
    try {
      console.log("MSW初期化開始");

      // 動的importを使用してESモジュールの問題を回避
      const { setupServer } = await import("msw/node");
      const { http, HttpResponse } = await import("msw");

      const defaultHandlers = [
        http.post("http://localhost:3001/:path*", () => {
          console.log("MSW: POSTリクエストを受信");
          return HttpResponse.json({
            message: "msw: no handler registered",
          });
        }),
      ];

      const server = setupServer(...defaultHandlers);
      server.listen({ onUnhandledRequest: "bypass" });

      // グローバルに公開
      (global as any).__MSW_SERVER__ = server;
      (global as any).__MSW_REST__ = http;

      mswInitialized = true;
      console.log("MSW初期化完了");
    } catch (error) {
      console.error("MSW初期化エラー:", error);
    }
  }
}

export async function middleware(request: NextRequest) {
  await initMSW();
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
