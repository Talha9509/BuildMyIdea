
import { Worker } from 'bullmq'
import { prismaClient } from '@repo/db/client'
import { bullMQConnection } from '@repo/redis/client'
import Razorpay from 'razorpay';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay API keys are missing in environment variables');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

type contributorType = {
  devId: number,
  contributionPercent: number,
  razorpayAccountId: string
}

const payoutWorker = new Worker("payouts", async (job) => {
  const { projectId, winnerSubmitId, ownerId, contributors, bounty } = job.data

  console.log("paying")

  const platformFee = bounty * 0.05
  const distributableBounty = bounty - platformFee

  // make payments to each dev
  // create payment table row of payout 

  const payout = contributors.map(async (contributor: contributorType) => {
    let alreadyPaid = await prismaClient.payments.findFirst({
      where: {
        projectId: projectId,
        devId: contributor.devId,
        paymentType: "Payout",
        status: "Success"
      }
    });

    console.log(alreadyPaid)

    if (alreadyPaid) {
      console.log(`Dev ${contributor.devId} was already paid, Skipping`);
      return `Already Paid Dev ${contributor.devId}`;
    }

    let devCut = Math.floor(distributableBounty * (contributor.contributionPercent / 100))
    console.log(devCut)

    const transfer = await razorpay.transfers.create({
      account: contributor.razorpayAccountId,
      currency: "INR",
      amount: devCut,
      notes: { projectId: projectId.toString() }
    })

    console.log(transfer)

    await prismaClient.payments.create({
      data: {
        projectId: projectId,
        ownerId: ownerId,
        devId: contributor.devId,
        paymentType: "Payout",
        razorpayTransferId: transfer.id,
        status: "Success"
      }
    })
    return `Paid Dev ${contributor.devId}`
  })

  const results = await Promise.allSettled(payout)

  const failures = results.filter(res => res.status == "rejected")
  if (failures.length > 0) {
    console.error(`[Payouts] ${failures.length} transfers failed!`, failures);
    throw new Error("Some transfers failed. Check logs.");
  }

  await prismaClient.project.update({
    where: { id: projectId, winnerSubmitId: winnerSubmitId },
    data: { paymentStatus: "Completed" }
  })
  return "All Payouts completed successfully";
}, {
  connection: bullMQConnection
})

payoutWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error ${err.message}`)
})
