import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Plan } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);


    const plans = await prisma.plan.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { order: 'asc' },
        { price: 'asc' },
      ],
    });

    console.log('Found plans:', plans.length);  // Debug log

    return NextResponse.json({ 
      plans: plans.map((plan: Plan) => ({
        ...plan,
        features: plan.features || [],
        perks: plan.perks || [],
      }))
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans', details: error },
      { status: 500 }
    );
  }
}
