import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import { updateUserSchema } from "@repo/common/types";

export const editProfile = async (req: Request, res: Response) => {
  const userId = req.userId
  if (typeof userId != 'number') {
    return res.status(401).json({ message: "Unauthourized" })
  }
  const validated = updateUserSchema.safeParse(req.body)
  if (!validated.success) {
    return res.status(400).json({ message: "Invalid Inputs" })
  }
  console.log(validated.data)

  const { role, ...otherFields } = validated.data

  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { owner: true, dev: true }
    })
    if (!user) {
      return res.status(404).json({ message: "User Not Found" })
    }

    let currentRole: "DEV" | "OWNER" | null = null
    console.log(user.owner, user.dev)
    // if you want to keep role in user table, then make use of it
    if (user.owner) currentRole = "OWNER"
    if (user.dev) currentRole = "DEV"

    if (role && role == currentRole) {
      if (Object.keys(otherFields).length > 0) {
        await prismaClient.user.update({
          where: { id: userId },

          data: validated.data,
        });
      }
      return res.json({ message: "Profile Updated", role: currentRole });
    }
    if (currentRole === "DEV" && user.dev) {
      // check if he has submits. as submit.count
      const hasSubmits = await prismaClient.submissionContributor.count({
        where: { devId: user.dev?.id }
      })
      if (hasSubmits > 0) {
        return res.status(409).json({ message: "Cannot Change Roles with Active Submits" })
      }
    }
    if (currentRole === "OWNER" && user.owner) {
      const hasProjects = await prismaClient.project.count({
        where: { ownerId: user.owner?.id }
      })
      if (hasProjects > 0) {
        return res.status(409).json({ message: "Cannot Change Roles with Active Projects" })
      }
    }
    const result = await prismaClient.$transaction(async (txn) => {
      if (currentRole === "DEV") {
        await txn.dev.delete({ where: { userId } })
      }
      if (currentRole === "OWNER") {
        await txn.owner.delete({ where: { userId } })
      }
      if (role === "DEV") {
        await txn.dev.create({ data: { userId } });
      }

      if (role === "OWNER") {
        await txn.owner.create({ data: { userId } });
      }
      if (Object.keys(otherFields).length > 0) {
        await txn.user.update({
          where: { id: userId },

          data: validated.data
        })
      }
      return { role: role }
    })
    return res.status(200).json({ message: "Profile Updated", role: result?.role })
  } catch (error: any) {
    if (error.code == 'P2002') {
      return res.status(409).json({ message: "That username is already in use. Please enter a unique username" })
    }
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getMyProfile = async (req: Request, res: Response) => {
  const userId = req.userId
  // same profile will be shown to user and others. only difference is, user can edit his profile
  // for checking others profile, email and phone will only be visible when both are connected
  try {
    const user = await prismaClient.user.findUnique({
      relationLoadStrategy: 'join',
      where: { id: userId },
      select: {
        email: true, name: true, job: true, phone: true, role: true, username: true,
        _count: {
          select: {
            senders: {
              where: { status: 'Connected' }
            },
            receivers: {
              where: { status: 'Connected' }
            }
          },
        },
        owner: {
          select: {
            projects: {
              select: { name: true, description: true, mainFeature: true, id: true, skillsreq: true, refrenceLink: true }
            }
          }
        },
        dev: {
          select: {
            contributions: {
              select: {
                submission: {
                  select: {
                    repoLink: true, liveLink: true, id: true,
                    _count: {
                      select: { stars: true }
                    },
                    stars: {
                      where: { userId: userId }
                    },
                    project: {
                      select: { name: true, id: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })
    // in profile, i also want the profile's projects, if owner, then owner/posted projects and vice versa
    return res.json({ message: "Done", user })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

export const getProfilebyId = async (req: Request, res: Response) => {
  const userId = (req.userId as number)
  const id = parseInt((req.params.id) as string)
  // same profile will be shown to user and others. only difference is, user can edit his profile
  // for checking others profile, email and phone will only be visible when both are connected

  const [user, connections] = await Promise.all([
    prismaClient.user.findUnique({
      relationLoadStrategy: 'join',
      where: { id: id },
      select: {
        name: true, job: true, role: true, username: true,
        _count: {
          select: {
            senders: {
              where: {
                status: 'Connected',
              }
            },
            receivers: {
              where: {
                status: 'Connected'
              }
            }
          }
        },
        owner: {
          select: {
            projects: {
              select: {
                name: true, description: true, skillsreq: true, id: true, mainFeature: true
              }
            }
          }
        },
        dev: {
          select: {
            contributions: {
              select: {
                submission: {
                  select: {
                    repoLink: true, liveLink: true, id: true,
                    _count: {
                      select: {
                        stars: true
                      }
                    },
                    project: {
                      select: {
                        id: true, name: true
                      }
                    },
                    stars: {
                      where: {
                        userId: userId,
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }),
    prismaClient.connect.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: id },
          { senderId: id, receiverId: userId }
        ]
      },
      select: { status: true, senderId: true }
    })
  ])
  // in profile, i also want the profile's projects, if owner, then owner/posted projects and vice versa
  return res.status(200).json({ message: "Done", user, connections })
}

export const getProfilebySearch = async (req: Request, res: Response) => {
  console.log("profile searching")
  const query = (req.query.search as string)
  try {
    const profiles = await prismaClient.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive'
        }
      }, take: 6,
      select: { username: true, id: true, role: true, job: true }
    })
    return res.json(profiles)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
}