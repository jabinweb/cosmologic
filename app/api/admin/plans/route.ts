import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Plan } from '@/types';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plans = await prisma.plan.findMany({
      orderBy: [{ order: 'asc' }],
    });

    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // For initial plans setup, skip auth check
    if (data.initial) {
      const existingPlans = await prisma.plan.count();
      
      if (existingPlans === 0) {
        const plans = data.plans.map((plan: any) => ({
          ...plan,
          features: JSON.stringify(plan.features),
          perks: JSON.stringify(plan.perks)
        }));

        // Use transaction to create all plans
        await prisma.$transaction(
          plans.map((plan: Plan) => 
            prisma.plan.create({
              data: plan
            })
          )
        );

        const createdPlans = await prisma.plan.findMany({
          orderBy: [{ order: 'asc' }]
        });

        return NextResponse.json({ 
          message: 'Initial plans created',
          plans: createdPlans
        });
      }

      return NextResponse.json({ 
        message: 'Plans already exist',
        plans: await prisma.plan.findMany()
      });
    }

    // Regular plan creation (requires admin)
    const user = await getAuthUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const plan = await prisma.plan.create({ 
      data: {
        ...data,
        features: JSON.stringify(data.features),
        perks: JSON.stringify(data.perks)
      } 
    });

    return NextResponse.json({ plan });

  } catch (error) {
    console.error('Failed to create plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan', details: error },
      { status: 500 }
    );
  }
}
