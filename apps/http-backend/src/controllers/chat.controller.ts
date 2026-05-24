import { prismaClient } from '@repo/db/client'
import { Request, Response } from 'express'

export const getChatsbyId = async (req: Request, res: Response) => {
	const id = Number(req.params.id)
	const userId = req.userId

	try {
		const [messageHistory, receiverName, notConnected] = await Promise.all([
			prismaClient.messages.findMany({
				where: {
					OR: [
						{ senderId: userId, receiverId: id },
						{ senderId: id, receiverId: userId }
					]
				}, orderBy: {
					createdAt: 'asc'
				}, take: -15,
				select: { id: true, createdAt: true, message: true, receiverId: true }
			}),
			prismaClient.user.findUnique({
				where: { id: id },
				select: { name: true }
			}),
			prismaClient.connect.findFirst({
				where: {
					OR: [
						{ senderId: id, receiverId: userId },
						{ senderId: userId, receiverId: id }
					] , status:'Connected'
				}
			})
		])
		return res.json({ messageHistory, receiverName, notConnected })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: "Internal Server Error" })
	}
}