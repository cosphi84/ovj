import { SignJWT, jwtVerify as joseJwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this"
);

export async function jwtSign(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function jwtVerify<T>(token: string): Promise<T> {
  const verified = await joseJwtVerify(token, secret);
  return verified.payload as T;
}
