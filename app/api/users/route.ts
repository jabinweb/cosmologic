import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { User } from '@/types';

export async function GET(request: Request) {
  try {
    const dbUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
      }
    });

    // Transform to match User type
    const users: User[] = dbUsers.map(user => ({
      ...user,
      avatar: user.avatar || undefined,
      isAdmin: user.role === 'ADMIN'
    }));

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
