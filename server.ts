import express, { Request, Response } from 'express';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv'

dotenv.config({
  path: `${__dirname}/../.env`
});

const redis_connection = new IORedis({
  maxRetriesPerRequest: null,
  host: process.env.REDIS_HOST || "",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || "",
});

const app = express();
app.use(express.json()); //Parse Json body for post request
const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const queue = new Queue("SendHello", { connection: redis_connection });
const saveFileQueue = new Queue("SaveFile", { connection: redis_connection });
const priorityQueue = new Queue("SavePriorityFile", { connection: redis_connection });
const jsonFileQueue = new Queue("SaveJsonFile", { connection: redis_connection });

app.get("/write-to-file", async (req: Request, res: Response) => {
  const { fileName, fileContent } = req.query;
  try {
    await queue.add("SendHello", {
      fileName: fileName as String,
      fileContent: fileContent as String,
    }, {
      attempts: 3,
    });
  } catch (error) {
    console.error("Error adding job to queue:", error);
  }
});

app.get("/delayed", async (req: Request, res: Response) => {
  const { fileName, fileContent } = req.query;

  try {
    await saveFileQueue.add("SaveFile", {
      fileName,
      fileContent
    }, {
      delay: 10000,
      attempts: 3
    });
    res.send("Job scheduled to run after 10 seconds");
  } catch (error) {
    console.error("Error adding job to the queue:", error);
    res.status(500).send("Failed to schedule the delayed job");
  }
});

const priorityMap: Record<string, number> = {
  high: 1,
  medium: 2,
  low: 3
};

app.get("/priority", async (req: Request, res: Response) => {
  const { fileName, fileContent, priority } = req.query;
  const priorityValue = priorityMap[(priority as string).toLowerCase()];

  try {
    await priorityQueue.add("SavePriorityFile", {
      fileName,
      fileContent
    },
      {
        priority: priorityValue,
        attempts: 3
      })
    res.send(`Job added with ${priority} priority.`)
  } catch (error) {
    console.error("Error adding priority job to queue.", error);
    res.status(500).send("Failed to add priority job.");
  }
});

app.post("/file", async (req: Request, res: Response) => {
  const { fileName, fileContent } = req.body;

  if (!fileName || !fileContent) {
    return res.status(400).send({ error: 'Missing Filename or Filecontent' })
  }

  try {
    await jsonFileQueue.add("SaveJsonFile", {
      fileName,
      fileContent
    },
      {
        attempts: 3
      });
    res.send("File added to the queue.")
  } catch (error) {
    console.error("Error adding job to the queue:", error);
    res.status(500).send("Failed to add job to the queue.");
  }
})