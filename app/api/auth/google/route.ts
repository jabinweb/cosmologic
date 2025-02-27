import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '@/lib/prisma';
import { signJWT } from '@/lib/jwt';
import { cookies } from 'next/headers';
import logger from '@/lib/logger';

// Create OAuth client in a simpler way
const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    logger.debug('Request body:', body);

    if (!body.token) {
      logger.error('No token provided');
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    logger.debug('Verifying token...');
    const ticket = await client.verifyIdToken({
      idToken: body.token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    logger.debug('Token payload:', payload);

    if (!payload?.email) {
      logger.error('No email in payload');
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      logger.debug('Creating new user:', { email: payload.email, name: payload.name });
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || 'User',
          password: '',
          role: 'STUDENT',
        },
      });
    }

    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    logger.debug('Login successful:', { userId: user.id });
    return NextResponse.json({ user });

  } catch (error) {
    logger.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
