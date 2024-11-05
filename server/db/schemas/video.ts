import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const videosTable = pgTable("videos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  userId: text("text").notNull(),
  videoId: text("video_id").notNull(),
});
