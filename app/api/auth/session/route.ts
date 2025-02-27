import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { verifyJWT } from '@/lib/jwt';
import logger from '@/lib/logger';

export async function GET() {
  try {
    const token = (await cookies()).get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null });
    }

    const payload = await verifyJWT(token);
    if (!payload?.userId) {
      return NextResponse.json({ user: null });
    }

    const [user, subscription] = await Promise.all([
      prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
        }
      }),
      prisma.subscription.findFirst({
        where: {
          userId: payload.userId,
          status: 'ACTIVE',
          activatedAt: { not: null }
        },
        select: {
          planId: true,
          status: true,
        }
      })
    ]);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    logger.debug('Session retrieved:', { userId: user.id });

    return NextResponse.json({
      user,
      subscription: subscription ? {
        isActive: true,
        plan: subscription.planId
      } : {
        isActive: false
      }
    });
  } catch (error) {
    logger.error('Session retrieval failed:', error);
    return NextResponse.json({ user: null });
  }
}
