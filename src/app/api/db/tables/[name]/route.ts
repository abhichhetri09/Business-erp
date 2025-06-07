import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  try {
    const tableName = params.name.toLowerCase();
    let data;

    switch (tableName) {
      case "user":
        data = await prisma.user.findMany({
          include: {
            projects: {
              select: {
                id: true,
                name: true,
              },
            },
            managedProjects: {
              select: {
                id: true,
                name: true,
              },
            },
            timeEntries: {
              select: {
                id: true,
                date: true,
                hours: true,
              },
            },
            expenses: {
              select: {
                id: true,
                amount: true,
                date: true,
              },
            },
          },
        });
        break;

      case "project":
        data = await prisma.project.findMany({
          include: {
            manager: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            members: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            timeEntries: {
              select: {
                id: true,
                date: true,
                hours: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            expenses: {
              select: {
                id: true,
                amount: true,
                date: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });
        break;

      case "timeentry":
        data = await prisma.timeEntry.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        break;

      case "expense":
        data = await prisma.expense.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid table name" },
          { status: 400 }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(`Failed to fetch ${params.name} data:`, error);
    return NextResponse.json(
      { error: `Failed to fetch ${params.name} data` },
      { status: 500 }
    );
  }
}
