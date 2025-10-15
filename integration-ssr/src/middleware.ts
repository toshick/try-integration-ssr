import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// テスト環境でのみMSWを初期化
if (process.env.NODE_ENV === "test" && typeof window === "undefined") {
  // サーバーサイドでのMSW初期化
  const { setupServer } = require("msw/node");
  const { http, HttpResponse } = require("msw");

  const defaultHandlers = [
    http.post("http://localhost:3001/:path*", () => {
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
}

export function middleware(request: NextRequest) {
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
