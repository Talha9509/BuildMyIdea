import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import "dotenv/config";

// @ts-ignore
const bullMqConnection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null, 
});

export const embeddingQueue = new Queue('embedding-generation', { 
  connection: bullMqConnection 
});

export const embeddingWorker = new Worker('embedding-generation', async (job) => {
  console.log(`Processing job ${job.id} for project ${job.data.projectId}`);
  return "Embedding created successfully";
}, { 
  connection: bullMqConnection,
  limiter: {
    max: 50, // Example: Max 50 jobs
    duration: 60000 // per 60 seconds (Rate limiting for OpenAI!)
  }
});

embeddingWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
});