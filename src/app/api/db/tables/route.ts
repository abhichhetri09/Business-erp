import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get all tables and their row counts
    const tables = await Promise.all([
      prisma.user.count().then((count) => ({ name: "User", rowCount: count })),
      prisma.project
        .count()
        .then((count) => ({ name: "Project", rowCount: count })),
      prisma.timeEntry
        .count()
        .then((count) => ({ name: "TimeEntry", rowCount: count })),
      prisma.expense
        .count()
        .then((count) => ({ name: "Expense", rowCount: count })),
    ]);

    return NextResponse.json(tables);
  } catch (error) {
    console.error("Failed to fetch tables:", error);
    return NextResponse.json(
      { error: "Failed to fetch database tables" },
      { status: 500 }
    );
  }
}
