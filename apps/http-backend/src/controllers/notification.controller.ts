import { prismaClient } from '@repo/db/client';
import { Request, Response } from 'express'

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.userId; 
  try {
    const unreadNotifications = await prismaClient.notifications.findMany({
      where: {
        receiverId: userId,
        isRead: false
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { id: true, message: true, createdAt: true, senderId: true }
    });
    // here give only 5 first then show loading circle, then more 5 like that

    return res.json({ notifications: unreadNotifications });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Failed to fetch notifications" });
  }
}