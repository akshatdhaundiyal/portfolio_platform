import { NextRequest, NextResponse } from "next/server";
import {
  validateCredentials,
  registerUser,
  generateToken,
  AUTH_COOKIE_NAME,
  getCurrentUser,
  getRedirectPathForRole,
} from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({
    authenticated: !!user,
    user,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action as "login" | "signup" | undefined;
    const username = body.username as string | undefined;
    const password = (body.password || body.passcode) as string | undefined;
    const displayName = body.displayName as string | undefined;

    let user = null;

    if (action === "signup") {
      if (!username?.trim() || !password?.trim()) {
        return NextResponse.json(
          { error: "Username and password are required for sign up." },
          { status: 400 }
        );
      }
      user = registerUser(username, displayName || username, password, "user");
    } else {
      user = validateCredentials(username, password);
      if (!user) {
        return NextResponse.json(
          { error: "Invalid credentials. Please verify your role passcode." },
          { status: 401 }
        );
      }
    }

    const token = generateToken(user);
    const redirectUrl = getRedirectPathForRole(user.role);

    const response = NextResponse.json({
      success: true,
      user,
      redirectUrl,
      message: action === "signup" ? `Account created for ${user.displayName}!` : `Welcome, ${user.displayName}!`,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication error" }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Signed out successfully." });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
