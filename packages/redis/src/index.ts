import { createClient, type RedisClientType } from 'redis'

const redisClient = await createClient()

export const pubClient: RedisClientType = redisClient.duplicate();
export const subClient: RedisClientType = redisClient.duplicate();

export async function connectRedis () {
    if(!redisClient.connect) await redisClient.connect()
    if(!pubClient.connect) await pubClient.connect()
    if(!subClient.connect) await subClient.connect()
    console.log("Redis connected successfully")
}