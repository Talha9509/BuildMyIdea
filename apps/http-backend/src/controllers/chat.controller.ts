import { prismaClient } from '@repo/db/client'
import { Request, Response } from 'express'

export const getChatsbyId = async ( req: Request, res: Response ) => {
  const id = Number(req.params.id)
	const userId = req.userId

	try {
		const messageHistory = await prismaClient.messages.findMany({
			where: {
				OR: [
					{ senderId: userId, receiverId: id },
					{ senderId: id, receiverId: userId }
				]
			}, orderBy: {
				createdAt: 'asc'
			}, take: 30,
			select: {	id: true, createdAt: true, message: true }
		})
		return res.json({ messageHistory })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Internal Server Error" })
	}
}