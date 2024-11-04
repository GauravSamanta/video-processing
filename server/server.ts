import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from "hono/bun";
import { videoRouter } from "./routes/videoRoutes";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.use(logger());
const apiRoutes = app.basePath("/api").route("/video", videoRouter);

app.use("*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist" }));
app.onError((error, c) => {
  const status = error instanceof HTTPException ? error.status : 500;
  const message = error.cause || "Internal Server Error";
  return c.json({ error: message }, status);
});

export default app;
export type apiRoutes = typeof apiRoutes;
