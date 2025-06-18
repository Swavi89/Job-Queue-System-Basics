import { Worker } from "bullmq";
import fs from "fs";

const redis_connection = {
  host: "127.0.0.1",
  port: 6379,
};

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
