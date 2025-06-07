"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Icons.home },
  {
    name: "HR Management",
    icon: Icons.users,
    children: [
      { name: "Employees", href: "/dashboard/employees", icon: Icons.users },
      {
        name: "Recruitment",
        href: "/dashboard/recruitment",
        icon: Icons.userPlus,
      },
      { name: "Attendance", href: "/dashboard/attendance", icon: Icons.clock },
      {
        name: "Leave Management",
        href: "/dashboard/leave",
        icon: Icons.calendar,
      },
      { name: "Payroll", href: "/dashboard/payroll", icon: Icons.creditCard },
      {
        name: "Performance",
        href: "/dashboard/performance",
        icon: Icons.charts,
      },
    ],
  },
  {
    name: "Project Management",
    icon: Icons.projects,
    children: [
      {
        name: "Projects Overview",
        href: "/dashboard/projects",
        icon: Icons.briefcase,
      },
      { name: "Tasks", href: "/dashboard/tasks", icon: Icons.tasks },
      { name: "Timeline", href: "/dashboard/timeline", icon: Icons.timeline },
      { name: "Resources", href: "/dashboard/resources", icon: Icons.users },
      {
        name: "Reports",
        href: "/dashboard/project-reports",
        icon: Icons.reports,
      },
    ],
  },
  {
    name: "Finance",
    icon: Icons.finance,
    children: [
      { name: "Overview", href: "/dashboard/finance", icon: Icons.finance },
      { name: "Invoices", href: "/dashboard/invoices", icon: Icons.invoice },
      { name: "Expenses", href: "/dashboard/expenses", icon: Icons.expenses },
      { name: "Budget", href: "/dashboard/budget", icon: Icons.budget },
      {
        name: "Reports",
        href: "/dashboard/finance-reports",
        icon: Icons.reports,
      },
    ],
  },
  {
    name: "Analytics",
    icon: Icons.analytics,
    children: [
      { name: "Overview", href: "/dashboard/analytics", icon: Icons.analytics },
      { name: "Reports", href: "/dashboard/reports", icon: Icons.reports },
      { name: "Charts", href: "/dashboard/charts", icon: Icons.charts },
      {
        name: "Presentations",
        href: "/dashboard/presentations",
        icon: Icons.presentation,
      },
    ],
  },
  {
    name: "Documents",
    icon: Icons.documents,
    children: [
      {
        name: "All Documents",
        href: "/dashboard/documents",
        icon: Icons.documents,
      },
      {
        name: "Contracts",
        href: "/dashboard/contracts",
        icon: Icons.clipboard,
      },
      {
        name: "Templates",
        href: "/dashboard/templates",
        icon: Icons.documents,
      },
      { name: "Archive", href: "/dashboard/archive", icon: Icons.documents },
    ],
  },
  {
    name: "Communication",
    icon: Icons.messages,
    children: [
      { name: "Messages", href: "/dashboard/messages", icon: Icons.messages },
      { name: "Email", href: "/dashboard/email", icon: Icons.email },
      {
        name: "Notifications",
        href: "/dashboard/notifications",
        icon: Icons.messages,
      },
    ],
  },
  {
    name: "Organization",
    icon: Icons.company,
    children: [
      { name: "Company Info", href: "/dashboard/company", icon: Icons.company },
      {
        name: "Departments",
        href: "/dashboard/departments",
        icon: Icons.department,
      },
      { name: "Locations", href: "/dashboard/locations", icon: Icons.company },
    ],
  },
  { name: "Calendar", href: "/dashboard/calendar", icon: Icons.calendar },
  { name: "Database", href: "/dashboard/db", icon: Icons.database },
  {
    name: "Settings",
    icon: Icons.settings,
    children: [
      { name: "General", href: "/dashboard/settings", icon: Icons.settings },
      {
        name: "Security",
        href: "/dashboard/settings/security",
        icon: Icons.settings,
      },
      {
        name: "Integrations",
        href: "/dashboard/settings/integrations",
        icon: Icons.settings,
      },
      { name: "API", href: "/dashboard/settings/api", icon: Icons.database },
    ],
  },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const renderNavLink = (item: { name: string; href: string; icon: any }) => (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
        isActive(item.href)
          ? "bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 shadow-sm"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
      )}
      onClick={onClose}
    >
      <item.icon
        className={cn(
          "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200",
          isActive(item.href)
            ? "text-slate-600 dark:text-slate-300"
            : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
        )}
      />
      {item.name}
    </Link>
  );

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6">
        <Link
          href="/dashboard"
          className="flex items-center transition-transform hover:scale-105"
          onClick={onClose}
        >
          <span className="text-xl font-semibold">Business ERP</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <Icons.close className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-1 flex-col py-4">
          <ul role="list" className="space-y-1 px-3">
            {navigation.map((item, index) => (
              <li
                key={item.name}
                className="transform transition-transform duration-200 hover:translate-x-1"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {!item.children ? (
                  renderNavLink(item)
                ) : (
                  <div className="space-y-1">
                    <button
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-sm font-medium rounded-md group transition-all duration-200",
                        expandedItems.includes(item.name)
                          ? "bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                      onClick={() => toggleExpanded(item.name)}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-200" />
                        {item.name}
                      </div>
                      <Icons.chevronDown
                        className={cn(
                          "ml-3 h-4 w-4 transition-transform duration-200",
                          expandedItems.includes(item.name) ? "rotate-180" : ""
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-200",
                        expandedItems.includes(item.name)
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      )}
                    >
                      <ul className="space-y-1 pl-10">
                        {item.children.map((subItem) => (
                          <li
                            key={subItem.name}
                            className="transform transition-transform duration-200 hover:translate-x-1"
                          >
                            <Link
                              href={subItem.href}
                              className={cn(
                                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                                isActive(subItem.href)
                                  ? "bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-slate-300 shadow-sm"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                              )}
                              onClick={onClose}
                            >
                              <subItem.icon
                                className={cn(
                                  "mr-3 h-4 w-4 flex-shrink-0 transition-colors duration-200",
                                  isActive(subItem.href)
                                    ? "text-slate-600 dark:text-slate-300"
                                    : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                                )}
                              />
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="shrink-0 border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Icons.user className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                admin@example.com
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <Icons.settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
