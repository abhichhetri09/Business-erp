import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { prisma } from "@/lib/db";

export async function getUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    if (!token) {
      return null;
    }

    const { payload } = await verifyJWT(token.value);
    if (!payload.sub) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

export function hasPermission(userRole: string, requiredRoles: string[]) {
  if (!userRole || !requiredRoles?.length) {
    return false;
  }

  // Admin has access to everything
  if (userRole === "ADMIN") {
    return true;
  }

  // Check if user's role is in the required roles
  return requiredRoles.includes(userRole);
}
