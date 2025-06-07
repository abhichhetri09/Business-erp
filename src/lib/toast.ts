import { toast } from "react-hot-toast";

type ToastType = "success" | "error" | "loading";

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

export const showToast = (message: string, options: ToastOptions = {}) => {
  const { type = "success", duration = 3000 } = options;

  switch (type) {
    case "success":
      return toast.success(message, { duration });
    case "error":
      return toast.error(message, { duration });
    case "loading":
      return toast.loading(message, { duration });
    default:
      return toast(message, { duration });
  }
};
