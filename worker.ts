import { Worker } from "bullmq";
import fs from "fs";
import IORedis from 'ioredis';

const redis_connection = new IORedis ({
  maxRetriesPerRequest: null,
  host: "127.0.0.1",
  port: 6379,
  password: ''
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
