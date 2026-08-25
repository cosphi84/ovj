import {cookies} from "next/headers";
import {jwtSign, jwtVerify} from "./jwt";

export interface Session {
  userId: number;
  userEmail: string;
  userName: string;
}

const SESSION_COOKIE = "auth-session";

export async function createSession(
  userId: number,
  email: string,
  name: string
): Promise<string> {
  const session: Session = { userId, userEmail: email, userName: name };
  const token = await jwtSign(session);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true", // ← decouple dari NODE_ENV
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours
    path: "/",
  });
  return token;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    return await jwtVerify<Session>(token);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}