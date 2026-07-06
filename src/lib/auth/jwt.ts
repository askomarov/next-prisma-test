import { SignJWT, jwtVerify } from "jose";
import type { SessionUser } from "./types";

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export function getSessionSecret(): Uint8Array {
  const secret = (process.env.SESSION_SECRET ?? "").trim();

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters");
  }

  return new TextEncoder().encode(secret);
}

export async function signSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({
    userId: user.userId,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSessionSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    const email = payload.email;
    const role = payload.role;

    if (typeof email !== "string" || typeof role !== "string") {
      return null;
    }

    if (role !== "USER" && role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return null;
    }

    return {
      userId: typeof payload.userId === "string" ? payload.userId : undefined,
      email,
      role,
    };
  } catch {
    return null;
  }
}
