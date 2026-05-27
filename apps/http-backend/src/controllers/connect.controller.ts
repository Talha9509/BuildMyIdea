import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import { pubClient } from '@repo/redis/client'

export const sendConnectReq = async (req: Request, res: Response) => {
  const userId = Number(req.userId);
  // send body like this from fe
  // {
  // "requester_id": "123",
  // "target_id": "456"
  // }
  const receiverId = Number(req.body.receiver_id);

  if (userId === receiverId) {
    return res.status(403).json({ message: "Can't connect to youreslf" })
  }

  try {
    const [sender, receiver] = await Promise.all([
      prismaClient.user.findUnique({ where: { id: userId } }),
      prismaClient.user.findUnique({ where: { id: receiverId } })
    ])
    if (!sender) {
      return res.status(403).json({ message: "User" })
    }
    if (!receiver) {
      return res.status(404).json({ message: "There is no one to Connect" })
    }

    console.log("checking connection exists?")
    const connectionExists = await prismaClient.connect.findFirst({
      where: {
        OR: [
          { senderId: receiverId, receiverId: userId },
          { senderId: userId, receiverId: receiverId}
        ]
      }
    })
    console.log("exists: "+connectionExists)
    if (connectionExists) {
      console.log("status: "+connectionExists.status)
      // if (connectionExists?.status == 'Disconnected' || 'Rejected') {
      //   console.log("connecting from dis")
      //   const [updatedConnection, notification] = await prismaClient.$transaction([
      //     prismaClient.connect.update({
      //       where: {
      //         senderId_receiverId: {
      //           senderId: userId,
      //           receiverId: receiverId
      //         }
      //       },
      //       data: { status: 'Pending' }
      //     }),
      //     prismaClient.notifications.create({
      //       data: {
      //         userId: receiverId,
      //         message: `Connection Request from ${sender.name}`
      //       }
      //     })
      //   ])

      //   await pubClient.publish(`notifications:${receiverId}`, JSON.stringify(notification.message))

      //   return res.json({ updatedConnection })
      // }
      return res.status(409).json({ message: "You already have the connection request" })
    }

    const [connection, notification] = await prismaClient.$transaction([
      prismaClient.connect.create({
        data: {
          senderId: userId,
          receiverId: receiverId,
          status: 'Pending'
        }
      }),
      prismaClient.notifications.create({
        data: {
          message: `Connection Request from ${sender.name}`,
          userId: receiverId
        }
      })
    ])

    await pubClient.publish(`notifications:${receiverId}`, JSON.stringify(notification.message));

    return res.status(201).json({ message: "Done", connection })
  } catch (error: any) {
    // if (error.code = 'P2002') {
    //   console.log(error)
    //   return res.status(409).json({ message: `You already have the connection request` })
    // }
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const updateConnect = async (req: Request, res: Response) => {
  const userId = Number(req.userId);
  // send body like this from fe
  // {
  // "target_id": "456",
  // "status": 'eother block, disconnect,connect'
  // }
  // const senderId = req.body.sender_id;
  const receiverId = Number(req.body.receiver_id);
  const status = req.body.status;

  if (userId === receiverId) {
    return res.status(403).json({ message: "Can't connect to youreslf" })
  }

  try {
    const [sender, receiver] = await Promise.all([
      prismaClient.user.findUnique({ where: { id: userId } }),
      prismaClient.user.findUnique({ where: { id: receiverId } })
    ])
    if (!sender) {
      return res.status(403).json({ message: "User" })
    }
    if (!receiver) {
      return res.status(404).json({ message: "There is no one to Connect" })
    }

    if (status == 'Blocked') {
      return res.status(409).json({ message: "You are Blocked" })
    }

    const [updatedConnection, notification] = await prismaClient.$transaction([
      prismaClient.connect.updateMany({
        where: {
           OR: [
          { senderId: receiverId, receiverId: userId },
          { senderId: userId, receiverId: receiverId}
        ]},
        data: {
          status: status
        }
      }),
      prismaClient.notifications.create({
        data: {
          userId: receiverId,
          message: `${status=='Pending' ? `Connection Request from ${sender.name}` : `You are ${status} with ${sender.name}` }`
        }
      })
    ])

    // accepted, disconnected, rejected notifications not coming
    await pubClient.publish(`notifications:${receiverId}`, JSON.stringify(notification.message))

    return res.json({ updatedConnection })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const blockConnect = async (req: Request, res: Response) => {
  const userId = req.userId;
  // send body like this from fe
  // {
  // "requester_id": "123",
  // "target_id": "456",
  // "status": 'withdraw'
  // }
  const senderId = req.body.sender_id;
  const receiverId = req.body.receiver_id;
  const status = req.body.status;

  if (senderId === receiverId) {
    return res.status(403).json({ message: "Can't connect to youreslf" })
  }

  try {
    const [sender, receiver] = await Promise.all([
      prismaClient.user.findUnique({ where: { id: senderId } }),
      prismaClient.user.findUnique({ where: { id: receiverId } })
    ])
    if (!sender) {
      return res.status(403).json({ message: "User" })
    }
    if (!receiver) {
      return res.status(404).json({ message: "There is no one to Connect" })
    }

    const [blocked, notification] = await prismaClient.$transaction([
      prismaClient.connect.update({
        where: {
          senderId_receiverId: {
            senderId: senderId,
            receiverId: receiverId
          }
        }, data: {
          status: 'Blocked'
        }
      }),
      prismaClient.notifications.create({
        data: {
          userId: receiverId,
          message: `You are Blocked by ${sender.name}`
        }
      })
    ])

    await pubClient.publish(`notifications:${receiverId}`, JSON.stringify(notification.message))

    return res.status(201).json({ blocked })
  } catch (error: any) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const withdrawConnect = async (req: Request, res: Response) => {
  const userId = Number(req.userId);
  // send body like this from fe
  // {
  // "requester_id": "123",
  // "target_id": "456",
  // "status": 'withdraw'
  // }
  const receiverId = Number(req.body.receiver_id);
  const status = req.body.status;

  if (userId === receiverId) {
    return res.status(403).json({ message: "Can't connect to youreslf" })
  }

  try {
    const [sender, receiver] = await Promise.all([
      prismaClient.user.findUnique({ where: { id: userId } }),
      prismaClient.user.findUnique({ where: { id: receiverId } })
    ])
    if (!sender) {
      return res.status(403).json({ message: "User" })
    }
    if (!receiver) {
      return res.status(404).json({ message: "There is no one to Connect" })
    }

    // if sender!=userId:cant withdraw

    const [updatedConnection, notification] = await prismaClient.$transaction([
      prismaClient.connect.delete({
        where: {
          senderId_receiverId: {
            senderId: userId,
            receiverId: receiverId,
          },
          status: 'Pending'
        }
      }),
      prismaClient.notifications.create({
        data: {
          userId: userId,
          message: `Your connect request to ${receiver.name} is withdrawn`
        }
      })
    ])

    await pubClient.publish(`notifications:${userId}`, JSON.stringify(notification.message))

    return res.json({ updatedConnection })
  } catch (error: any) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}








