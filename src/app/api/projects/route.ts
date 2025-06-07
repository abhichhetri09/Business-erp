import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        manager: true,
        members: true,
        timeEntries: {
          include: {
            user: true,
          },
        },
        expenses: {
          include: {
            user: true,
          },
        },
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        status: body.status || "ACTIVE",
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        managerId: body.managerId,
        members: {
          connect: body.memberIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        manager: true,
        members: true,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
