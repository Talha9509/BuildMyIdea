import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import "dotenv/config";

// 1. Create a dedicated ioredis connection specifically for BullMQ
// It uses the exact same URL as your node-redis setup!
// @ts-ignore
const bullMqConnection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null, // BullMQ requires this specific setting to be null
});

// 2. Initialize the Queue (The Producer)
export const embeddingQueue = new Queue('embedding-generation', { 
  connection: bullMqConnection 
});

// 3. Initialize the Worker (The Consumer)
export const embeddingWorker = new Worker('embedding-generation', async (job) => {
  console.log(`Processing job ${job.id} for project ${job.data.projectId}`);
  
  // Your OpenAI logic goes here
  // const vector = await getOpenAIEmbedding(job.data.text);
  // await prisma.project.update({ ... });
  
  return "Embedding created successfully";
}, { 
  connection: bullMqConnection,
  limiter: {
    max: 50, // Example: Max 50 jobs
    duration: 60000 // per 60 seconds (Rate limiting for OpenAI!)
  }
});

// Optional: Listen for errors
embeddingWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err.message}`);
});