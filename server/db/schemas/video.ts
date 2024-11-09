import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

import { z } from "zod";
export const videosTable = pgTable("videos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  userId: text("text").notNull(),
  videoId: text("video_id").notNull(),
});

export const insertVideoSchema = createInsertSchema(videosTable);

const ACCEPTED_VIDEO_TYPES = ["video/mp4"];

export const formVideoSchema = z.object({
  title: z
    .string()
    .min(3, { message: "title cannot be less than 3 chars" })
    .max(40, { message: "title cannot be more than 50 chars" }),
  description: z
    .string()
    .min(3, { message: "description cannot be less than 3 chars" })
    .max(40, { message: "description cannot be more than 50 chars" }),
  videoFile: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine(
      (files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type),
      "only mp4 files are accepted"
    ),
});
