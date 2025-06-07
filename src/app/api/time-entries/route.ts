import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const timeEntries = await prisma.timeEntry.findMany({
      include: {
        user: true,
        project: true,
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(timeEntries);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch time entries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const timeEntry = await prisma.timeEntry.create({
      data: {
        userId: body.userId,
        projectId: body.projectId,
        date: new Date(body.date),
        hours: body.hours,
        description: body.description,
      },
      include: {
        user: true,
        project: true,
      },
    });
    return NextResponse.json(timeEntry);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create time entry" },
      { status: 500 }
    );
  }
}
