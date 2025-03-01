import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AssessmentData } from '@/types/learning';

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await request.json();

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        assessmentData: JSON.stringify(data),
        assessmentCompleted: true,
      },
      create: {
        userId: user.id,
        assessmentData: JSON.stringify(data),
        assessmentCompleted: true,
        bio: '',
        achievements: '[]',
        skills: '[]',
        socialLinks: '{}'
      }
    });

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Assessment save failed:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
