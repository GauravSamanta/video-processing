import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { insertUserSchema, loginSchema, usersTable } from "../db/schemas/user";
import { db } from "../db";
import { eq, or } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { jwt, sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
const userRouter = new Hono()
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
      message: "user logged in",
      name: existingUser.name,
    });
  });

export { userRouter };
