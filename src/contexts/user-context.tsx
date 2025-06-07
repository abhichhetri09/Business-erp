"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

export type UserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  checkAuth: () => Promise<void>;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isEmployee: () => boolean;
}

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
      const response = await fetch("/api/auth/me");

      if (response.ok) {
        const data = await response.json();
        console.log("Auth check successful, user:", data.user);
        setState((prev) => ({
          ...prev,
          user: data.user,
          loading: false,
          initialized: true,
        }));
      } else {
        console.log("Auth check failed, clearing user state");
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

  useEffect(() => {
    checkAuth();
  }, []);

  const hasPermission = (requiredRoles: UserRole[]) => {
    if (!state.user) return false;
    return requiredRoles.includes(state.user.role);
  };

  const isAdmin = () => state.user?.role === "ADMIN";
  const isManager = () => state.user?.role === "MANAGER";
  const isEmployee = () => state.user?.role === "EMPLOYEE";

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        initialized: state.initialized,
        checkAuth,
        hasPermission,
        isAdmin,
        isManager,
        isEmployee,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
