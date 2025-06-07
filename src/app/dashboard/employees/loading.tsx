import { Card } from "@/components/ui/card";

export default function EmployeesLoading() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>

      <Card>
        <div className="p-6">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
