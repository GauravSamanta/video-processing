import app from "./server";

console.log("server running on http://localhost:3000");

Bun.serve({
  fetch: app.fetch,
});


