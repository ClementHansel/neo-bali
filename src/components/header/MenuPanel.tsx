"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Link from "next/link";

interface MenuPanelProps {
  open: boolean;
  onClose: () => void;
  onTLDR: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>; // optional header ref
  maxWidth?: "screen-sm" | "screen-md" | "screen-lg" | "screen-xl";
  dragVelocityThreshold?: number;
  dragOffsetThreshold?: number;
}

export default function MenuPanel({
  open,
  onClose,
  onTLDR,
  anchorRef,
  maxWidth = "screen-md",
  dragVelocityThreshold = 700,
  dragOffsetThreshold = 140,
}: MenuPanelProps) {
  const [panelPosition, setPanelPosition] = useState({ top: 60, left: 0 });
  const panelRef = useRef<HTMLDivElement | null>(null);

  /** Map maxWidth string to Tailwind class */
  const maxWidthClassMap: Record<string, string> = {
    "screen-sm": "max-w-screen-sm",
    "screen-md": "max-w-screen-md",
    "screen-lg": "max-w-screen-lg",
    "screen-xl": "max-w-screen-xl",
  };
  const maxWidthClass = maxWidthClassMap[maxWidth] || "max-w-screen-md";

  /** Position panel relative to anchor */
  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPanelPosition({ top: rect.bottom + 8, left: 0 });
    } else {
      setPanelPosition({ top: 60, left: 0 });
    }
  }, [open, anchorRef]);

  /** Drag-to-close logic */
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (
      Math.abs(info.velocity.y) > dragVelocityThreshold ||
      Math.abs(info.offset.y) > dragOffsetThreshold
    ) {
      onClose();
    }
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
            ref={panelRef}
            drag="y"
            dragConstraints={{ top: -Infinity, bottom: Infinity }}
            onDragEnd={handleDragEnd}
            style={{
              top: panelPosition.top,
              left: panelPosition.left || "50%",
              transform: panelPosition.left ? undefined : "translateX(-50%)",
            }}
            className="absolute z-50 flex justify-center w-full "
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full ${maxWidthClass} max-h-[85vh] bg-white rounded-3xl border border-gray-300 shadow-2xl overflow-auto`}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 z-40 text-2xl"
                aria-label="Close menu"
              >
                ✕
              </button>

              {/* Menu links */}
              <nav className="flex flex-col p-6 space-y-4 text-lg">
                <Link
                  href="/projects"
                  onClick={onClose}
                  className="hover:underline"
                >
                  Projects
                </Link>
                <Link
                  href="/about"
                  onClick={onClose}
                  className="hover:underline"
                >
                  About
                </Link>
                <Link
                  href="/services"
                  onClick={onClose}
                  className="hover:underline"
                >
                  Services
                </Link>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="hover:underline"
                >
                  Contact Us
                </Link>
                <button
                  onClick={() => {
                    onTLDR();
                    onClose();
                  }}
                  className="text-left hover:underline"
                >
                  TL;DR
                </button>
              </nav>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
