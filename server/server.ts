import { Hono } from "hono";
import { logger } from "hono/logger";
import { uploadRouter } from "./routes/uploadRoutes";

const app = new Hono();

app.use(logger());
app.basePath("/api").route("/", uploadRouter);

app.get("/", (c) => c.text("Hello Bun!"));

export default app;
