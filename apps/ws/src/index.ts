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
    (socket as any).isAlive = true;
    socket.on('pong', () => {
        (socket as any).isAlive = true;
    });
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
const interval = setInterval(() => {
    wss.clients.forEach((socket) => {
        if ((socket as any).isAlive === false) {
            return socket.terminate(); // Kill dead connections
        }
        
        // Assume they are dead until they reply
        (socket as any).isAlive = false; 
        socket.ping(); // Send a hidden network ping
    });
}, 25000); // 25 seconds

wss.on('close', () => {
    clearInterval(interval);
});




















// decoupling websocket server from database:
//  The Message Flow:
// Send: A client sends a message to the WebSocket server.
// Publish: The WebSocket server receives the message and immediately publishes it to a message broker or queue (e.g., Redis).
// Broadcast: The message broker pushes the message to the intended recipient(s) in real-time.
// Save: A background worker or consumer service picks up the message from the queue and saves it to the main database.

// Batch/Bulk Saving: Instead of saving every message one by one, the background worker collects messages in memory and bulk-inserts them into the database every few seconds. This drastically reduces database load.







// Adjust Proxy Timeouts:If using NGINX, increase the proxy_read_timeout and proxy_send_timeout in your configuration to allow longer idle periods.
// Automatic Reconnection Logic:Since WebSockets are inherently fragile, you should always implement client-side logic to detect a closed connection and automatically attempt to reconnect after a short delay.
// Check for SSL Issues:If you are using wss://, ensure your SSL certificates are valid, as invalid handshakes will immediately terminate the attempt