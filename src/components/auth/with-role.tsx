"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserRole } from "@/contexts/user-context";
import { showToast } from "@/lib/toast";

export function withRole(
  WrappedComponent: React.ComponentType,
  allowedRoles: UserRole[]
) {
  return function ProtectedRoute(props: any) {
    const { user, loading, hasPermission } = useUser();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !hasPermission(allowedRoles)) {
        showToast("You don't have permission to access this page", {
          type: "error",
        });
        router.push("/dashboard");
      }
    }, [loading, hasPermission, router]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
        </div>
      );
    }

    if (!user || !hasPermission(allowedRoles)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
