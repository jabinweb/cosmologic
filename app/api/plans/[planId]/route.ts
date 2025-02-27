import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PlanType } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { planId: string } }
) {
  try {
    const planId = params.planId as PlanType;

    const plan = await prisma.plan.findFirst({
      where: {
        name: planId,
        isActive: true,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error('Failed to fetch plan:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plan' },
      { status: 500 }
    );
  }
}
