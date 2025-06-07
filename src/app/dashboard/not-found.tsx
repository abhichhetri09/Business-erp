import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
        404
      </h1>
      <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
        Page not found
      </p>
      <p className="mt-2 text-gray-500 dark:text-gray-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button variant="outline" className="mt-8">
        <Link href="/dashboard">
          <HomeIcon className="h-5 w-5 mr-2" />
          Return to Dashboard
        </Link>
      </Button>
    </div>
  );
}
