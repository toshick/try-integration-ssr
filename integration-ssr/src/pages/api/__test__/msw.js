// pages/api/__test__/msw.js
export default function handler(req, res) {
  if (process.env.NODE_ENV !== "test") {
    return res.status(404).end();
  }

  const server = global.__MSW_SERVER__;
  const rest = global.__MSW_REST__;

  if (!server || !rest) {
    return res.status(500).json({ error: "MSW not initialized" });
  }

  if (req.method === "POST") {
    // 期待: { method: 'post'|'get', path: '/data', status: 200, body: { ... }, delay?: ms }
    const {
      method = "post",
      path = "/data",
      status = 200,
      body = {},
      delay = 0,
    } = req.body;
    const url = path.startsWith("http") ? path : `http://localhost:3001${path}`;

    const handlerCreator =
      method.toLowerCase() === "get" ? rest.get : rest.post;
    const handler = handlerCreator(url, (r, ctx) => {
      const pieces = [];
      if (delay) pieces.push(ctx.delay(delay));
      pieces.push(ctx.status(status));
      pieces.push(ctx.json(body));
      // return response composed by ctx helpers (call sequentially)
      return ctx.status(status)(ctx.json(body));
      // Note: msw ctx helpers are composable; we simply return a status+json for clarity
    });

    server.use(handler);
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    server.resetHandlers();
    return res.status(200).json({ ok: true });
  }

  return res.status(405).end();
}
