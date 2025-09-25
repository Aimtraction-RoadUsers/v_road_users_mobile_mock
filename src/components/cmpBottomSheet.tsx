// src/components/BottomSheet.tsx
import { AnimatePresence, motion } from "motion/react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function CMPBottomSheet({
  open,
  onClose,
  title = "Sheet",
  children,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            className="fixed left-0 right-0 bottom-0 z-50 rounded-t-2xl bg-white p-4 shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 24,
            }}
          >
            <div className="mx-auto max-w-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">
                  {title}
                </h3>
                <button
                  className="px-3 py-1.5 text-sm rounded bg-gray-100 hover:bg-gray-200"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}