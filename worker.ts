import { Worker } from 'bullmq';
import fs from 'fs';
import IORedis from 'ioredis';
import dotenv from 'dotenv'

dotenv.config({
  path:`${__dirname}/../.env`
});

const redis_connection = new IORedis ({
  maxRetriesPerRequest: null,
  host: process.env.REDIS_HOST || "",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD || ""
})

const worker = new Worker(
  "SendHello",
  async (job) => {
    console.log(`Processing job ${job.id}`);
    const { fileName, fileContent } = job.data;
    try {
      fs.writeFileSync(fileName as string, fileContent as string);
      console.log(`File '${fileName}' created successfully!`);

      return { success: true, fileName, message: "File written successfully" };
    } catch (error) {
      console.error(`Error writing file '${fileName}':`, error);
      throw error;
    }
  },
  { connection: redis_connection }
);

console.log("Worker started and waiting for jobs...");
