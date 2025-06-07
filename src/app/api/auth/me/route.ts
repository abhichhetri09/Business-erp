import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      console.log("No token found in cookies");
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    try {
      const { payload } = await verifyJWT(token.value);

      if (!payload.sub) {
        console.log("Invalid token payload - missing sub");
        return NextResponse.json(
          { error: "Invalid token payload" },
          { status: 401 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          settings: true,
        },
      });

      if (!user) {
        console.log("User not found in database:", payload.sub);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // If user doesn't have settings, create default settings
      if (!user.settings) {
        const settings = await prisma.userSettings.create({
          data: {
            userId: user.id,
            theme: "system",
            language: "en",
            emailNotifications: true,
            pushNotifications: true,
            weeklyDigest: true,
            workingHours: 8,
            timeZone: "UTC",
            dateFormat: "MM/dd/yyyy",
            timeFormat: "HH:mm",
          },
        });
        user.settings = settings;
      }

      return NextResponse.json({ user });
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
