"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Toast, ToastType } from "@/hooks/useToast";

interface ToastProviderProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const TYPE_STYLES: Record<ToastType, string> = {
  success: "from-green-900/80 to-green-800/80 border-green-500/40",
  info: "from-purple-900/80 to-purple-800/80 border-purple-500/40",
  achievement: "from-amber-900/80 to-amber-800/80 border-amber-500/40",
  gentle: "from-fuchsia-900/80 to-fuchsia-800/80 border-fuchsia-500/40",
};

export default function ToastProvider({ toasts, onDismiss }: ToastProviderProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
            onClick={() => onDismiss(toast.id)}
            className={`pointer-events-auto cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-r border backdrop-blur-sm shadow-lg ${TYPE_STYLES[toast.type]}`}
          >
            <p className="text-xs font-bold text-white whitespace-nowrap">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
