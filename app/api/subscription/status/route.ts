import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      console.error('No authenticated user found');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    console.log('Checking subscription status:', {
      orderId,
      userId: user.id
    });

    if (!orderId) {
      console.error('No orderId provided in request');
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        razorpayOrderId: orderId,
        userId: user.id
      },
      include: {
        payments: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });

    console.log('Subscription lookup result:', {
      found: !!subscription,
      orderId,
      userId: user.id,
      status: subscription?.status,
      paymentCount: subscription?.payments.length
    });

    if (!subscription) {
      return NextResponse.json({ status: 'PENDING' });
    }

    // Check latest payment status
    const latestPayment = subscription.payments[0];
    const isSuccessful = latestPayment?.status === 'SUCCESS';

    console.log('Payment status check:', {
      subscriptionId: subscription.id,
      hasPayment: !!latestPayment,
      paymentStatus: latestPayment?.status,
      isSuccessful
    });

    return NextResponse.json({
      status: isSuccessful ? 'ACTIVE' : subscription.status,
      activatedAt: subscription.activatedAt,
      paymentStatus: latestPayment?.status || 'PENDING'
    });

  } catch (error) {
    console.error('Failed to check subscription status:', error);
    return NextResponse.json(
      { error: "Failed to check subscription status", details: error },
      { status: 500 }
    );
  }
}
