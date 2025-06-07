import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      include: {
        user: true,
        project: true,
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const expense = await prisma.expense.create({
      data: {
        userId: body.userId,
        projectId: body.projectId,
        amount: body.amount,
        description: body.description,
        date: new Date(body.date),
        status: body.status || "PENDING",
      },
      include: {
        user: true,
        project: true,
      },
    });
    return NextResponse.json(expense);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
