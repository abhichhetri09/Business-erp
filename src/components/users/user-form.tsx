"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface UserFormData {
  name: string;
  email: string;
  role: string;
}

interface User extends UserFormData {
  id: string;
  projects: any[];
  timeEntries: any[];
}

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const roleOptions = [
  { value: "EMPLOYEE", label: "Employee" },
  { value: "MANAGER", label: "Manager" },
  { value: "ADMIN", label: "Administrator" },
];

export function UserForm({
  user,
  onSubmit,
  onCancel,
  isLoading,
}: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "EMPLOYEE",
  });

  const [errors, setErrors] = useState<Partial<UserFormData>>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof UserFormData, boolean>>
  >({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    }
  }, [user]);

  const validateField = (name: keyof UserFormData, value: string) => {
    switch (name) {
      case "name":
        return value.trim().length < 2
          ? "Name must be at least 2 characters"
          : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Invalid email address"
          : "";
      case "role":
        return !roleOptions.some((option) => option.value === value)
          ? "Invalid role"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (name: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Partial<UserFormData> = {};
    (Object.keys(formData) as Array<keyof UserFormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      role: true,
    });

    if (Object.keys(newErrors).length === 0) {
      await onSubmit(formData);
    }
  };

  const renderField = (
    name: keyof UserFormData,
    label: string,
    type: string = "text"
  ) => {
    const error = touched[name] ? errors[name] : "";

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          <span className="text-red-500 ml-1">*</span>
        </label>
        {type === "select" ? (
          <select
            value={formData[name]}
            onChange={(e) => handleChange(name, e.target.value)}
            className={cn(
              "w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
              error
                ? "border-red-300 dark:border-red-700"
                : "border-gray-300 dark:border-gray-700"
            )}
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={formData[name]}
            onChange={(e) => handleChange(name, e.target.value)}
            className={cn(
              "w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
              error
                ? "border-red-300 dark:border-red-700"
                : "border-gray-300 dark:border-gray-700"
            )}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
        )}
      </div>
    );
  };

  // Check if there are any actual validation errors (not just untouched fields)
  const hasValidationErrors = Object.values(errors).some(
    (error) => error !== ""
  );

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute right-2 top-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">
          {user ? "Edit Employee" : "Add New Employee"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderField("name", "Full Name")}
          {renderField("email", "Email Address", "email")}
          {renderField("role", "Role", "select")}

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t dark:border-gray-700">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={hasValidationErrors}
            >
              {user ? "Update Employee" : "Add Employee"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
