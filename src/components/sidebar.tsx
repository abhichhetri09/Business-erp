"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  InboxIcon,
  CircleStackIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  {
    name: "HR Management",
    icon: UsersIcon,
    children: [
      { name: "Employees", href: "/dashboard/employees" },
      { name: "Attendance", href: "/dashboard/attendance" },
      { name: "Leave", href: "/dashboard/leave" },
      { name: "Payroll", href: "/dashboard/payroll" },
    ],
  },
  {
    name: "Project Management",
    icon: ClipboardDocumentListIcon,
    children: [
      { name: "Projects", href: "/dashboard/projects" },
      { name: "Tasks", href: "/dashboard/tasks" },
      { name: "Timeline", href: "/dashboard/timeline" },
      { name: "Reports", href: "/dashboard/project-reports" },
    ],
  },
  {
    name: "Finance",
    icon: CurrencyDollarIcon,
    children: [
      { name: "Invoices", href: "/dashboard/invoices" },
      { name: "Expenses", href: "/dashboard/expenses" },
      { name: "Budget", href: "/dashboard/budget" },
      { name: "Reports", href: "/dashboard/finance-reports" },
    ],
  },
  { name: "Analytics", href: "/dashboard/analytics", icon: ChartBarIcon },
  { name: "Documents", href: "/dashboard/documents", icon: DocumentTextIcon },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
  { name: "Messages", href: "/dashboard/messages", icon: InboxIcon },
  { name: "Database", href: "/dashboard/db", icon: CircleStackIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6">
        <Link href="/dashboard" className="flex items-center">
          <span className="text-xl font-semibold">Business ERP</span>
        </Link>
        <ThemeToggle />
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-1 flex-col py-4">
          <ul role="list" className="space-y-1 px-3">
            {navigation.map((item) => (
              <li key={item.name}>
                {!item.children ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      pathname === item.href
                        ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-500"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5 flex-shrink-0",
                        pathname === item.href
                          ? "text-blue-600 dark:text-blue-500"
                          : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400"
                      )}
                    />
                    {item.name}
                  </Link>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <item.icon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      {item.name}
                    </div>
                    <ul className="space-y-1 pl-11">
                      {item.children.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            className={cn(
                              "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                              pathname === subItem.href
                                ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-500"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <UserCircleIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                admin@example.com
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Cog6ToothIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
