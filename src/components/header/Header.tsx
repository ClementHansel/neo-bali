"use client";
import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import MenuPanel from "./MenuPanel";
import TLDRReels from "./reels/TLDRReels";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tldrOpen, setTldrOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null); // allow null for TS compatibility

  const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);
  const toggleTLDR = useCallback(() => setTldrOpen((p) => !p), []);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex items-center justify-between backdrop-blur-md"
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-wide">
          NEO
        </Link>
      </motion.div>

      {/* Menu / TLDR Buttons */}
      <div className="flex items-center space-x-2 md:space-x-4 relative w-full max-w-[60%] md:max-w-[50%]">
        <motion.div
          layout
          className={`flex items-center justify-between px-4 py-2 rounded-full border transition-all duration-300 w-full ${
            menuOpen ? "bg-gray-100 border-gray-400" : "border-gray-300"
          }`}
        >
          <span className="text-sm text-gray-500 select-none hidden md:block">
            Explore projects...
          </span>
          <span className="text-sm text-gray-500 select-none md:hidden">
            Menu
          </span>

          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            title="Toggle menu"
            className="ml-2 relative w-6 h-6 flex items-center justify-center"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
              className="absolute block w-6 h-0.5 bg-black rounded"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
              className="absolute block w-6 h-0.5 bg-black rounded"
            />
          </button>
        </motion.div>

        {!menuOpen && (
          <button
            onClick={toggleTLDR}
            aria-label="Open TLDR"
            title="Open TLDR"
            className="block md:hidden text-sm font-medium px-3 py-2 rounded-full border hover:bg-gray-100"
          >
            TL;DR
          </button>
        )}
      </div>

      {/* Contact Button (desktop only) */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="hidden md:block"
      >
        <Link
          href="/contact"
          className="px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800"
        >
          Contact
        </Link>
      </motion.div>

      {/* Floating card menu panel under header */}
      <MenuPanel
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onTLDR={() => {
          setMenuOpen(false);
          setTldrOpen(true);
        }}
        anchorRef={headerRef} // type-safe now
      />

      {/* TLDR Reels floating panel */}
      <TLDRReels
        open={tldrOpen}
        onClose={() => setTldrOpen(false)}
        anchorRef={headerRef} // type-safe now
      />
    </header>
  );
};

export default Header;
