import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = headers();
    const signature = headersList.get('x-razorpay-signature');
    
    // Debug logging
    console.log('========= WEBHOOK REQUEST =========');
    console.log('Headers:', Object.fromEntries(headersList.entries()));
    console.log('Body:', body.substring(0, 200) + '...');

    if (!signature) {
      console.error('No signature provided');
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest('hex');

    console.log('Signature verification:', {
      received: signature,
      expected: expectedSignature,
      match: signature === expectedSignature
    });

    if (signature !== expectedSignature) {
      console.error('Invalid signature');
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    console.log('Event type:', event.event);
    console.log('Payment details:', event.payload?.payment?.entity);

    // Handle payment success
    if (event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const { order_id, id: payment_id, status } = paymentEntity;

      console.log(`Processing payment: ${payment_id} for order: ${order_id}`);

      // Find subscription
      const subscription = await prisma.subscription.findFirst({
        where: { razorpayOrderId: order_id }
      });

      if (!subscription) {
        console.error(`Subscription not found for order: ${order_id}`);
        return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
      }

      try {
        // Use transaction
        const [updatedSubscription, payment] = await prisma.$transaction([
          prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              status: 'ACTIVE',
              paymentId: payment_id,
              activatedAt: new Date(),
            },
          }),
          prisma.payment.create({
            data: {
              subscriptionId: subscription.id,
              razorpayId: payment_id,
              amount: paymentEntity.amount,
              currency: paymentEntity.currency,
              status: 'SUCCESS',
            },
          })
        ]);

        console.log('Payment processed successfully:', {
          subscriptionId: subscription.id,
          paymentId: payment_id,
          subscriptionStatus: updatedSubscription.status,
          paymentStatus: payment.status
        });

      } catch (txError) {
        console.error('Transaction failed:', txError);
        throw txError;
      }
    }

    return NextResponse.json({ 
      status: "success",
      message: "Webhook processed successfully"
    });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: error },
      { status: 500 }
    );
  }
}
