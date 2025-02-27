import { NextResponse } from 'next/server';
import { useSession } from '@/components/session-provider';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const { session, status } = await useSession();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        activatedAt: {
          not: null,
        },
      },
    });

    return NextResponse.json({
      hasActiveSubscription: !!activeSubscription,
      subscription: activeSubscription,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check subscription' },
      { status: 500 }
    );
  }
}
