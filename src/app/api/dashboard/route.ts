import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Get total employees
    const totalEmployees = await prisma.user.count();
    const lastMonthEmployees = await prisma.user.count({
      where: {
        createdAt: {
          lt: new Date(),
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });

    // Get active projects
    const activeProjects = await prisma.project.count({
      where: { status: "ACTIVE" },
    });
    const lastMonthProjects = await prisma.project.count({
      where: {
        status: "ACTIVE",
        createdAt: {
          lt: new Date(),
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    });

    // Get total hours tracked this month
    const thisMonthHours = await prisma.timeEntry.aggregate({
      _sum: {
        hours: true,
      },
      where: {
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });
    const lastMonthHours = await prisma.timeEntry.aggregate({
      _sum: {
        hours: true,
      },
      where: {
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    // Get total expenses this month
    const thisMonthExpenses = await prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });
    const lastMonthExpenses = await prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    // Get revenue data (expenses by month for the last 6 months)
    const revenueData = await prisma.expense.groupBy({
      by: ["date"],
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Get project distribution
    const projectDistribution = await prisma.project.groupBy({
      by: ["status"],
      _count: true,
    });

    // Get employee attendance (mocked since we don't have attendance model)
    const employeeAttendance = [
      { day: "Mon", present: totalEmployees - 3, absent: 3 },
      { day: "Tue", present: totalEmployees - 1, absent: 1 },
      { day: "Wed", present: totalEmployees - 4, absent: 4 },
      { day: "Thu", present: totalEmployees - 2, absent: 2 },
      { day: "Fri", present: totalEmployees - 5, absent: 5 },
    ];

    return NextResponse.json({
      stats: {
        employees: {
          total: totalEmployees,
          change: lastMonthEmployees,
          changeType: lastMonthEmployees > 0 ? "increase" : "decrease",
        },
        projects: {
          total: activeProjects,
          change: lastMonthProjects,
          changeType: lastMonthProjects > 0 ? "increase" : "decrease",
        },
        hours: {
          total: thisMonthHours._sum.hours || 0,
          change:
            (thisMonthHours._sum.hours || 0) - (lastMonthHours._sum.hours || 0),
          changeType:
            (thisMonthHours._sum.hours || 0) >= (lastMonthHours._sum.hours || 0)
              ? "increase"
              : "decrease",
        },
        expenses: {
          total: thisMonthExpenses._sum.amount || 0,
          change:
            (thisMonthExpenses._sum.amount || 0) -
            (lastMonthExpenses._sum.amount || 0),
          changeType:
            (thisMonthExpenses._sum.amount || 0) >=
            (lastMonthExpenses._sum.amount || 0)
              ? "increase"
              : "decrease",
        },
      },
      revenueData: revenueData.map((entry) => ({
        month: new Date(entry.date).toLocaleString("default", {
          month: "short",
        }),
        revenue: entry._sum.amount,
      })),
      projectDistribution: projectDistribution.map((entry) => ({
        name: entry.status,
        value: entry._count,
      })),
      employeeAttendance,
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
