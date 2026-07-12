import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import { submitSchema } from "@repo/common/types";

export const createSubmit = async (req: Request, res: Response) => {
  const userId = req.userId
  const projectId = parseInt(req.params.id as string)

  if (typeof userId != 'number') {
    return res.status(401).json({ message: "Unauthorized" })
  }
  console.log(userId)

  const validated = submitSchema.safeParse(req.body)
  console.log(validated)
  if (!validated.success) {
    return res.status(400).json({ message: "Invalid Inputs" })
  }


  // {
  //   "liveLink": "https://awesome-project.vercel.app",
  //     "repoLink": "https://github.com/alice/awesome-project",
  //       "noofContributors": 3,
  //         "items": [
  //           {
  //             "username": "AliceSmith",
  //             "contribution": 40
  //           },
  //           {
  //             "username": "BobJones",
  //             "contribution": 35
  //           },
  //           {
  //             "username": "CharlieDev",
  //             "contribution": 25
  //           }
  //         ]
  // }

  try {
    const [dev, project] = await Promise.all([
      prismaClient.dev.findUnique({ where: { userId: userId } }),
      prismaClient.project.findUnique({ where: { id: projectId } })
    ])
    console.log(dev)
    if (!dev) {
      return res.status(403).json({ message: "Only Developers are allowed for Submissions" })
    }
    if (!project) {
      return res.status(404).json({ message: "Project Not Found" })
    }

    let contributorsData: any[] = [];
    const isTeam = validated.data.items && validated.data.items.length > 0;

    if (!isTeam) {
      contributorsData.push({
        devId: dev.id,
        projectId: projectId,
        contributionPercent: 100,
        contributionRole: "Leader"
      });
    } else {
      if (validated.data.items == undefined) {
        return res.status(401).json({ message: "no" })
      }
      const usernames = validated.data.items.map(item => item.username);
      console.log("usernames " + usernames)

      const teamDevs = await prismaClient.dev.findMany({
        where: { user: { username: { in: usernames } } },
        include: { user: { select: { username: true } } }
      });
      console.log("teamdevs " + JSON.stringify(teamDevs))

      if (teamDevs.length !== usernames.length) {
        const foundUsernames = teamDevs.map(td => td.user.username);
        const missing = usernames.filter(un => !foundUsernames.includes(un));
        return res.status(404).json({ message: `Devs not found: ${missing.join(', ')}` });
      }

      const isSubmitterInTeam = teamDevs.some(td => td.id === dev.id);
      console.log("submitter inteam " + isSubmitterInTeam)
      if (!isSubmitterInTeam) {
        return res.status(403).json({ message: "You cannot submit a team project without including yourself." });
      }

      contributorsData = validated.data.items.map(item => {
        const matchedDev = teamDevs.find(td => td.user.username === item.username)!;
        return {
          devId: matchedDev.id,
          projectId: projectId,
          contributionPercent: item.contribution,
          contributionRole: item.contributionRole
        };
      });
      console.log("constributed data " + JSON.stringify(contributorsData))
    }


    const submit = await prismaClient.submit.create({
      data: {
        repoLink: validated.data.repoLink,
        liveLink: validated.data.liveLink,
        projectId: projectId,
        NoofContributors: validated.data.NoofContributors || 1,
        contributors: { create: contributorsData }
      }
    })

    return res.status(201).json({ message: "Done", submit })
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log(error)
      // if in team, a dev has already contributed. but another dev is adding that devs name then that error.
      console.log("meta " + JSON.stringify(error.meta))

      const cause = error.meta.driverAdapterError.cause
      console.log(cause)

      if (cause.originalMessage.includes('projectId') && cause.originalMessage.includes('devId')) {
        return res.status(409).json({ message: "You already submitted to this project" })
      }
      if (cause.originalMessage.includes('repoLink')) {
        return res.status(403).json({ message: "Repo Link can't be same" })
      }
    }
    console.log(error)
    return res.status(500).json({ message: "Internal server Error" })
  }
};

