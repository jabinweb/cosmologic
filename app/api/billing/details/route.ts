import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import type { Payment, Subscription } from '@prisma/client';

interface PaymentWithSubscription extends Payment {
  subscription: {
    planId: string;
  };
    id: string;
    amount: number;
    status: string;
    createdAt: Date;
    plan: string;
}

interface BillingDetailsResponse {
  subscription: Subscription | null;
  paymentHistory: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: Date;
    plan: string;
  }>;
}

export async function GET(): Promise<NextResponse> {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ 
        subscription: null, 
        paymentHistory: [] 
      } satisfies BillingDetailsResponse);
    }

    const [subscription, payments] = await Promise.all([
      prisma.subscription.findFirst({
        where: {
          userId: user.id,
          status: 'ACTIVE',
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.payment.findMany({
        where: {
          subscription: {
            userId: user.id,
          },
        },
        include: {
          subscription: {
            select: {
              planId: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      }),
    ]);

    const paymentHistory = (payments as PaymentWithSubscription[]).map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
      plan: payment.subscription.planId,
    }));

    return NextResponse.json({
      subscription,
      paymentHistory,
    } satisfies BillingDetailsResponse);

  } catch (error) {
    console.error('Billing details error:', error);
    return NextResponse.json({
      subscription: null,
      paymentHistory: [],
    } satisfies BillingDetailsResponse, { status: 500 });
  }
}
