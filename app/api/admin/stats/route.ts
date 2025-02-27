import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getAuthUser();
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalUsers,
      activeSubscriptions,
      totalCourses,
      recentSubscriptions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.course.count(),
      prisma.subscription.findMany({
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          planId: true,
          activatedAt: true,
          user: {
            select: { name: true }
          }
        },
        orderBy: { activatedAt: 'desc' },
        take: 5
      })
    ]);

    return NextResponse.json({
      totalUsers,
      activeSubscriptions,
      totalCourses,
      recentSubscriptions
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
