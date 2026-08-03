
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

  const gatewayFee = bounty * 0.0236; 
  const netReceived = bounty - gatewayFee;
  const platformFee = netReceived * 0.05
  const distributableBounty = netReceived - platformFee

  // make payments to each dev
  // create payment table row of payout 

  // get paymentid from payments table 
  const payment = await prismaClient.payments.findFirst({
    where: { paymentType: 'Deposit', projectId: projectId, status: 'Success' },
    select: { razorpayPaymentId: true }
  })

  const alreadyPaid = await prismaClient.payments.findMany({
    where: {
      projectId: projectId,
      status: 'Success',
      paymentType: 'Payout',
      devId: { in: contributors.map((contributor: contributorType) => contributor.devId) }
    }
  })

  const paidDevIds = new Set(alreadyPaid.map((p: any) => p.devId));
  const unpaidContributors = contributors.filter((c: contributorType) => !paidDevIds.has(c.devId));

  if (unpaidContributors.length === 0) {
    console.log("[Payouts] All contributors have already been paid. Skipping.");
    return "All contributors had already been paid";
  }

  const transferPayloads = unpaidContributors.map((contributor: contributorType) => {
    let devCut = Math.floor(distributableBounty * (contributor.contributionPercent / 100))
    console.log(devCut)

    return {
      account: contributor.razorpayAccountId,
      amount: devCut,
      currency: 'INR',
      notes: {
        projectId: projectId.toString(),
        devId: contributor.devId 
      }
    };
  });
  console.log("FINAL PAYLOAD:", JSON.stringify({ transfers: transferPayloads }, null, 2));

  let transferResponse;
  try {
    transferResponse = await razorpay.payments.transfer(payment?.razorpayPaymentId!, {
      transfers: transferPayloads
    });
  } catch (error) {
    console.error("[Payouts] Razorpay bulk transfer failed at Gateway!", error);
    throw new Error(JSON.stringify(error)); 
  }

  const paymentRecords = transferResponse.items.map((transferObj: any) => {
    return {
      projectId: projectId,
      ownerId: ownerId,
      devId: transferObj.notes.devId, 
      paymentType: 'Payout' as const,
      razorpayTransferId: transferObj.id,
      status: "Success" as const
    };
  });

  await prismaClient.payments.createMany({ data: paymentRecords });

  await prismaClient.project.update({
    where: { id: projectId, winnerSubmitId: winnerSubmitId },
    data: { paymentStatus: "Completed" }
  });
  return "All Payouts completed successfully";
}, {
  connection: bullMQConnection
})

payoutWorker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} failed with error ${err.message}`)
})
