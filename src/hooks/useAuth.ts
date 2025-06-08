import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserRole } from "@/contexts/user-context";
import { useUser } from "@/contexts/user-context";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
}

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { updateUserState } = useUser();
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false,
  });

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
      console.log("Auth check response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Auth check successful, user:", data.user);
        setState((prev) => ({
          ...prev,
          user: data.user,
          loading: false,
          initialized: true,
        }));
        // Update user context
        updateUserState(data.user);
        return true;
      } else {
        console.log("Auth check failed, clearing user state");
        setState((prev) => ({
          ...prev,
          user: null,
          loading: false,
          initialized: true,
        }));
        // Update user context
        updateUserState(null);
        return false;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setState((prev) => ({
        ...prev,
        user: null,
        loading: false,
        initialized: true,
      }));
      // Update user context
      updateUserState(null);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to sign in");
      }

      const data = await response.json();

      // Update both local state and user context
      setState((prev) => ({ ...prev, user: data.user, loading: false }));
      updateUserState(data.user);

      // Cache the user data in sessionStorage
      sessionStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error("Sign-in error:", error);
      setState((prev) => ({ ...prev, user: null, loading: false }));
      updateUserState(null);
      // Clear cached user data
      sessionStorage.removeItem("user");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to sign in",
      };
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      console.log("Making signup request...");
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      console.log("Response status:", response.status);
      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error("Sign-up error details:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to sign up",
      };
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      setState((prev) => ({ ...prev, user: null, loading: false }));
      updateUserState(null);
      // Clear cached user data
      sessionStorage.removeItem("user");
      router.push("/auth/signin");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // Add initial state check from sessionStorage
  useEffect(() => {
    const cachedUser = sessionStorage.getItem("user");
    if (cachedUser) {
      try {
        const userData = JSON.parse(cachedUser);
        setState((prev) => ({ ...prev, user: userData, loading: false }));
        updateUserState(userData);
      } catch (e) {
        console.error("Failed to parse cached user data:", e);
        sessionStorage.removeItem("user");
      }
    }
    checkAuth();
  }, []);

  const { user, loading } = state;

  return {
    user,
    loading,
    signIn,
    signOut,
    checkAuth,
  };
}
