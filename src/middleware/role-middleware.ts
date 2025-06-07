import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { prisma } from "@/lib/db";
import { UserRole } from "@/contexts/user-context";

export async function withRole(
  request: NextRequest,
  allowedRoles: UserRole[]
): Promise<Response | null> {
  try {
    const token = request.cookies.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const { payload } = await verifyJWT(token.value);

    if (!payload.sub) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
      return NextResponse.json(
        { error: "Forbidden - Insufficient permissions" },
        { status: 403 }
      );
    }

    // Add user info to request for route handlers
    request.headers.set("X-User-Id", user.id);
    request.headers.set("X-User-Role", user.role);

    // If all checks pass, return null to indicate success
    return null;
  } catch (error) {
    console.error("Role middleware error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
