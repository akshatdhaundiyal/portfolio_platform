import { NextRequest, NextResponse } from "next/server";
import { validatePassword, generateToken, AUTH_COOKIE_NAME, isAuthenticated } from "@/lib/auth";

export async function GET() {
  const authed = await isAuthenticated();
  return NextResponse.json({ authenticated: authed });
}

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || !validatePassword(password)) {
      return NextResponse.json(
        { error: "Invalid master secret passcode." },
        { status: 401 }
      );
    }

    const token = generateToken();
    const response = NextResponse.json({ success: true, message: "Authenticated successfully." });

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
  const response = NextResponse.json({ success: true, message: "Signed out." });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
