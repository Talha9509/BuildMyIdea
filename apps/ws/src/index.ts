import { WebSocketServer, WebSocket } from 'ws'
import { connectRedis, subClient } from '@repo/redis/client'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import cookie from 'cookie'

const wss = new WebSocketServer({ port:8080 })
const SECRET = process.env.JWT_SECRET

await connectRedis()
let userId: number | null = null

wss.on('connection', async (socket: WebSocket, req) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;
    if (!token) throw new Error("No cookie found");

    const decoded = jwt.verify(token, SECRET!) 
    userId = (decoded as JwtPayload).userId;
  } catch (error) {
    console.log("Unauthorized WS connection attempt");
    socket.close(1008, "Unauthorized");
    return;
  }

  console.log(`User ${userId} authenticated and connected via WebSocket.`);

  const notificationListener = (message:string) => {
    console.log(`notifying ${userId}`)
    socket.send(JSON.stringify({ type: 'notification', data: message }))
  }

  await subClient.subscribe(`notifications:${userId}`,notificationListener )

  socket.on('close', async () => {
    console.log(`user ${userId} disconnected`)
    await subClient.unsubscribe(`notifications:${userId}`)
  })

})

