import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";

export const giveStar = async (req: Request, res: Response) => {
  const userId = req.userId
  const submitId = parseInt(req.params.id as string)
  try {
    const star = await prismaClient.stars.create({
      data: {
        submitId: submitId,
        userId: (userId as number)
      }
    })

    return res.status(201).json({ star })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: "Star Already given" });
    }
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteStar = async (req: Request, res: Response) => {
  const userId = req.userId
  const submitId = parseInt(req.params.id as string)
  try {
    const deleted = await prismaClient.stars.deleteMany({
      where: {
        submitId: submitId,
        userId: (userId as number)
      }
    })

    return res.status(201).json({ deleted })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return res.status(409).json({ message: "Can't remove the star" });
    }
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};