import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

// Get all time entries for the current user
export async function GET(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId: user.id,
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(timeEntries);
  } catch (error) {
    console.error("Error fetching time entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch time entries" },
      { status: 500 }
    );
  }
}

// Create a new time entry
export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, startTime, endTime, description } = body;

    // Calculate hours from start and end time
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert milliseconds to hours

    const timeEntry = await prisma.timeEntry.create({
      data: {
        userId: user.id,
        projectId,
        date: start,
        hours,
        description,
      },
      include: {
        project: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(timeEntry);
  } catch (error) {
    console.error("Error creating time entry:", error);
    return NextResponse.json(
      { error: "Failed to create time entry" },
      { status: 500 }
    );
  }
}
