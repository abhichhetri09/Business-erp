"use client";

import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ToastProps {
  toast: Toast;
  type?: "success" | "error" | "loading";
  onClose: () => void;
}

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  loading: InformationCircleIcon,
};

const styles = {
  success:
    "bg-white dark:bg-gray-800 border-l-4 border-l-green-500 dark:border-l-green-400",
  error:
    "bg-white dark:bg-gray-800 border-l-4 border-l-red-500 dark:border-l-red-400",
  loading:
    "bg-white dark:bg-gray-800 border-l-4 border-l-blue-500 dark:border-l-blue-400",
};

const iconStyles = {
  success: "text-green-600 dark:text-green-400",
  error: "text-red-600 dark:text-red-400",
  loading: "text-blue-600 dark:text-blue-400 animate-spin",
};

const textStyles = {
  success: "text-gray-900 dark:text-gray-100",
  error: "text-gray-900 dark:text-gray-100",
  loading: "text-gray-900 dark:text-gray-100",
};

export function CustomToast({ toast, type = "success", onClose }: ToastProps) {
  const Icon = icons[type];

  return (
    <div
      className={cn(
        "relative transform transition-all duration-300",
        "w-full max-w-md overflow-hidden rounded-lg shadow-lg",
        "ring-1 ring-black ring-opacity-5",
        styles[type]
      )}
    >
      <div className="px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Icon className={cn("h-5 w-5", iconStyles[type])} />
          </div>
          <div className="flex-1 pt-[1px]">
            <p
              className={cn(
                "text-sm font-medium tracking-tight",
                textStyles[type]
              )}
            >
              {String(toast.message)}
            </p>
          </div>
          <div className="flex-shrink-0 -mr-1">
            <button
              onClick={onClose}
              className={cn(
                "rounded-md p-1.5",
                "text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400",
                "transition-colors duration-150 ease-in-out",
                "hover:bg-gray-100 dark:hover:bg-gray-700",
                "focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              )}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[2px] bg-current transition-opacity",
          iconStyles[type]
        )}
        style={{
          animation: "shrink 3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          transformOrigin: "left",
        }}
      />
    </div>
  );
}