export const updateSubmit = async (req: Request, res: Response) => {
  const userId = req.userId
  const submitId = parseInt(req.params.id as string)

  if (typeof userId != 'number') {
    return res.status(401).json({ message: "Unauthorized" })
  }
  console.log(userId)

  const validated = submitSchema.safeParse(req.body)
  console.log(validated)
  if (!validated.success) {
    return res.status(400).json({ message: "Invalid Inputs" })
  }
  console.log("data " + validated.data)

  if (Object.keys(validated.data).length === 0) {
    return res.status(400).json({ message: "Nothing to be changed" })
  }

  try {
    const dev = await prismaClient.dev.findUnique({
      where: { userId: userId }
    })
    if (!dev) {
      return res.status(403).json({ message: "Idea Creators not allowed to Edit" })
    }

    
    const isLeader = await prismaClient.submit.findFirst({
      where: { id: submitId, contributors: { some: { devId: dev.id, contributionRole: "Leader" } } },
    })
    if (!isLeader) {
      return res.status(403).json({ message: "Only Team Leaders are allowed to Edit the submission" })
    }

    let contributorsData: any[] = [];
    const isTeam = validated.data.items && validated.data.items.length > 0;

    if (!isTeam) {
      contributorsData.push({
        devId: dev.id,
        contributionPercent: 100,
        contributionRole: "Leader",
        projectId: isLeader.projectId
      });
    } else {
      if (validated.data.items == undefined) {
        return res.status(401).json({ message: "no" })
      }
      const usernames = validated.data.items.map(item => item.username);
      console.log("usernames " + usernames)

      const teamDevs = await prismaClient.dev.findMany({
        where: { user: { username: { in: usernames } } },
        include: { user: { select: { username: true } } }
      });
      console.log("teamdevs " + JSON.stringify(teamDevs))

      if (teamDevs.length !== usernames.length) {
        const foundUsernames = teamDevs.map(td => td.user.username);
        const missing = usernames.filter(un => !foundUsernames.includes(un));
        return res.status(404).json({ message: `Devs not found: ${missing.join(', ')}` });
      }

      const isSubmitterInTeam = teamDevs.some(td => td.id === dev.id);
      console.log("submitter inteam " + isSubmitterInTeam)
      if (!isSubmitterInTeam) {
        return res.status(403).json({ message: "You cannot submit a team project without including yourself." });
      }

      contributorsData = validated.data.items.map(item => {
        const matchedDev = teamDevs.find(td => td.user.username === item.username)!;
        return {
          devId: matchedDev.id,
          contributionPercent: item.contribution,
          contributionRole: item.contributionRole,
          projectId: isLeader?.projectId
        };
      });
      console.log("constributed data " + JSON.stringify(contributorsData))
    }

    const submit = await prismaClient.submit.update({
      where: { id: submitId },
      data: {
        NoofContributors: validated.data.NoofContributors || 1,
        contributors: {
          deleteMany: {},
          create: contributorsData
        }
      }
    })

    return res.json({ message: "Done", submit })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(403).json({ message: "Repo Link can't be same" })
    }
    console.log(error)
    return res.status(500).json({ message: "Internal server Error" })
  }
};

export const deleteSubmit = async (req: Request, res: Response) => {
  const userId = req.userId
  const submitId = parseInt(req.params.id as string)

  if (typeof userId != 'number') {
    return res.status(401).json({ message: "Unauthorized" })
  }
  console.log(userId)
  try {
    const dev = await prismaClient.dev.findUnique({
      where: { userId: userId }
    })
    if (!dev) {
      return res.status(403).json({ message: "Idea Creators not allowed to Delete" })
    }
    const submit = await prismaClient.submit.delete({
      where: { id: submitId, contributors: { some: { devId: dev.id, contributionRole: "Leader" } } }
    })
    if (!submit) {
      res.status(404).json({ message: "Not Allowed to Delete Submission" })
    }
    return res.json({ message: "Done", submit })
  } catch (error: any) {
    if (error.code == 'P2003') {
      return res.status(409).json({ message: "Can't Delete a Submission with Stars" })
    }
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" })
  }
};

export const getSubmitbyId = async (req: Request, res: Response) => {
  const userId = req.userId
  const submitId = parseInt(req.params.id as string)

  if (typeof userId != 'number') {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    const submit = await prismaClient.submit.findUnique({
      where: { id: submitId },
      select: {
        liveLink: true, repoLink: true, NoofContributors: true, id: true,
        project: {
          select: { name: true, id: true }
        },
        _count: {
          select: { stars: true }
        },
        contributors: {
          select: {
            contributionPercent: true, contributionRole: true,
            dev: {
              select: { id: true, user: { select: { username: true } } }
            }
          }
        }
      }
    })
    return res.json({ submit: submit, userId: userId })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}