"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: keyof typeof Icons;
  error?: string;
  label?: string;
  helperText?: string;
  containerClassName?: string;
  rightIcon?: keyof typeof Icons;
  onRightIconClick?: () => void;
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      type,
      icon,
      error,
      label,
      helperText,
      rightIcon,
      onRightIconClick,
      isLoading,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const Icon = icon ? Icons[icon] : null;
    const RightIcon = rightIcon ? Icons[rightIcon] : null;
    const isPassword = type === "password";

    const inputType = React.useMemo(() => {
      if (isPassword) {
        return showPassword ? "text" : "password";
      }
      return type;
    }, [isPassword, showPassword, type]);

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
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <Icons.loading className="h-5 w-5 text-gray-400 dark:text-gray-500 animate-spin" />
            </div>
          )}
          <input
            type={inputType}
            className={cn(
              "flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500  transition-colors duration-200",
              Icon && "pl-10",
              (rightIcon || isPassword || isLoading) && "pr-10",
              error &&
                "border-red-300 dark:border-red-700 focus:border-red-400 dark:focus:border-red-600",
              className
            )}
            ref={ref}
            disabled={disabled || isLoading}
            {...props}
          />
          {(RightIcon || isPassword) && !isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={
                  isPassword
                    ? () => setShowPassword(!showPassword)
                    : onRightIconClick
                }
                className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:ring-offset-gray-900 rounded-full p-1 transition-colors duration-200"
                disabled={disabled}
              >
                {isPassword ? (
                  showPassword ? (
                    <Icons.eye className="h-5 w-5" />
                  ) : (
                    <Icons.eyeOff className="h-5 w-5" />
                  )
                ) : (
                  RightIcon && <RightIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          )}
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

Input.displayName = "Input";

export { Input };
