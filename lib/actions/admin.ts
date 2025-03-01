'use server';

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function getUsersByRole(role: Role) {
  return await prisma.user.findMany({
    where: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function getAdminStats() {
  const [totalUsers, activeSubscriptions, totalCourses] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({
      where: { status: 'ACTIVE' }
    }),
    prisma.course.count()
  ]);

  return {
    totalUsers,
    activeSubscriptions,
    totalCourses
  };
}

export async function updateUserRole(userId: string, role: Role) {
  return await prisma.user.update({
    where: { id: userId },
    data: { role }
  });
}

export async function suspendUser(userId: string) {
  // Add your suspension logic here
  return await prisma.user.update({
    where: { id: userId },
    data: { 
      // Add suspension field to your schema if needed
      // suspended: true
    }
  });
}

export async function getAllForums() {
  return await prisma.forum.findMany({
    include: {
      topics: {
        select: {
          id: true,
          posts: {
            select: {
              id: true,
            }
          }
        }
      },
      _count: {
        select: {
          topics: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export async function createForum(data: { 
  name: string; 
  description: string; 
  slug: string;
}) {
  return await prisma.forum.create({
    data: {
      ...data,
      slug: data.slug.toLowerCase(),
    },
  });
}

export async function updateForum(
  forumId: string, 
  data: { 
    name?: string; 
    description?: string; 
    slug?: string;
  }
) {
  return await prisma.forum.update({
    where: { id: forumId },
    data: {
      ...data,
      slug: data.slug?.toLowerCase(),
    },
  });
}

export async function deleteForum(forumId: string) {
  return await prisma.forum.delete({
    where: { id: forumId },
  });
}

export async function getAllUsers() {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            assessmentData: true
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}