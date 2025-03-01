import { prisma } from "@/lib/prisma";

export async function getProfile(userId: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            role: true,
            createdAt: true,
          }
        },
        posts: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            topic: true,
            author: {
              select: { name: true, avatar: true }
            }
          }
        },
      }
    });

    if (profile) {
      return {
        ...profile,
        achievements: JSON.parse(profile.achievements),
        socialLinks: profile.socialLinks ? JSON.parse(profile.socialLinks) : {},
        skills: JSON.parse(profile.skills),
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function updateProfile(userId: string, data: any) {
  try {
    return await prisma.profile.update({
      where: { userId },
      data: {
        ...data,
        achievements: JSON.stringify(data.achievements || []),
        socialLinks: JSON.stringify(data.socialLinks || {}),
        skills: JSON.stringify(data.skills || []),
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}
