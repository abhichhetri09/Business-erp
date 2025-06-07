import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRole } from "@/middleware/role-middleware";
import { hash } from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Only ADMIN can update employees
  const middlewareResponse = await withRole(request, ["ADMIN"]);
  if (middlewareResponse) {
    return middlewareResponse;
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { name, email, role, password } = body;

    // Check if employee exists
    const existingEmployee = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Check if email is taken by another user
    if (email !== existingEmployee.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email },
      });

      if (emailTaken) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // Update employee
    const updateData: any = {
      name,
      email,
      role,
    };

    // Only update password if provided
    if (password) {
      updateData.password = await hash(password, 12);
    }

    const employee = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ employee });
  } catch (error) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Only ADMIN can delete employees
  const middlewareResponse = await withRole(request, ["ADMIN"]);
  if (middlewareResponse) {
    return middlewareResponse;
  }

  try {
    const { id } = params;

    // Check if employee exists and get their relationships
    const existingEmployee = await prisma.user.findUnique({
      where: { id },
      include: {
        timeEntries: true,
        expenses: true,
        projects: true,
        managedProjects: true,
      },
    });

    if (!existingEmployee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Start a transaction to handle all deletions
    await prisma.$transaction(async (tx) => {
      // 1. Delete all time entries
      if (existingEmployee.timeEntries.length > 0) {
        await tx.timeEntry.deleteMany({
          where: { userId: id },
        });
      }

      // 2. Delete all expenses
      if (existingEmployee.expenses.length > 0) {
        await tx.expense.deleteMany({
          where: { userId: id },
        });
      }

      // 3. Remove user from all projects they're a member of
      if (existingEmployee.projects.length > 0) {
        await tx.user.update({
          where: { id },
          data: {
            projects: {
              disconnect: existingEmployee.projects.map((p) => ({ id: p.id })),
            },
          },
        });
      }

      // 4. Handle managed projects
      if (existingEmployee.managedProjects.length > 0) {
        // Either delete the projects or reassign them to another manager
        await tx.project.deleteMany({
          where: { managerId: id },
        });
      }

      // 5. Finally delete the user
      await tx.user.delete({
        where: { id },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting employee:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Employee not found" },
          { status: 404 }
        );
      }

      // Handle other known Prisma errors
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
