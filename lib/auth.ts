import { cookies } from 'next/headers';
import { cache } from 'react';
import { verifyJWT } from './jwt';
import { prisma } from './prisma';
import logger from './logger';
import { User } from '@/types/user';
import { Role } from '@prisma/client';

export const getAuthUser = cache(async (): Promise<User | null> => {
  try {
    const token = (await cookies()).get('token')?.value;
    
    if (!token) {
      return null;
    }

    const payload = await verifyJWT(token);
    
    if (!payload?.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { 
        id: payload.userId 
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
      }
    });

    if (!user) return null;

    // Transform the data to match User type
    return {
      ...user,
      avatar: user.avatar || undefined,
      isAdmin: user.role === Role.ADMIN
    };
  } catch (error) {
    logger.error('Auth check failed:', error);
    return null;
  }
});

export async function getUserFromToken(token: string) {
  try {
    const payload = await verifyJWT(token);
    
    if (!payload?.userId) {
      return null;
    }

    return await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });
  } catch (error) {
    logger.error('Token verification failed:', error);
    return null;
  }
}

export function isAdmin(user: any) {
  return user?.role === 'ADMIN';
}

export function isInstructor(user: any) {
  return user?.role === 'INSTRUCTOR';
}

export function isStudent(user: any) {
  return user?.role === 'STUDENT';
}

export function isParent(user: any) {
  return user?.role === 'PARENT';
}

export const revalidate = 0;
