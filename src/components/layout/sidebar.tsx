"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/layout";

interface NavItem {
  label: string;
  href: string;
  icon: keyof typeof Icons;
  items?: NavItem[];
}

const navigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "home",
  },
  {
    label: "HR Management",
    href: "/dashboard/hr",
    icon: "users",
    items: [
      {
        label: "Employees",
        href: "/dashboard/employees",
        icon: "users",
      },
      {
        label: "Time Tracking",
        href: "/dashboard/time",
        icon: "clock",
      },
      {
        label: "Leave Management",
        href: "/dashboard/leave",
        icon: "calendar",
      },
      {
        label: "Payroll",
        href: "/dashboard/payroll",
        icon: "creditCard",
      },
    ],
  },
  {
    label: "Project Management",
    href: "/dashboard/projects",
    icon: "projects",
    items: [
      {
        label: "Projects",
        href: "/dashboard/projects",
        icon: "projects",
      },
      {
        label: "Tasks",
        href: "/dashboard/tasks",
        icon: "tasks",
      },
      {
        label: "Timeline",
        href: "/dashboard/timeline",
        icon: "timeline",
      },
      {
        label: "Reports",
        href: "/dashboard/project-reports",
        icon: "reports",
      },
    ],
  },
  {
    label: "Finance",
    href: "/dashboard/finance",
    icon: "finance",
    items: [
      {
        label: "Overview",
        href: "/dashboard/finance",
        icon: "finance",
      },
      {
        label: "Invoices",
        href: "/dashboard/invoices",
        icon: "invoice",
      },
      {
        label: "Expenses",
        href: "/dashboard/expenses",
        icon: "expenses",
      },
      {
        label: "Budget",
        href: "/dashboard/budget",
        icon: "budget",
      },
    ],
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: "analytics",
    items: [
      {
        label: "Overview",
        href: "/dashboard/analytics",
        icon: "analytics",
      },
      {
        label: "Reports",
        href: "/dashboard/reports",
        icon: "charts",
      },
      {
        label: "Presentations",
        href: "/dashboard/presentations",
        icon: "presentation",
      },
    ],
  },
  {
    label: "Documents",
    href: "/dashboard/documents",
    icon: "documents",
    items: [
      {
        label: "All Documents",
        href: "/dashboard/documents",
        icon: "documents",
      },
      {
        label: "Contracts",
        href: "/dashboard/contracts",
        icon: "clipboard",
      },
    ],
  },
  {
    label: "Communication",
    href: "/dashboard/communication",
    icon: "messages",
    items: [
      {
        label: "Messages",
        href: "/dashboard/messages",
        icon: "messages",
      },
      {
        label: "Email",
        href: "/dashboard/email",
        icon: "email",
      },
    ],
  },
  {
    label: "Organization",
    href: "/dashboard/organization",
    icon: "company",
    items: [
      {
        label: "Company",
        href: "/dashboard/company",
        icon: "company",
      },
      {
        label: "Departments",
        href: "/dashboard/departments",
        icon: "department",
      },
    ],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
  },
];

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Auto-expand the section containing the current page
    const currentSection = navigation.find((item) =>
      item.items?.some((subItem) => subItem.href === pathname)
    );
    if (currentSection && !expandedSections.includes(currentSection.href)) {
      setExpandedSections((prev) => [...prev, currentSection.href]);
    }
  }, [pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSection = (href: string) => {
    setExpandedSections((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const renderNavItems = (items: NavItem[], level = 0) => {
    return items.map((item) => {
      const isActive = pathname === item.href;
      const hasSubItems = item.items && item.items.length > 0;
      const isExpanded = expandedSections.includes(item.href);
      const Icon = Icons[item.icon];
      const isSubItemActive = item.items?.some(
        (subItem) => subItem.href === pathname
      );

      return (
        <div key={item.href} className="relative">
          {hasSubItems ? (
            <button
              onClick={() => toggleSection(item.href)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-200",
                isSubItemActive
                  ? "text-primary-900 dark:text-primary-100 bg-primary-50 dark:bg-primary-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                level > 0 && "ml-4"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4 transition-colors duration-200",
                    isSubItemActive
                      ? "text-primary-500"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                />
                <span>{item.label}</span>
              </div>
              <Icons.chevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isExpanded ? "rotate-180" : "rotate-0"
                )}
              />
            </button>
          ) : (
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-200",
                isActive
                  ? "text-primary-900 dark:text-primary-100 bg-primary-50 dark:bg-primary-900/20"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                level > 0 && "ml-4"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 transition-colors duration-200",
                  isActive
                    ? "text-primary-500"
                    : "text-gray-500 dark:text-gray-400"
                )}
              />
              <span>{item.label}</span>
            </Link>
          )}
          {hasSubItems && isExpanded && (
            <div className="mt-1 space-y-1">
              {item.items?.map((subItem) => {
                const isSubActive = pathname === subItem.href;
                const SubIcon = Icons[subItem.icon];
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "flex items-center gap-3 pl-10 pr-3 py-2 text-sm rounded-lg transition-colors duration-200",
                      isSubActive
                        ? "text-primary-900 dark:text-primary-100 bg-primary-50 dark:bg-primary-900/20"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <SubIcon
                      className={cn(
                        "h-4 w-4 transition-colors duration-200",
                        isSubActive
                          ? "text-primary-500"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                    />
                    <span>{subItem.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out dark:bg-gray-900 dark:border-gray-800",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Icons.briefcase className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Business ERP
              </span>
            </Link>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <Icons.close className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {renderNavItems(navigation)}
          </nav>

          {/* Sidebar footer */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Toggle button */}
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className={cn(
            "fixed left-0 top-4 z-50 rounded-r-lg bg-white p-2 shadow-md transition-all duration-200 ease-in-out dark:bg-gray-900",
            isOpen ? "translate-x-64" : "translate-x-0",
            "hover:bg-gray-100 dark:hover:bg-gray-800"
          )}
        >
          {isOpen ? (
            <Icons.close className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Icons.menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      )}
    </>
  );
}
