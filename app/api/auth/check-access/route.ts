import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { useSession } from '@/components/session-provider';
import logger from '@/lib/logger';

export async function GET(request: Request) {
    const { session, status } = await useSession();
    const user = session?.user;

  try {
    
    if (!user) {
      return NextResponse.json({ 
        hasAccess: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Check active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: 'ACTIVE',
        activatedAt: {
          not: null
        },
      },
    });

    // Check enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: user.id,
        status: 'active'
      },
    });

    logger.debug('Access check for user:', {
      userId: user.id,
      hasSubscription: !!subscription,
      enrollmentsCount: enrollments.length
    });

    return NextResponse.json({
      hasAccess: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      subscription: subscription ? {
        planId: subscription.planId,
        status: subscription.status,
        expiresAt: subscription.activatedAt
      } : null,
      enrollments: enrollments.length,
    });

  } catch (error) {
    logger.error('Access check failed:', error);
    return NextResponse.json({ 
      hasAccess: false,
      error: 'Failed to check access'
    }, { status: 500 });
  }
}
