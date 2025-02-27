import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const { paymentId, orderId, signature } = await req.json();

    // Verify signature
    const text = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(text)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error('Invalid signature in verification');
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);
    
    if (payment.status !== 'captured') {
      throw new Error('Payment not captured');
    }

    // Update subscription and create payment record
    const subscription = await prisma.subscription.findFirst({
      where: { razorpayOrderId: orderId }
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    // Use transaction to update subscription and create payment record
    const [updatedSubscription, paymentRecord] = await prisma.$transaction([
      prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'ACTIVE',
          paymentId,
          activatedAt: new Date(),
        },
      }),
      prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          razorpayId: paymentId,
          amount: payment.amount,
          currency: payment.currency,
          status: 'SUCCESS',
        },
      })
    ]);

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      payment: paymentRecord
    });

  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
