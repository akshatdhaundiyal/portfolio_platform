import { cookies } from "next/headers";
import crypto from "crypto";

export type UserRole = "superadmin" | "admin" | "dev" | "user" | "guest";

export interface AuthUser {
  username: string;
  role: UserRole;
  displayName: string;
  badge: string;
}

export const USERS: Record<string, { password: string; user: AuthUser }> = {
  superadmin: {
    password: process.env.SUPER_ADMIN_PASSWORD || "super123",
    user: {
      username: "superadmin",
      role: "superadmin",
      displayName: "Akshat Dhaundiyal",
      badge: "SUPER ADMIN // FULL CONTROLS",
    },
  },
  admin: {
    password: process.env.ADMIN_PASSWORD || "admin123",
    user: {
      username: "admin",
      role: "admin",
      displayName: "Studio Admin",
      badge: "ADMIN // EDITORIAL WORKBENCH",
    },
  },
  dev: {
    password: process.env.DEV_PASSWORD || "dev123",
    user: {
      username: "dev",
      role: "dev",
      displayName: "Systems Engineer",
      badge: "DEV // TELEMETRY & DIAGNOSTICS",
    },
  },
  user: {
    password: process.env.USER_PASSWORD || "user123",
    user: {
      username: "user",
      role: "user",
      displayName: "Authenticated Member",
      badge: "MEMBER // INTERACTIVE ACCESS",
    },
  },
  guest: {
    password: process.env.GUEST_PASSWORD || "guest123",
    user: {
      username: "guest",
      role: "guest",
      displayName: "Guest Reviewer",
      badge: "GUEST // READ-ONLY PREVIEW",
    },
  },
};

const COOKIE_NAME = "portfolio_auth_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "akshat-studio-salt-key-99210";

function getSecret() {
  return crypto.createHash("sha256").update(SESSION_SECRET).digest("hex");
}

export function generateToken(user: AuthUser): string {
  const payload = {
    ...user,
    iat: Date.now(),
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", getSecret()).update(payloadStr).digest("hex");
  return `${payloadStr}.${signature}`;
}

export function verifyToken(token: string | undefined | null): AuthUser | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadStr, signature] = parts;

  const expectedSignature = crypto.createHmac("sha256", getSecret()).update(payloadStr).digest("hex");
  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString("utf8"));
    // Verify token age (7 days)
    if (!payload.iat || Date.now() - payload.iat > 7 * 24 * 60 * 60 * 1000) {
      return null;
    }
    return {
      username: payload.username,
      role: payload.role,
      displayName: payload.displayName,
      badge: payload.badge,
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);
    return verifyToken(sessionCookie?.value);
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

export function validateCredentials(username?: string, password?: string): AuthUser | null {
  if (!password) return null;

  // 1. Direct username check
  if (username) {
    const record = USERS[username.toLowerCase().trim()];
    if (record && record.password === password) {
      return record.user;
    }
  }

  // 2. Fallback: Check password against all roles if username is omitted or matches legacy passcode
  for (const record of Object.values(USERS)) {
    if (record.password === password) {
      return record.user;
    }
  }

  return null;
}

export function registerUser(username: string, displayName: string, password: string, role: UserRole = "user"): AuthUser {
  const cleanUsername = username.toLowerCase().trim();
  const newUser: AuthUser = {
    username: cleanUsername,
    role,
    displayName: displayName.trim() || cleanUsername,
    badge: role === "superadmin" ? "SUPER ADMIN" : role === "admin" ? "ADMIN" : role === "dev" ? "DEV" : "MEMBER // VERIFIED",
  };
  USERS[cleanUsername] = {
    password,
    user: newUser,
  };
  return newUser;
}

export function getRedirectPathForRole(role: UserRole): string {
  switch (role) {
    case "superadmin":
      return "/admin/projects?tab=projects";
    case "admin":
      return "/admin/projects?tab=projects";
    case "dev":
      return "/admin/projects?tab=dev";
    case "user":
      return "/admin/projects?tab=projects&role=preview";
    case "guest":
      return "/admin/projects?tab=projects&role=preview";
    default:
      return "/admin/projects";
  }
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
