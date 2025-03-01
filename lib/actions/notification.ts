import { prisma } from "@/lib/prisma";

export async function createMentionNotification(
  mentionedUserId: string,
  postId: string,
  mentionerId: string
) {
  try {
    return await prisma.notification.create({
      data: {
        userId: mentionedUserId,
        type: 'MENTION',
        postId,
        actorId: mentionerId,
      },
    });
  } catch (error) {
    console.error('Error creating mention notification:', error);
  }
}

export async function getUserNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    include: {
      actor: {
        select: {
          name: true,
          avatar: true,
        },
      },
      post: {
        include: {
          topic: {
            include: {
              forum: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  });
}
