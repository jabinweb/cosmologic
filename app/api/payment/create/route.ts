import { NextResponse } from 'next/server';
import { razorpay, razorpayPlans } from '@/lib/razorpay';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PlanType } from '@/types';
import logger from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    logger.debug('Payment creation request body:', body);

    const { planId } = body as { planId: PlanType; };

    // Validate required fields
    if (!planId) {
      logger.error('Invalid request data:', { planId });
      return NextResponse.json({ 
        error: 'Invalid request data',
        details: { planId }
      }, { status: 400 });
    }

    const user = await getAuthUser();
    if (!user) {
      logger.error('Unauthorized payment attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Type-safe plan access
    const selectedPlan = razorpayPlans.planId;
    if (!selectedPlan) {
      logger.error('Plan not found:', { planId });
      return NextResponse.json({ 
        error: 'Plan not found',
        details: { planId }
      }, { status: 400 });
    }

    logger.debug('Creating Razorpay order:', {
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      userId: user.id,
      planId: selectedPlan.id,
    });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: selectedPlan.amount,
      currency: selectedPlan.currency,
      notes: {
        userId: user.id,
        planId: selectedPlan.id,
      }
    });

    logger.debug('Razorpay order created:', { orderId: order.id });

    // Create pending subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: planId,
        orderId: order.id,
        status: 'PENDING',
        amount: selectedPlan.amount,
      }
    });

    logger.debug('Subscription record created:', {
      subscriptionId: subscription.id,
      status: subscription.status
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY
    });
  } catch (error) {
    logger.error('Payment creation failed:', error);
    return NextResponse.json({
      error: 'Payment initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
