"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/layout";
import { useUser, UserRole } from "@/contexts/user-context";

interface NavItem {
  label: string;
  href: string;
  icon: keyof typeof Icons;
  roles: UserRole[];
  items?: NavItem[];
}

const navigation: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "home",
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    label: "HR Management",
    href: "/dashboard/hr",
    icon: "users",
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    items: [
      {
        label: "Employees",
        href: "/dashboard/employees",
        icon: "users",
        roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
      },
      {
        label: "Time Tracking",
        href: "/dashboard/time",
        icon: "clock",
        roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
      },
      {
        label: "Attendance",
        href: "/dashboard/attendance",
        icon: "clock",
        roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
      },
      {
        label: "Leave Management",
        href: "/dashboard/leave",
        icon: "calendar",
        roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
      },
      {
        label: "Payroll",
        href: "/dashboard/payroll",
        icon: "creditCard",
        roles: ["ADMIN", "MANAGER"],
      },
    ],
  },
  {
    label: "Project Management",
    href: "/dashboard/projects",
    icon: "projects",
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    items: [
      {
        label: "Projects",
        href: "/dashboard/projects",
        icon: "projects",
        roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
      },
      {
        label: "Tasks",
        href: "/dashboard/tasks",
        icon: "tasks",
        roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
      },
      {
        label: "Timeline",
        href: "/dashboard/timeline",
        icon: "timeline",
        roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
      },
      {
        label: "Reports",
        href: "/dashboard/project-reports",
        icon: "reports",
        roles: ["ADMIN", "MANAGER"],
      },
    ],
  },
  {
    label: "Finance",
    href: "/dashboard/finance",
    icon: "finance",
    roles: ["ADMIN", "MANAGER"],
    items: [
      {
        label: "Overview",
        href: "/dashboard/finance",
        icon: "finance",
        roles: ["ADMIN", "MANAGER"],
      },
      {
        label: "Invoices",
        href: "/dashboard/invoices",
        icon: "invoice",
        roles: ["ADMIN", "MANAGER"],
      },
      {
        label: "Expenses",
        href: "/dashboard/expenses",
        icon: "expenses",
        roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
      },
      {
        label: "Budget",
        href: "/dashboard/budget",
        icon: "budget",
        roles: ["ADMIN", "MANAGER"],
      },
    ],
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: "analytics",
    roles: ["ADMIN", "MANAGER"],
    items: [
      {
        label: "Overview",
        href: "/dashboard/analytics",
        icon: "analytics",
        roles: ["ADMIN", "MANAGER"],
      },
      {
        label: "Reports",
        href: "/dashboard/reports",
        icon: "charts",
        roles: ["ADMIN", "MANAGER"],
      },
      {
        label: "Presentations",
        href: "/dashboard/presentations",
        icon: "presentation",
        roles: ["ADMIN", "MANAGER"],
      },
    ],
  },
  {
    label: "Documents",
    href: "/dashboard/documents",
    icon: "documents",
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    items: [
      {
        label: "All Documents",
        href: "/dashboard/documents",
        icon: "documents",
        roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
      },
      {
        label: "Contracts",
        href: "/dashboard/contracts",
        icon: "clipboard",
        roles: ["ADMIN", "MANAGER"],
      },
    ],
  },
  {
    label: "Communication",
    href: "/dashboard/communication",
    icon: "messages",
    roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
    items: [
      {
        label: "Messages",
        href: "/dashboard/messages",
        icon: "messages",
        roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
      },
      {
        label: "Email",
        href: "/dashboard/email",
        icon: "email",
        roles: ["ADMIN", "MANAGER", "EMPLOYEE"],
      },
    ],
  },
  {
    label: "Organization",
    href: "/dashboard/organization",
    icon: "company",
    roles: ["ADMIN", "MANAGER"],
    items: [
      {
        label: "Company",
        href: "/dashboard/company",
        icon: "company",
        roles: ["ADMIN", "MANAGER"],
      },
      {
        label: "Departments",
        href: "/dashboard/departments",
        icon: "department",
        roles: ["ADMIN", "MANAGER"],
      },
    ],
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: "settings",
    roles: ["ADMIN"],
  },
  {
    label: "Database",
    href: "/dashboard/db",
    icon: "database",
    roles: ["ADMIN"],
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
  const { hasPermission, user, loading } = useUser();

  if (loading) {
    return (
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-72 transform bg-white border-r border-gray-200 transition-all duration-200 ease-in-out dark:bg-gray-900 dark:border-gray-800",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          }
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Icons.briefcase className="h-6 w-6 text-primary-500 animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex-1 p-4 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  if (!user) {
    return null;
  }

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

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", { method: "POST" });
      if (response.ok) {
        router.push("/auth/signin");
      }
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      if (!item.roles.some((role) => hasPermission([role]))) return null;

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
                    if (!subItem.roles.some((role) => hasPermission([role])))
                      return null;

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
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            >
              <Icons.close className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
