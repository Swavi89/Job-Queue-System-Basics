import express, { Request, Response } from "express";
import { Queue } from "bullmq";
import IORedis from 'ioredis';

const redis_connection = new IORedis ({
  maxRetriesPerRequest: null,
  host: "127.0.0.1",
  port: 6379,
  password: ''
})

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
