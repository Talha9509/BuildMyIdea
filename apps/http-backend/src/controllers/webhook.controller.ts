import { prismaClient } from '@repo/db/client'
import { Request, Response } from 'express'
import crypto from "crypto";

export const ownerProjectPayment = async (req: Request, res: Response) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers["x-razorpay-signature"] as string;

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (generatedSignature != signature) {
    return res.status(400).json({ error: "Invalid Signature" })
  }

  console.log(req.body)
  console.log(JSON.stringify(req.body))
  console.log(req.body.event)

  const event = req.body.event

  try {
    if (event == "order.paid" || "payment.captured") {
      const payment = req.body.payload.payment.entity;
      const orderId = payment.order_id;

      const dbpayment = await prismaClient.payments.update({
        where: { razorpayOrderId: orderId },
        data: {
          status: "Success",
          razorpayPaymentId: payment.id,
          project: {
            update: { paymentStatus: "Paid" }
          }
        }
      })
    }
    res.json({ message: "ok" })
  } catch (error) {
    console.log(error)
  }
}