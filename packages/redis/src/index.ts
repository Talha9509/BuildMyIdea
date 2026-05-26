import { createClient, type RedisClientType } from 'redis'
import "dotenv/config";

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



