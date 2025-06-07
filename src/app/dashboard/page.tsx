"use client";

import { useEffect, useState } from "react";
import {
  UsersIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";
import { LoadingPage, LoadingCard } from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface DashboardData {
  stats: {
    employees: { total: number; change: number; changeType: string };
    projects: { total: number; change: number; changeType: string };
    hours: { total: number; change: number; changeType: string };
    expenses: { total: number; change: number; changeType: string };
  };
  revenueData: Array<{ month: string; revenue: number }>;
  projectDistribution: Array<{ name: string; value: number }>;
  employeeAttendance: Array<{ day: string; present: number; absent: number }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const dashboardData = await response.json();
        setData(dashboardData);
        showToast("Dashboard data loaded successfully", { type: "success" });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An error occurred";
        setError(message);
        showToast(message, { type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <main className="p-8">
        <Card className="p-6 border-red-200 bg-red-50 dark:bg-red-900/10">
          <div className="flex items-center text-red-700 dark:text-red-400">
            <span className="font-medium">Error: {error}</span>
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  if (!data) return null;

  const stats = [
    {
      name: "Total Employees",
      value: data.stats.employees.total.toString(),
      icon: UsersIcon,
      change:
        (data.stats.employees.change > 0 ? "+" : "") +
        data.stats.employees.change,
      changeType: data.stats.employees.changeType,
    },
    {
      name: "Active Projects",
      value: data.stats.projects.total.toString(),
      icon: ClipboardDocumentListIcon,
      change:
        (data.stats.projects.change > 0 ? "+" : "") +
        data.stats.projects.change,
      changeType: data.stats.projects.changeType,
    },
    {
      name: "Hours Tracked",
      value: data.stats.hours.total.toFixed(1),
      icon: ClockIcon,
      change:
        (data.stats.hours.change > 0 ? "+" : "") +
        data.stats.hours.change.toFixed(1),
      changeType: data.stats.hours.changeType,
    },
    {
      name: "Monthly Expenses",
      value: `$${data.stats.expenses.total.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      change:
        (data.stats.expenses.change > 0 ? "+" : "") +
        (
          (data.stats.expenses.change / data.stats.expenses.total) *
          100
        ).toFixed(1) +
        "%",
      changeType: data.stats.expenses.changeType,
    },
  ];

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.location.reload()}
          leftIcon={
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          }
        >
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900">
                <stat.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.changeType === "increase" ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`ml-2 text-sm ${
                  stat.changeType === "increase"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stat.change}
              </span>
              <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                from last month
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <Button variant="link" size="sm">
              View Details
            </Button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Employee Attendance</h2>
            <Button variant="link" size="sm">
              View Details
            </Button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.employeeAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="present" fill="#4CAF50" />
                <Bar dataKey="absent" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Project Distribution</h2>
          <Button variant="info" size="sm">
            View All Projects
          </Button>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.projectDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.projectDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {data.projectDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.name}: {entry.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </main>
  );
}
