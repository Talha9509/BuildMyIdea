import { WebSocketServer, WebSocket } from 'ws'
import { connectRedis, subClient } from '@repo/redis/client'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import cookie from 'cookie'
import 'dotenv/config'
import { prismaClient } from '@repo/db/client'

const wss = new WebSocketServer({ port:8080 })
const SECRET = process.env.JWT_SECRET
if(!SECRET){
  throw Error("No JWT Secret")
}

export const activeSockets = new Map<number, WebSocket>();

await connectRedis()
let userId: number | null = null

wss.on('connection', async (socket: WebSocket, req) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.jwt;
    // console.log(token)
    if (!token) throw new Error("No cookie found");

    const decoded = jwt.verify(token, SECRET!) 
    userId = (decoded as JwtPayload).userId;
    activeSockets.set(userId!, socket);

  } catch (error) {
    console.log("Unauthorized WS connection attempt");
    socket.close(1008, "Unauthorized");
    return;
  }

  console.log(`User ${userId} authenticated and connected via WebSocket.`);

  const notificationListener = (message:string) => {
    console.log(`notifying ${userId} with message: ${message}`)
    socket.send(JSON.stringify({ type: 'notification', data: message }))
  }

  await subClient.subscribe(`notifications:${userId}`,notificationListener )

  socket.on('message', async (rawMessage: string) => {
    try {
      const data = JSON.parse(rawMessage)
      const receiverId = Number(data.receiverId)
      // {
      //    "receiverId": 20,
      //    "message": "hi"
      // }
  
      const savedMessage = await prismaClient.messages.create({
        data: {
          senderId: userId!,
          receiverId: receiverId,
          message: data.message
        }
      })
  
      const receiverSocket = activeSockets.get(receiverId)
      if(receiverSocket?.readyState == WebSocket.OPEN){
        receiverSocket.send(JSON.stringify({ type: 'message', message: savedMessage.message, receiverId: savedMessage.receiverId, createdAt: savedMessage.createdAt }))
      }
    } catch (error) {
      console.log(error)
    }
  })

  socket.on('close', async () => {
    console.log(`user ${userId} disconnected`)
    activeSockets.delete(userId!);
    await subClient.unsubscribe(`notifications:${userId}`)
  })

})

