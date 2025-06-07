"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["EMPLOYEE", "MANAGER", "ADMIN"]),
  department: z.string().min(1, "Department is required"),
  startDate: z.string().min(1, "Start date is required"),
  salary: z.string().min(1, "Salary is required"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  initialData?: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => Promise<void>;
  onCancel: () => void;
}

export function EmployeeForm({
  initialData,
  onSubmit,
  onCancel,
}: EmployeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData,
  });

  const onSubmitHandler = async (data: EmployeeFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          Name
        </label>
        <div className="mt-2">
          <Input
            type="text"
            id="name"
            {...register("name")}
            error={errors.name?.message}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          Email
        </label>
        <div className="mt-2">
          <Input
            type="email"
            id="email"
            {...register("email")}
            error={errors.email?.message}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          Role
        </label>
        <div className="mt-2">
          <select
            id="role"
            {...register("role")}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-100 dark:bg-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
          >
            <option value="EMPLOYEE">Employee</option>
            <option value="MANAGER">Manager</option>
            <option value="ADMIN">Admin</option>
          </select>
          {errors.role && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.role.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="department"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          Department
        </label>
        <div className="mt-2">
          <Input
            type="text"
            id="department"
            {...register("department")}
            error={errors.department?.message}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="startDate"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          Start Date
        </label>
        <div className="mt-2">
          <Input
            type="date"
            id="startDate"
            {...register("startDate")}
            error={errors.startDate?.message}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="salary"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          Salary
        </label>
        <div className="mt-2">
          <Input
            type="number"
            id="salary"
            {...register("salary")}
            error={errors.salary?.message}
          />
        </div>
      </div>

      <div className="flex justify-end gap-x-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
