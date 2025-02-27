import { NextResponse } from 'next/server';
import { oauth2Client } from '@/lib/google-oauth';
import { prisma } from '@/lib/prisma';
import { signJWT } from '@/lib/jwt';
import logger from '@/lib/logger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    logger.debug('Google callback received', { code: code?.substring(0, 10) });

    if (!code) {
      return NextResponse.redirect(new URL('/auth/login?error=NoCodeProvided', process.env.NEXT_PUBLIC_APP_URL));
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    logger.debug('Tokens received', { hasIdToken: !!tokens.id_token });

    // Get user info from token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      return NextResponse.redirect(new URL('/auth/login?error=NoEmailProvided', process.env.NEXT_PUBLIC_APP_URL));
    }

    logger.debug('User info retrieved', { email: payload.email });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name || 'User',
          password: '', // Empty password for OAuth users
          role: 'STUDENT',
        }
      });
      logger.debug('New user created', { userId: user.id });
    }

    // Create JWT token
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    const token = await signJWT({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    logger.debug('Setting auth cookies');
    
    // Create response with absolute URL
    const response = NextResponse.redirect(`${baseUrl}/dashboard`, {
      // Use 307 to preserve the method
      status: 307
    });
    
    // Set cookie with explicit domain
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // Make sure cookie is available for all paths
      domain: new URL(baseUrl).hostname,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    logger.debug('Redirecting to dashboard with auth cookie');
    return response;
  } catch (error) {
    logger.error('Google callback error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=AuthFailed`);
  }
}
