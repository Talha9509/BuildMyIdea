import { createClient, type RedisClientType } from 'redis'

const redisClient = createClient()

export const pubClient: RedisClientType = redisClient.duplicate();
export const subClient: RedisClientType = redisClient.duplicate();

export async function connectRedis () {
    if(!redisClient.connect) await redisClient.connect()
    if(!pubClient.connect) await pubClient.connect()
    if(!subClient.connect) await subClient.connect()
    console.log("Redis connected successfully")
}




// const pubClientt = createClient();
// await pubClient.connect();

// // Duplicate the existing connection to create a dedicated subscriber
// const subClientt = pubClient.duplicate();
// await subClient.connect();

// // Use subClient to listen
// await subClientt.subscribe('my-channel', (message) => {
//   console.log(message);
// });

// // Use pubClient to send messages
// await pubClientt.publish('my-channel', 'Hello world!');
