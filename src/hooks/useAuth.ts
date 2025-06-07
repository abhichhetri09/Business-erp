import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserRole } from "@/contexts/user-context";

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
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    initialized: false,
  });

  const checkAuth = async () => {
    try {
      console.log("Checking auth status...");
      const response = await fetch("/api/auth/me");
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
        return true;
      } else {
        console.log("Auth check failed, clearing user state");
        setState((prev) => ({
          ...prev,
          user: null,
          loading: false,
          initialized: true,
        }));
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
      return false;
    }
  };

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in...");
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Sign in response status:", response.status);
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      console.log("Sign in response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      // Update auth state with user data including role
      setState((prev) => ({ ...prev, user: data.user, loading: false }));

      // Let the middleware handle the redirection
      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error("Sign-in error:", error);
      setState((prev) => ({ ...prev, user: null, loading: false }));
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
      router.push("/auth/signin");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    initialized: state.initialized,
    signIn,
    signUp,
    signOut,
  };
}
