"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Something went wrong!
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {error.message || "An unexpected error occurred"}
        </p>
        <Button onClick={reset} variant="primary" className="mt-4">
          Try again
        </Button>
      </div>
    </main>
  );
}
