"use client";

import { useLayoutEffect, useRef, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FloatingPanelProps {
  open: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
  children: ReactNode;
  maxWidth?: "screen-sm" | "screen-md" | "screen-lg" | "screen-xl";
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
}

export default function FloatingPanel({
  open,
  onClose,
  anchorRef,
  children,
  maxWidth = "screen-md",
  onHoldStart,
  onHoldEnd,
}: FloatingPanelProps) {
  const [panelPosition, setPanelPosition] = useState({ top: 80, left: 0 });
  const holdTimeoutRef = useRef<number | null>(null);

  /** Map maxWidth string to Tailwind class */
  const maxWidthClassMap: Record<string, string> = {
    "screen-sm": "max-w-screen-sm",
    "screen-md": "max-w-screen-md",
    "screen-lg": "max-w-screen-lg",
    "screen-xl": "max-w-screen-xl",
  };
  const maxWidthClass = maxWidthClassMap[maxWidth] || "max-w-screen-md";

  /** Update panel position relative to anchor or center */
  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const isMobile = window.innerWidth < 768;
      const top = anchorRef?.current
        ? anchorRef.current.getBoundingClientRect().bottom + 8
        : 80;
      const left = isMobile
        ? 0
        : anchorRef?.current?.getBoundingClientRect().left || 0;

      setPanelPosition({ top, left });
    };

    const frame = requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, anchorRef]);

  /** Hold handlers for mobile */
  const startHold = () => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    holdTimeoutRef.current = window.setTimeout(() => {
      onHoldStart?.();
    }, 250);
  };

  const stopHold = () => {
    if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
    holdTimeoutRef.current = null;
    onHoldEnd?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            style={{
              top: panelPosition.top,
              left: panelPosition.left || "50%",
              transform: panelPosition.left ? undefined : "translateX(-50%)",
            }}
            className="absolute z-50 flex justify-center w-full pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onMouseDown={startHold}
              onMouseUp={stopHold}
              onTouchStart={startHold}
              onTouchEnd={stopHold}
              className={`relative w-full ${maxWidthClass} max-h-[85vh] bg-white rounded-3xl border border-gray-300 shadow-2xl overflow-hidden pointer-events-auto`}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-40 text-2xl"
                aria-label="Close panel"
              >
                ✕
              </button>

              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
