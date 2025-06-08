import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signJWT } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { UserRole } from "@/contexts/user-context";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token with role
    const token = await signJWT({
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    // Set cookie
    cookies().set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      // Extend cookie expiry and make it more resilient
      maxAge: 60 * 60 * 24 * 7, // 7 days
      domain: process.env.NODE_ENV === "development" ? "localhost" : undefined,
      // Extend cookie expiry and make it more resilient
    });

    // Return minimal user data
    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role as UserRole,
          name: user.name,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("Sign-in error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
