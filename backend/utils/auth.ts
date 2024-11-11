import { Context } from "koa";
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: number;
  isAdmin: boolean;
  passwordVersion: number;
  iat?: number;
  exp?: number;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const COOKIE_MAX_AGE = 604800000; // 1 week in milliseconds
const COOKIE_NAME = 'auth-token';

export const signJWT = (userId: number, isAdmin: boolean, passwordVersion: number) => {
  return jwt.sign({ userId, passwordVersion, isAdmin }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN as string });
}

export const verifyJWT = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (err) {
    return null;
  }
}

export const setAuthCookie = (ctx: Context, token: string | null) => {
  ctx.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    secure: false, // required to run locally
    sameSite: 'lax',
    path: '/',
    expires: new Date(Date.now() + COOKIE_MAX_AGE)
  });
};

export const removeAuthCookie = (ctx: Context) => {
  ctx.cookies.set(COOKIE_NAME, null);
}