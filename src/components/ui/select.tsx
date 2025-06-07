"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

export interface SelectOption {
  value: string;
  label: string;
  icon?: keyof typeof Icons;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[];
  icon?: keyof typeof Icons;
  error?: string;
  label?: string;
  helperText?: string;
  containerClassName?: string;
  isLoading?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      containerClassName,
      options,
      icon,
      error,
      label,
      helperText,
      isLoading,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const Icon = icon ? Icons[icon] : null;
    const selectedOption = options.find((opt) => opt.value === value);
    const SelectedIcon = selectedOption?.icon
      ? Icons[selectedOption.icon]
      : Icon;

    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {SelectedIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SelectedIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
              <Icons.loading className="h-5 w-5 text-gray-400 dark:text-gray-500 animate-spin" />
            </div>
          )}
          <select
            ref={ref}
            value={value}
            disabled={disabled || isLoading}
            className={cn(
              "flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus:border-gray-400 dark:focus:border-gray-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 appearance-none transition-colors duration-200",
              SelectedIcon && "pl-10",
              "pr-10",
              error &&
                "border-red-300 dark:border-red-700 focus:border-red-400 dark:focus:border-red-600",
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icons.chevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              "text-sm",
              error
                ? "text-red-600 dark:text-red-400"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
