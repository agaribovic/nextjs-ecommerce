export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookieOptions, COOKIE_MAX_AGE } from "../cakes/utils/cookies";
import { deleteCookies } from "../cakes/utils/cookies";

function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

interface AdminPayload {
  email: string;
  role: "admin";
  expiresIn: number;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return unauthorized();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AdminPayload;

    return NextResponse.json({
      email: payload.email,
      role: payload.role,
      expiresIn: payload.expiresIn,
    });
  } catch {
    return unauthorized();
  }
}

export async function POST(req: NextRequest) {
  const expiresAt = Date.now() + COOKIE_MAX_AGE * 60 * 60 * 1000;
  const expiresIn = expiresAt - Date.now();

  console.log("ADMIN_EMAIL exists:", process.env.ADMIN_EMAIL);
  console.log("ADMIN_PASSWORD_HASH exists:", process.env.ADMIN_PASSWORD_HASH);

  try {
    const { email, password } = await req.json();

    if (email !== process.env.ADMIN_EMAIL) return unauthorized();

    const isValid = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH!
    );
    if (!isValid) return unauthorized();

    const token = jwt.sign(
      { email, role: "admin", expiresIn: expiresIn },
      process.env.JWT_SECRET!,
      {
        expiresIn: `${COOKIE_MAX_AGE}h`,
      }
    );

    const response = NextResponse.json({
      message: "Login successful",
      email,
      role: "admin",
      expiresIn: expiresIn,
    });

    response.cookies.set("token", token, cookieOptions);
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });

    deleteCookies(response, [
      { name: "token", httpOnly: true },
      { name: "sortedBy", httpOnly: false },
    ]);

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
