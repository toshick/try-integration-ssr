declare global {
  var __MSW_SERVER__: import("msw/node").SetupServer | undefined;
  var __MSW_REST__: typeof import("msw").rest | undefined;
}
export {};
