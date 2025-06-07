"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { showToast } from "@/lib/toast";
import { LoadingPage } from "@/components/ui/loading";

// Modern color palette
const CHART_COLORS = {
  primary: {
    main: "#334155", // slate-700
    light: "#64748b", // slate-500
    lighter: "#94a3b8", // slate-400
    dark: "#1e293b", // slate-800
  },
  accent: {
    blue: "#3b82f6", // blue-500
    green: "#22c55e", // green-500
    yellow: "#eab308", // yellow-500
    red: "#ef4444", // red-500
    purple: "#a855f7", // purple-500
  },
  chart: {
    grid: "#e2e8f0", // slate-200
    text: "#64748b", // slate-500
  },
};

const PIE_COLORS = [
  CHART_COLORS.accent.blue,
  CHART_COLORS.accent.green,
  CHART_COLORS.accent.yellow,
  CHART_COLORS.accent.purple,
];

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      const dashboardData = await response.json();
      setData(dashboardData);
      showToast("Dashboard refreshed successfully", { type: "success" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      showToast(message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

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
              onClick={handleRefresh}
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
      name: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      changeType: "increase",
      icon: Icons.finance,
      color: CHART_COLORS.accent.blue,
    },
    {
      name: "Active Projects",
      value: "12",
      change: "+2.5%",
      changeType: "increase",
      icon: Icons.projects,
      color: CHART_COLORS.accent.green,
    },
    {
      name: "Team Members",
      value: "24",
      change: "-0.5%",
      changeType: "decrease",
      icon: Icons.users,
      color: CHART_COLORS.accent.yellow,
    },
    {
      name: "Pending Tasks",
      value: "47",
      change: "+4.2%",
      changeType: "increase",
      icon: Icons.tasks,
      color: CHART_COLORS.accent.purple,
    },
  ];

  return (
    <main className="p-4 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 lg:mb-8 animate-fade-in">
        <h1 className="text-2xl lg:text-3xl font-bold">Dashboard Overview</h1>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <Icons.loading className="h-4 w-4 animate-spin-slow" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card className="p-4 lg:p-6 h-[140px] flex flex-col justify-between">
              <div className="flex items-center">
                <div
                  className="p-2 lg:p-3 rounded-full"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon
                    className="h-5 w-5 lg:h-6 lg:w-6"
                    style={{ color: stat.color }}
                  />
                </div>
                <div className="ml-3 lg:ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-xl lg:text-2xl font-semibold">
                    {stat.value}
                  </p>
                </div>
              </div>
              <div className="mt-3 lg:mt-4 flex items-center">
                {stat.changeType === "increase" ? (
                  <Icons.trendUp className="h-4 w-4 text-green-500" />
                ) : (
                  <Icons.trendDown className="h-4 w-4 text-red-500" />
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
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 lg:mb-8">
        <div
          className="animate-slide-in-right"
          style={{ animationDelay: "200ms" }}
        >
          <Card className="p-4 lg:p-6 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Revenue Overview</h2>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Icons.presentation className="h-4 w-4" />
                View Details
              </Button>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS.accent.blue}
                        stopOpacity={0.1}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS.accent.blue}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.chart.grid}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={CHART_COLORS.chart.text}
                    tick={{ fill: CHART_COLORS.chart.text }}
                    padding={{ left: 0, right: 0 }}
                  />
                  <YAxis
                    stroke={CHART_COLORS.chart.text}
                    tick={{ fill: CHART_COLORS.chart.text }}
                    tickCount={6}
                    domain={[0, "auto"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke={CHART_COLORS.accent.blue}
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div
          className="animate-slide-in-right"
          style={{ animationDelay: "400ms" }}
        >
          <Card className="p-4 lg:p-6 h-[400px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Employee Attendance</h2>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Icons.users className="h-4 w-4" />
                View Details
              </Button>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.employeeAttendance}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.chart.grid}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke={CHART_COLORS.chart.text}
                    tick={{ fill: CHART_COLORS.chart.text }}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    stroke={CHART_COLORS.chart.text}
                    tick={{ fill: CHART_COLORS.chart.text }}
                    tickCount={6}
                    domain={[0, "auto"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="present"
                    name="Present"
                    fill={CHART_COLORS.accent.green}
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="absent"
                    name="Absent"
                    fill={CHART_COLORS.accent.red}
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      <div
        className="animate-slide-in-right"
        style={{ animationDelay: "600ms" }}
      >
        <Card className="p-4 lg:p-6 h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Project Distribution</h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Icons.briefcase className="h-4 w-4" />
              View All Projects
            </Button>
          </div>
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.projectDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.projectDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              {data.projectDistribution.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center transform transition-all duration-200 hover:translate-x-1"
                >
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{
                      backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                    }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
