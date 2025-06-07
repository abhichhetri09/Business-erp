import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRole } from "@/middleware/role-middleware";
import { hash } from "bcryptjs";

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

    // Delete employee
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
