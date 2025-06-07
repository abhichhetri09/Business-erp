"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
        label: "Attendance",
        href: "/dashboard/attendance",
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
  {
    label: "Database",
    href: "/dashboard/db",
    icon: "database",
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const currentSection = navigation.find((item) =>
      item.items?.some((subItem) => subItem.href === pathname)
    );
    if (currentSection && !expandedSections.includes(currentSection.href)) {
      setExpandedSections((prev) => [...prev, currentSection.href]);
    }
  }, [pathname]);

  const handleNavigation = (href: string, hasSubItems: boolean) => {
    if (!hasSubItems) {
      router.push(href);
      if (isMobile) {
        onClose();
      }
    }
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const Icon = item.icon ? Icons[item.icon] : null;
      const hasSubItems = Boolean(item.items?.length);

      return (
        <div key={item.label}>
          {hasSubItems ? (
            <div>
              <button
                onClick={() => {
                  setExpandedSections((prev) =>
                    prev.includes(item.label)
                      ? prev.filter((i) => i !== item.label)
                      : [...prev, item.label]
                  );
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
                  "whitespace-nowrap overflow-hidden",
                  pathname === item.href &&
                    "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </div>
                <Icons.chevronDown
                  className={cn(
                    "h-4 w-4 transition-transform flex-shrink-0 ml-2",
                    expandedSections.includes(item.label) && "rotate-180"
                  )}
                />
              </button>
              {expandedSections.includes(item.label) && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.items?.map((subItem) => {
                    const SubIcon = subItem.icon ? Icons[subItem.icon] : null;
                    return (
                      <button
                        key={subItem.label}
                        onClick={() => handleNavigation(subItem.href, false)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
                          "whitespace-nowrap overflow-hidden",
                          pathname === subItem.href &&
                            "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                        )}
                      >
                        {SubIcon && (
                          <SubIcon className="h-4 w-4 flex-shrink-0" />
                        )}
                        <span className="truncate">{subItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavigation(item.href, false)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
                pathname === item.href &&
                  "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{item.label}</span>
            </button>
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
          className="fixed inset-0 z-[60] bg-gray-600/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Toggle button for desktop */}
      {!isMobile && (
        <button
          onClick={onClose}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          className={cn(
            "fixed left-0 top-4 z-50 rounded-r-lg bg-white p-2 shadow-md transition-all duration-200 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800",
            isOpen ? "translate-x-72" : "translate-x-0"
          )}
        >
          {isOpen ? (
            <Icons.close className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Icons.menu className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-72 transform bg-white border-r border-gray-200 transition-all duration-200 ease-in-out dark:bg-gray-900 dark:border-gray-800",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
            "shadow-lg": isOpen && isMobile,
          }
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
              <Icons.briefcase className="h-6 w-6 text-primary-500 flex-shrink-0" />
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                Business ERP
              </span>
            </Link>
            {isMobile && (
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 ml-2 flex-shrink-0"
                aria-label="Close sidebar"
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
    </>
  );
}
