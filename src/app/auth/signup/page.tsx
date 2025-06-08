"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { showToast } from "@/lib/toast";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/layout";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      console.log("Attempting to sign up...");
      const result = await signUp(
        formData.name,
        formData.email,
        formData.password
      );
      console.log("Sign-up result:", result);

      if (!result.success) {
        throw new Error(result.error);
      }

      showToast(
        "Account created successfully! Please sign in with your new account.",
        {
          type: "success",
          duration: 5000, // Show for 5 seconds
        }
      );

      // Wait a moment for the toast to be visible before redirecting
      setTimeout(() => {
        router.push("/auth/signin?email=" + encodeURIComponent(formData.email));
      }, 1000);
    } catch (error) {
      console.error("Sign-up error:", error);
      showToast(error instanceof Error ? error.message : "Failed to sign up", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md p-6 space-y-6 bg-white dark:bg-gray-800">
        <div className="text-center space-y-2">
          <Icons.briefcase className="h-12 w-12 mx-auto text-primary-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create an Account
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign up to start using Business ERP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            icon="user"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />
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
            error={errors.email}
          />
          <Input
            type="password"
            label="Password"
            placeholder="Create a password"
            icon="eyeOff"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={errors.password}
          />
          <Input
            type="password"
            label="Confirm Password"
            placeholder="Confirm your password"
            icon="eyeOff"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Sign Up
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
          </span>
          <Link
            href="/auth/signin"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
          >
            Sign in
          </Link>
        </div>
      </Card>
    </main>
  );
}
