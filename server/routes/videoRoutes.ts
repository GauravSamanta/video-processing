import { Hono } from "hono";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { db } from "../db";
import { videosTable } from "../db/schemas/video";

const runVideoProcessing = promisify(exec);

const videoRouter = new Hono()
  .post("/upload", async (c) => {
    const body = await c.req.parseBody();
    console.log(body["video"]); // Log the content of 'ok'

    const file = body["video"];

    if (!(file instanceof File)) {
      return c.text("Upload a valid file", 400); // Return error if not valid
    }

    const arrbuf = await file.arrayBuffer();

    const buffer = Buffer.from(arrbuf); // Create a Buffer from the ArrayBuffer

    const unique = crypto.randomUUID();
    const filePath = path.join(
      "uploads",
      `${unique}${path.extname(file.name)}` // Use template literal for better readability
    );

    fs.writeFile(filePath, new Uint8Array(buffer), (err) => {
      if (err) {
        console.error(err); // Log the error if writing fails
        return c.text("Error saving file ", 500);
      }
    });

    await db.insert(videosTable).values({
      name: file.name,
      videoId: unique,
    });
    const result = await db.execute("select * from videos");

    exec(`mkdir uploads/${unique}`);
    try {
      const { stdout, stderr } = await runVideoProcessing(
        `ffmpeg -i ${filePath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "uploads/${unique}/segment%03d.ts" -start_number 0 uploads/${unique}/index.m3u8`
      );
      console.log("Output:", stdout);
      if (stderr) {
        console.error("Error:", stderr);
      }
    } catch (error) {
      console.error("Execution error:", error);
    }

    return c.json({ videos: result.rows }, 200);
  })
  .get("/get", async (c) => {
    const results = await db
      .select()
      .from(videosTable);
    return c.json({ videos: results });
  });

export { videoRouter };
