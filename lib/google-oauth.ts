import { OAuth2Client } from 'google-auth-library';
import logger from './logger';

const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
logger.debug('Google OAuth redirect URI:', redirectUri);

export const oauth2Client = new OAuth2Client({
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  redirectUri: redirectUri,
});

export function getGoogleAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    response_type: 'code',
    scope: [
      'openid',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent',
    include_granted_scopes: true
  });
}

export async function verifyGoogleToken(token: string) {
  try {
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (error) {
    logger.error('Token verification failed:', error);
    throw error;
  }
}
