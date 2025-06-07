"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons/index";
import { showToast } from "@/lib/toast";
import { useAuth } from "@/hooks/useAuth";

export default function SignInPage() {
  const { signIn, user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Get callback URL and email from search params
  const [callbackUrl, setCallbackUrl] = useState("/dashboard");

  useEffect(() => {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const callback = params.get("callbackUrl");
    const email = params.get("email");

    if (callback) {
      setCallbackUrl(callback);
    }
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      console.log("Already authenticated, redirecting to callback URL");
      router.push(callbackUrl);
    }
  }, [user, loading, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Submitting sign-in form...");
      const result = await signIn(formData.email, formData.password);
      console.log("Sign-in result:", result);

      if (!result.success) {
        throw new Error(result.error);
      }

      showToast("Signed in successfully! Redirecting...", {
        type: "success",
      });

      // Force navigation after a short delay
      setTimeout(() => {
        console.log("Forcing navigation to:", callbackUrl);
        router.push(callbackUrl);
        router.refresh();
      }, 100);
    } catch (error) {
      console.error("Sign-in form error:", error);
      showToast(error instanceof Error ? error.message : "Failed to sign in", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Icons.loading className="h-8 w-8 animate-spin mx-auto text-primary-500" />
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  // Don't show the form if already authenticated
  if (user) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white dark:bg-gray-800">
        <div className="text-center space-y-2">
          <Icons.briefcase className="h-12 w-12 mx-auto text-primary-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome Back
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            icon="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            icon="user"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/auth/signup"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
          >
            Sign up
          </Link>
        </div>
      </Card>
    </main>
  );
}
