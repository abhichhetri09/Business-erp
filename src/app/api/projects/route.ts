import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRole } from "@/middleware/role-middleware";

export async function GET(request: NextRequest) {
  // All authenticated users can view projects
  const middlewareResponse = await withRole(request, [
    "ADMIN",
    "MANAGER",
    "EMPLOYEE",
  ]);
  if (middlewareResponse) {
    return middlewareResponse;
  }

  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
        members: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Only ADMIN and MANAGER can create projects
  const middlewareResponse = await withRole(request, ["ADMIN", "MANAGER"]);
  if (middlewareResponse) {
    return middlewareResponse;
  }

  try {
    const body = await request.json();
    const { name, description, status, startDate, endDate, assignedUserIds } =
      body;

    // Validate required fields
    if (!name || !status || !startDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new project
    const project = await prisma.project.create({
      data: {
        name,
        description,
        status,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        assignedUsers: {
          connect: assignedUserIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        assignedUsers: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  // Only ADMIN and MANAGER can update projects
  const middlewareResponse = await withRole(request, ["ADMIN", "MANAGER"]);
  if (middlewareResponse) {
    return middlewareResponse;
  }

  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      status,
      startDate,
      endDate,
      assignedUserIds,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        assignedUsers: {
          set: assignedUserIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: {
        assignedUsers: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Only ADMIN can delete projects
  const middlewareResponse = await withRole(request, ["ADMIN"]);
  if (middlewareResponse) {
    return middlewareResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
