"use client";

import { Toaster, ToastBar, toast } from "react-hot-toast";
import { CustomToast } from "@/components/ui/toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div
              style={{
                animation: t.visible
                  ? "slideIn 0.2s ease-out"
                  : "slideOut 0.2s ease-in forwards",
              }}
            >
              <CustomToast
                toast={t}
                type={
                  t.type === "success"
                    ? "success"
                    : t.type === "error"
                    ? "error"
                    : "loading"
                }
                onClose={() => toast.dismiss(t.id)}
              />
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
}
