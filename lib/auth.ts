import { cookies } from "next/headers";
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const COOKIE_NAME = "admin_session";

function getSecret() {
  return crypto.createHash("sha256").update(ADMIN_PASSWORD + "-session-salt").digest("hex");
}

export function generateToken(): string {
  const secret = getSecret();
  const timestamp = Date.now().toString();
  const signature = crypto.createHmac("sha256", secret).update(timestamp).digest("hex");
  return `${timestamp}.${signature}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [timestamp, signature] = parts;
  
  // Verify timestamp is within 7 days
  const time = parseInt(timestamp, 10);
  if (isNaN(time) || Date.now() - time > 7 * 24 * 60 * 60 * 1000) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", getSecret())
    .update(timestamp)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  return verifyToken(sessionCookie?.value);
}

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
