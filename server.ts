import express, { Request, Response } from 'express';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv'

dotenv.config({
  path:`${__dirname}/../.env`
});

const redis_connection = new IORedis({
  maxRetriesPerRequest: null,
  host: process.env.REDIS_HOST || "",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || "",
});

const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const queue = new Queue("SendHello", { connection: redis_connection });

app.get("/write-to-file", async (req: Request, res: Response) => {
  const { fileName, fileContent } = req.query;
  try {
    await queue.add("SendHello", {
      fileName: fileName as String,
      fileContent: fileContent as String,
    });
  } catch (error) {
    console.error("Error adding job to queue:", error);
  }
});
