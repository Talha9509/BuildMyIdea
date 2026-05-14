import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";

export const sendConnectReq = async( req:Request, res: Response) => {
  const userId= req.userId;
  // send body like this from fe
  // {
  // "requester_id": "123",
  // "target_id": "456"
  // }
  const senderId= req.body.sender_id;
  const receiverId= req.body.receiver_id;

  // if(senderId===receiverId){
  //   return res.status(403).json({ message:"Can't connect to youreslf" })
  // }
  
  try {
    const [sender, receiver]= await Promise.all([
      prismaClient.user.findUnique({ where:{ id:senderId }}),
      prismaClient.user.findUnique({ where:{ id: receiverId }})
    ])  
    if(!sender){
      return res.status(403).json({ message: "User" })
    }
    if(!receiver){
      return res.status(404).json({ message: "There is no one to Connect" })
    }

    const connection= await prismaClient.connect.create({
      data:{
        senderId: senderId,
        receiverId: receiverId,
        status:'Pending'
      }
    })
    return res.status(201).json({ message:"Done", connection })
  } catch (error:any) {
    return res.status(500).json({ message:"Internal Server Error" })
  }
}

export const updateConnect = async (req:Request, res:Response ) => {
  const userId= req.userId;
  // send body like this from fe
  // {
  // "requester_id": "123",
  // "target_id": "456",
  // "status": 'eother block, disconnect,connect'
  // }
  const senderId = req.body.sender_id;
  const receiverId = req.body.receiver_id;
  const status= req.body.status;

  // if(senderId===receiverId){
  //   return res.status(403).json({ message:"Can't connect to youreslf" })
  // }

  try {
    const [sender, receiver]= await Promise.all([
      prismaClient.user.findUnique({ where:{ id:senderId }}),
      prismaClient.user.findUnique({ where:{ id: receiverId }})
    ])  
    if(!sender){
      return res.status(403).json({ message: "User" })
    }
    if(!receiver){
      return res.status(404).json({ message: "There is no one to Connect" })
    }

    const updatedConnection= await prismaClient.connect.update({
      where:{
        senderId_receiverId:{
          senderId: senderId,
          receiverId: receiverId
        }
      },
      data:{
        status: status
      }
    })
    return res.status(201).json({ updatedConnection })
  } catch (error:any) {
    return res.status(500).json({ message:"Internal Server Error" })
  }

}

export const withdrawConnect = async ( req:Request, res:Response ) => {
  const userId= req.userId;
  // send body like this from fe
  // {
  // "requester_id": "123",
  // "target_id": "456",
  // "status": 'withdraw'
  // }
  const senderId = req.body.sender_id;
  const receiverId = req.body.receiver_id;
  const status= req.body.status;

  // if(senderId===receiverId){
  //   return res.status(403).json({ message:"Can't connect to youreslf" })
  // }

  try {
    const [sender, receiver]= await Promise.all([
      prismaClient.user.findUnique({ where:{ id:senderId }}),
      prismaClient.user.findUnique({ where:{ id: receiverId }})
    ])  
    if(!sender){
      return res.status(403).json({ message: "User" })
    }
    if(!receiver){
      return res.status(404).json({ message: "There is no one to Connect" })
    }

    const updatedConnection= await prismaClient.connect.update({
      where:{
        senderId_receiverId:{
          senderId: senderId,
          receiverId: receiverId
        }
      },
      data:{
        status: status
      }
    })
    return res.status(201).json({ updatedConnection })
  } catch (error:any) {
    return res.status(500).json({ message:"Internal Server Error" })
  }


}

export const disConnect = async ( req:Request, res:Response ) => {
  const userId= req.userId;
  // send body like this from fe
  // {
  // "requester_id": "123",
  // "target_id": "456",
  // "status": 'withdraw'
  // }
  const senderId = req.body.sender_id;
  const receiverId = req.body.receiver_id;
  const status= req.body.status;

  // if(senderId===receiverId){
  //   return res.status(403).json({ message:"Can't connect to youreslf" })
  // }

  try {
    const [sender, receiver]= await Promise.all([
      prismaClient.user.findUnique({ where:{ id:senderId }}),
      prismaClient.user.findUnique({ where:{ id: receiverId }})
    ])  
    if(!sender){
      return res.status(403).json({ message: "User" })
    }
    if(!receiver){
      return res.status(404).json({ message: "There is no one to Connect" })
    }

    const disconnected= await prismaClient.connect.delete({
      where:{
        senderId_receiverId:{
          senderId: senderId,
          receiverId: receiverId
        }
      }
    })
    return res.status(201).json({ disconnected })
  } catch (error:any) {
    return res.status(500).json({ message:"Internal Server Error" })
  }


}









// validate mssage which comes from websoket
// To make it safe, you must treat all incoming WebSocket messages as untrusted input.
// 1. Use wss:// (Secure WebSockets): Always use WebSocket Secure (wss://) instead of ws:// in production. This encrypts data, preventing man-in-the-middle attacks.
// 2.Validate and Sanitize Input: Never directly execute queries using user input. Use parameterized queries or ORMs to prevent SQL injection.
// 3.Authenticate Connections: Authenticate users during the initial HTTP upgrade handshake (e.g., using JWT tokens) before allowing a persistent WebSocket connection.
// 4.Use Proper Authorization: Ensure the authenticated user has permission to read/write to the specific database table or chat room they are accessing.
// 5.Use a Secure Architecture (Broker Pattern): Rather than having every WebSocket client try to connect directly to the database, use an intermediary like Redis or Kafka.Client \(\rightarrow \) WebSocket Server \(\rightarrow \) Event Bus (Redis/Kafka) \(\rightarrow \) Database.
// 6.Rate Limiting: Protect your server from Denial of Service (DoS) attacks by setting limits on the number of connections and messages per user.
