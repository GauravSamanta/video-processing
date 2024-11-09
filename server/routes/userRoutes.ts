import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { insertUserSchema, loginSchema, usersTable } from "../db/schemas/user";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { sign } from "hono/jwt";
import { deleteCookie, setCookie } from "hono/cookie";
import { authMiddleware, type Env } from "../middlewares/auth.middleware";

const userRouter = new Hono<Env>()
  .post("/register", zValidator("form", insertUserSchema), async (c) => {
    const user = c.req.valid("form");
    const [result] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user.email))
      .limit(1);
    if (result) {
      c.status(400);
      return c.json({ message: "user with this email already exists" });
    }
    user.password = await Bun.password.hash(user.password);
    try {
      await db.insert(usersTable).values(user);
      // throw new Error("ok")
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "error inserting user in db" });
    }
    // console.log("inside fn");

    c.status(200);
    return c.json({ message: "user registered successfully" });
  })
  .post("/login", zValidator("form", loginSchema), async (c) => {
    const user = c.req.valid("form");
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, user.email))
      .limit(1);

    if (!existingUser) {
      c.status(404);
      return c.json({ message: "user with this email doesnt exists" });
    }

    const isValid = await Bun.password.verify(
      user.password,
      existingUser.password
    );
    if (!isValid) {
      c.status(404);
      return c.json({ message: "Invalid credentials" });
    }

    const { password, ...payload } = existingUser;
    const token = await sign(payload, "hello");

    c.status(201);
    setCookie(c, "token", token);
    return c.json({
      token,
      message: `Welcome ${existingUser.name }`,
      name: existingUser.name,
    });
  })
  .get("/me", authMiddleware, async (c) => {
    const user = c.var.user;
    c.status(200);
    return c.json(user);
  })
  .post("/logout", authMiddleware, async (c) => {
    deleteCookie(c, "token");
    c.status(200);
    return c.json("user logged out");
  });

export { userRouter };
