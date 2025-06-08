"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

// Role hierarchy definition
const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  ADMIN: ["ADMIN", "MANAGER", "EMPLOYEE"],
  MANAGER: ["MANAGER", "EMPLOYEE"],
  EMPLOYEE: ["EMPLOYEE"],
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type UserContextType = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  hasPermission: (roles: UserRole[]) => boolean;
  checkAuth: () => Promise<void>;
  updateUserState: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    user: User | null;
    loading: boolean;
    initialized: boolean;
  }>({
    user: null,
    loading: true,
    initialized: false,
  });

  const router = useRouter();

  const checkAuth = async () => {
    try {
      console.log("Checking auth status...");
      const response = await fetch("/api/auth/me", {
        cache: "no-store",
        headers: {
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
      });
      const contentType = response.headers.get("content-type");

      // Ensure we're getting JSON response
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Non-JSON response from auth endpoint:", contentType);
        setState((prev) => ({
          ...prev,
          user: null,
          loading: false,
          initialized: true,
        }));
        return;
      }

      const data = await response.json();

      if (response.ok) {
        console.log("Auth check successful, user:", data.user);
        setState((prev) => ({
          ...prev,
          user: data.user,
          loading: false,
          initialized: true,
        }));
      } else {
        console.log("Auth check failed:", data.error);
        setState((prev) => ({
          ...prev,
          user: null,
          loading: false,
          initialized: true,
        }));
      }
    } catch (error) {
      console.error("Auth check error:", error);
      showToast("Failed to check authentication status", { type: "error" });
      setState((prev) => ({
        ...prev,
        user: null,
        loading: false,
        initialized: true,
      }));
    }
  };

  // Add function to update user state directly
  const updateUserState = (user: User | null) => {
    setState((prev) => ({
      ...prev,
      user,
      loading: false,
      initialized: true,
    }));
  };

  useEffect(() => {
    // Try to get user from sessionStorage first
    const cachedUser = sessionStorage.getItem("user");
    if (cachedUser) {
      try {
        const userData = JSON.parse(cachedUser);
        updateUserState(userData);
      } catch (e) {
        console.error("Failed to parse cached user data:", e);
        sessionStorage.removeItem("user");
      }
    }
    checkAuth();
  }, []);

  const hasPermission = (roles: UserRole[]) => {
    if (!state.user) return false;
    const userRoles = ROLE_HIERARCHY[state.user.role];
    return roles.some((role) => userRoles.includes(role));
  };

  const contextValue = useMemo(
    () => ({
      user: state.user,
      loading: state.loading,
      initialized: state.initialized,
      hasPermission,
      checkAuth,
      updateUserState,
    }),
    [state, hasPermission]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
