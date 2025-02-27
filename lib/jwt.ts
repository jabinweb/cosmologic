import { jwtVerify, SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const ISSUER = 'cosmologic';
const AUDIENCE = 'cosmologic-users';

export async function signJWT(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
