import { ButtonHTMLAttributes } from "react";
import { LoadingSpinner } from "./loading";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger"
    | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = cn(
    "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
    isLoading && "cursor-wait"
  );

  const variants = {
    primary: cn(
      "bg-[#334155] text-white",
      "hover:bg-[#1E293B] hover:shadow-md hover:translate-y-[0.5px]",
      "active:bg-[#0F172A]",
      "disabled:bg-[#334155]/60",
      "dark:bg-[#334155] dark:hover:bg-[#1E293B] dark:disabled:bg-[#334155]/40",
      "focus-visible:ring-[#334155]/30"
    ),
    secondary: cn(
      "bg-[#475569] text-white",
      "hover:bg-[#334155] hover:shadow-sm hover:translate-y-[0.5px]",
      "active:bg-[#1E293B]",
      "disabled:bg-[#475569]/60",
      "dark:bg-[#475569] dark:hover:bg-[#334155] dark:disabled:bg-[#475569]/40",
      "focus-visible:ring-[#475569]/30"
    ),
    outline: cn(
      "border border-[#334155] bg-transparent text-[#334155]",
      "hover:bg-[#334155]/5 hover:translate-y-[0.5px]",
      "active:bg-[#334155]/10",
      "disabled:border-[#334155]/40 disabled:text-[#334155]/40",
      "dark:border-[#475569] dark:text-[#94A3B8] dark:hover:bg-[#334155]/10",
      "focus-visible:ring-[#334155]/20"
    ),
    ghost: cn(
      "bg-transparent text-[#334155]",
      "hover:bg-[#334155]/5 hover:text-[#1E293B]",
      "active:bg-[#334155]/10",
      "disabled:text-[#334155]/40",
      "dark:text-[#94A3B8] dark:hover:bg-[#334155]/10 dark:hover:text-[#CBD5E1]",
      "focus-visible:ring-[#334155]/20"
    ),
    danger: cn(
      "bg-[#EF4444] text-white",
      "hover:bg-[#DC2626] hover:shadow-md hover:translate-y-[0.5px]",
      "active:bg-[#B91C1C]",
      "disabled:bg-[#EF4444]/60",
      "dark:bg-[#EF4444] dark:hover:bg-[#DC2626] dark:disabled:bg-[#EF4444]/40",
      "focus-visible:ring-[#EF4444]/30"
    ),
    success: cn(
      "bg-[#475569] text-white",
      "hover:bg-[#334155] hover:shadow-md hover:translate-y-[0.5px]",
      "active:bg-[#1E293B]",
      "disabled:bg-[#475569]/60",
      "dark:bg-[#475569] dark:hover:bg-[#334155] dark:disabled:bg-[#475569]/40",
      "focus-visible:ring-[#475569]/30"
    ),
  };

  const sizes = {
    sm: "h-8 px-3 text-sm gap-1.5",
    md: "h-10 px-4 gap-2",
    lg: "h-12 px-6 text-lg gap-2.5",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-lg">
          <LoadingSpinner className="h-4 w-4" />
        </div>
      )}
      <span
        className={cn(
          "flex items-center gap-inherit",
          isLoading && "invisible"
        )}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </span>
    </button>
  );
}
