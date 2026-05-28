import { createClient, type RedisClientType } from 'redis'
import "dotenv/config";
import IORedis from 'ioredis'
import { Queue } from 'bullmq';

console.log("redis url: "+process.env.REDIS_URL)
const redisClient = createClient({
    url: process.env.REDIS_URL!
})

export const pubClient: RedisClientType = redisClient.duplicate();
export const subClient: RedisClientType = redisClient.duplicate();

export async function connectRedis () {
    if(!redisClient.isOpen) await redisClient.connect()
    if(!pubClient.isOpen) await pubClient.connect()
    if(!subClient.isOpen) await subClient.connect()
    console.log("Redis connected successfully")
}

// @ts-ignore
export const bullMQConnection = (new IORedis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null 
}) as any);

// Export the Queue so your Express Backend can add jobs to it
export const embeddingQueue = new Queue('project-embeddings', { 
    connection: bullMQConnection 
});




