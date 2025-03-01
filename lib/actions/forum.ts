import { prisma } from "@/lib/prisma";

export interface Forum {
  id: string;
  name: string;
  slug: string;
  description: string;
  topics: Topic[];
  _count: {
    topics: number;
    posts: number;
  };
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  isPinned: boolean;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  _count: {
    posts: number;
  };
}

export async function getTopic(topicId: string) {
  try {
    return await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            profile: true,
          }
        },
        forum: true,
        _count: {
          select: {
            posts: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching topic:', error);
    return null;
  }
}

export async function getForums() {
  try {
    return await prisma.forum.findMany({
      include: {
        _count: {
          select: {
            topics: true
          }
        },
        topics: {
          take: 3,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            author: {
              select: {
                name: true
              }
            },
            _count: {
              select: {
                posts: true
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching forums:', error);
    return [];
  }
}

export async function getRecentTopics(limit = 5) {
  try {
    return await prisma.topic.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          }
        },
        forum: {
          select: {
            name: true,
            slug: true,
          }
        },
        _count: {
          select: {
            posts: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching recent topics:', error);
    return [];
  }
}

export async function getForumBySlug(slug: string) {
  try {
    return await prisma.forum.findFirst({
      where: { 
        slug 
      },
      include: {
        topics: {
          orderBy: [
            { isPinned: 'desc' },
            { createdAt: 'desc' }
          ],
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              }
            },
            _count: {
              select: {
                posts: true
              }
            }
          }
        },
        _count: {
          select: {
            topics: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching forum by slug:', error);
    return null;
  }
}

export async function searchForums(query: string) {
  try {
    const [topics, posts] = await Promise.all([
      prisma.topic.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        },
        include: {
          forum: true,
          author: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        take: 10,
      }),
      prisma.post.findMany({
        where: {
          content: { contains: query },
        },
        include: {
          topic: {
            include: {
              forum: true,
            },
          },
          author: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        take: 10,
      }),
    ]);

    return { topics, posts };
  } catch (error) {
    console.error('Error searching forums:', error);
    return { topics: [], posts: [] };
  }
}

export async function updateTopic(
  topicId: string, 
  data: { isPinned?: boolean; isLocked?: boolean }
) {
  try {
    return await prisma.topic.update({
      where: { id: topicId },
      data,
    });
  } catch (error) {
    console.error('Error updating topic:', error);
    return null;
  }
}

export async function deleteTopic(topicId: string) {
  try {
    await prisma.topic.delete({
      where: { id: topicId },
    });
    return true;
  } catch (error) {
    console.error('Error deleting topic:', error);
    return false;
  }
}
