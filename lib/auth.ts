import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export type Role = "ADMIN" | "SUPERVISOR" | "PARTICIPANT";
export type Session = { id: string; name: string; role: Role };
const key = new TextEncoder().encode(process.env.AUTH_SECRET || "change-this-development-secret-before-production");

export async function signSession(user: Session) {
  return new SignJWT(user).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(key);
}
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get("followhim_session")?.value;
  if (!token) return null;
  try { return (await jwtVerify(token, key)).payload as unknown as Session; } catch { return null; }
}
