"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UsersIcon,
  BriefcaseIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DatabaseIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Employees",
    href: "/dashboard/employees",
    icon: UsersIcon,
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: BriefcaseIcon,
  },
  {
    name: "Time Entries",
    href: "/dashboard/time-entries",
    icon: ClockIcon,
  },
  {
    name: "Expenses",
    href: "/dashboard/expenses",
    icon: CurrencyDollarIcon,
  },
  {
    name: "Database",
    href: "/dashboard/db",
    icon: DatabaseIcon,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              isActive &&
                "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
