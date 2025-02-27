import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { PlanType } from "@/types";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, amount } = await req.json();

    // Generate internal order ID
    const internalOrderId = crypto.randomBytes(16).toString('hex');

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: internalOrderId,
      notes: {
        planId,
        userId: user.id
      }
    });

    // Create subscription with both IDs
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: planId as PlanType,
        orderId: internalOrderId,
        razorpayOrderId: razorpayOrder.id,  // Store Razorpay order ID
        status: 'PENDING',
        amount: amount,
      },
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      subscriptionId: subscription.id,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      prefill: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
