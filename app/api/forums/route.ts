import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const data = await request.json();
  
  const forum = await prisma.forum.create({
    data: {
      name: data.name,
      description: data.description,
      slug: data.slug,
    }
  });

  return Response.json(forum);
}

export async function GET() {
  try {
    const forums = await prisma.forum.findMany({
      include: {
        _count: { select: { topics: true } },
        topics: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { name: true } },
            _count: { select: { posts: true } }
          }
        }
      }
    });

    return NextResponse.json({ forums });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch forums' },
      { status: 500 }
    );
  }
}
