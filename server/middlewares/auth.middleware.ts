import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";
import { createMiddleware } from "hono/factory";
import { type Context } from "hono";

// Define the user type based on JWT structure
type User = {
  id: string;
  name: string;
  email: string;
};

// Extend the context to include user data
export type Env = {
  Variables: {
    user: User;
  };
};

// Define authMiddleware
const authMiddleware = createMiddleware<Env>(async (c: Context<Env>, next) => {
  const token = getCookie(c, "token");
  if (!token) {
    c.status(401);
    throw new Error("unauthorized access");
  }

  try {
    // Verify the JWT token
    const decoded = (await verify(token, "hello")) as User;

    // Set the decoded token payload in the context
    c.set("user", decoded);

    await next();
  } catch (err) {
    c.status(403);
    throw new Error("invalid token");
  }
});

export { authMiddleware };
