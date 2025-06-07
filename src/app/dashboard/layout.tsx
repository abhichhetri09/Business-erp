"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open on desktop
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile); // Open by default on desktop, closed on mobile
    };

    setMounted(true);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-200",
          sidebarOpen && !isMobile && "ml-72" // Update margin to match new sidebar width
        )}
      >
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-4 py-2">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <Bars3Icon className="h-6 w-6" />
              </Button>
              <span className="ml-2 text-lg font-semibold">Business ERP</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
