"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectOption } from "@/components/ui/select";
import { Icons } from "@/components/icons";
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

const roleOptions: SelectOption[] = [
  { value: "EMPLOYEE", label: "Employee", icon: "users" },
  { value: "MANAGER", label: "Manager", icon: "briefcase" },
  { value: "ADMIN", label: "Administrator", icon: "settings" },
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

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
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const renderField = (
    name: keyof UserFormData,
    label: string,
    type: string = "text"
  ) => {
    const error = touched[name] ? errors[name] : "";

    if (type === "select") {
      return (
        <Select
          id={name}
          name={name}
          value={formData[name]}
          onChange={(e) => handleChange(name, e.target.value)}
          options={roleOptions}
          label={label}
          required
          error={error}
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="transition-all duration-200"
        />
      );
    }

    return (
      <Input
        type={type}
        id={name}
        name={name}
        value={formData[name]}
        onChange={(e) => handleChange(name, e.target.value)}
        label={label}
        required
        error={error}
        icon={name === "email" ? "email" : "user"}
        disabled={isSubmitting}
        isLoading={isSubmitting}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="transition-all duration-200"
      />
    );
  };

  // Check if there are any actual validation errors (not just untouched fields)
  const hasValidationErrors = Object.values(errors).some(
    (error) => error !== ""
  );

  return (
    <Card className="relative overflow-hidden animate-scale-in">
      <div className="absolute right-2 top-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500 transition-colors duration-200 transform hover:scale-105"
        >
          <Icons.close className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <Icons.userPlus className="h-6 w-6 text-primary-500" />
          <h2 className="text-xl font-semibold">
            {user ? "Edit Employee" : "Add New Employee"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderField("name", "Full Name")}
          {renderField("email", "Email Address", "email")}
          {renderField("role", "Role", "select")}

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t dark:border-gray-700">
            <Button
              variant="secondary"
              onClick={onCancel}
              className="transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
              disabled={isSubmitting}
            >
              <Icons.close className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading || isSubmitting}
              disabled={hasValidationErrors || isSubmitting}
              className="transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
            >
              <Icons.userPlus className="h-4 w-4" />
              {user ? "Update Employee" : "Add Employee"}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
