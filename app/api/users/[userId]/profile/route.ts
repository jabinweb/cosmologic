import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId: params.userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
          }
        }
      }
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...profile,
      achievements: JSON.parse(profile.achievements),
      socialLinks: profile.socialLinks ? JSON.parse(profile.socialLinks) : {},
      skills: JSON.parse(profile.skills),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await getAuthUser();
    if (!user || (user.id !== params.userId && user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const profile = await prisma.profile.update({
      where: { userId: params.userId },
      data: {
        bio: data.bio,
        achievements: JSON.stringify(data.achievements || []),
        socialLinks: JSON.stringify(data.socialLinks || {}),
        skills: JSON.stringify(data.skills || []),
      }
    });

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
