import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { sendSubscriptionEmail } from '@/lib/email';
import logger from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const signature = request.headers.get('x-razorpay-signature');
    
    // If signature exists, treat as webhook
    if (signature) {
      return handleWebhook(request, signature);
    }

    // Otherwise, handle client-side verification
    return handleClientVerification(request);
  } catch (error) {
    logger.error('Payment verification failed:', error);
    return NextResponse.json({ 
      error: 'Payment verification failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function handleWebhook(request: Request, signature: string) {
  const body = await request.text();
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET!)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    logger.error('Invalid webhook signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const webhookBody = JSON.parse(body);
  const { payload } = webhookBody;
  
  // Process webhook
  const payment = payload.payment.entity;
  const order = payload.order.entity;

  if (payment.status !== 'captured') {
    logger.error('Payment not captured:', payment);
    return NextResponse.json({ error: 'Payment not captured' }, { status: 400 });
  }

  // Find and update subscription
  const subscription = await prisma.subscription.findUnique({
    where: { orderId: order.id },
    include: { user: true }
  });

  if (!subscription) {
    logger.error('Subscription not found:', { orderId: order.id });
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
  }

  // Create payment record
  await prisma.payment.create({
    data: {
      subscriptionId: subscription.id,
      amount: subscription.amount,
      status: 'success',
      razorpayId: payment.id
    }
  });

  // Update subscription status
  const updatedSubscription = await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: 'ACTIVE',
      paymentId: payment.id,
      activatedAt: new Date(),
    }
  });

  logger.debug('Subscription activated:', {
    subscriptionId: subscription.id,
    paymentId: payment.id
  });

  // Send confirmation email
  await sendSubscriptionEmail(
    subscription.user.email,
    subscription.planId
  ).catch(error => {
    logger.error('Failed to send subscription email:', error);
  });

  return NextResponse.json({ 
    status: 'success',
    subscription: updatedSubscription
  });
}

async function handleClientVerification(request: Request) {
  const { orderId, razorpay_payment_id, razorpay_signature } = await request.json();
  
  // Verify the payment
  const subscription = await prisma.subscription.findUnique({
    where: { orderId },
    include: { user: true }
  });

  if (!subscription) {
    logger.error('Subscription not found:', { orderId });
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
  }

  // Create payment record
  await prisma.payment.create({
    data: {
      subscriptionId: subscription.id,
      amount: subscription.amount,
      status: 'success',
      razorpayId: razorpay_payment_id
    }
  });

  // Update subscription
  const updatedSubscription = await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      status: 'ACTIVE',
      paymentId: razorpay_payment_id,
      activatedAt: new Date(),
    }
  });

  logger.debug('Subscription activated via client:', {
    subscriptionId: subscription.id,
    paymentId: razorpay_payment_id
  });

  return NextResponse.json({ 
    status: 'success',
    subscription: updatedSubscription
  });
}
