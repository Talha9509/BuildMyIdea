import { createClient, type RedisClientType } from 'redis'

const redisClient = createClient()

export const pubClient: RedisClientType = redisClient.duplicate();
export const subClient: RedisClientType = redisClient.duplicate();

export async function connectRedis () {
    if(!redisClient.isOpen) await redisClient.connect()
    if(!pubClient.isOpen) await pubClient.connect()
    if(!subClient.isOpen) await subClient.connect()
    console.log("Redis connected successfully")
}



