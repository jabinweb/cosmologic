import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthUser();
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();
    const { id } = params;

    const subscription = await prisma.subscription.update({
      where: { id },
      data: { 
        status,
        ...(status === 'ACTIVE' ? { activatedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
