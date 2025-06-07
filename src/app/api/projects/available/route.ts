import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all projects where the user is either a member or manager
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                id: user.id,
              },
            },
          },
          {
            managerId: user.id,
          },
        ],
        status: "ACTIVE", // Only return active projects
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching available projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch available projects" },
      { status: 500 }
    );
  }
}
