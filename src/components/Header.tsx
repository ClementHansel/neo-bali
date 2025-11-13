"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const tldrButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleModal = () => setModalOpen((prev) => !prev);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex items-center justify-between bg-transparent backdrop-blur-md">
      {/* LEFT — LOGO */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold tracking-wide hover:opacity-80 transition-opacity"
        >
          NEO
        </Link>
      </motion.div>

      {/* MIDDLE — MENU BAR */}
      <div className="flex items-center space-x-4 relative">
        {/* Search-style bar */}
        <motion.div
          layout
          className={`flex items-center justify-between px-4 py-2 rounded-full border transition-all duration-300 w-[50vw] ${
            menuOpen ? "bg-gray-100 border-gray-400" : "border-gray-300"
          }`}
        >
          <span className="text-sm text-gray-500 select-none">
            Explore projects...
          </span>

          {/* Hamburger button */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="ml-2 relative w-6 h-6 flex items-center justify-center"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="absolute block w-6 h-0.5 bg-black rounded"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
              transition={{ duration: 0.3 }}
              className="absolute block w-6 h-0.5 bg-black rounded"
            />
          </button>
        </motion.div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[50vw] bg-white/90 backdrop-blur-xl border rounded-3xl shadow-2xl p-8 space-y-3"
            >
              <Link
                href="/projects"
                className="block text-lg font-medium hover:text-blue-600 transition"
              >
                Projects
              </Link>
              <Link
                href="/about"
                className="block text-lg font-medium hover:text-blue-600 transition"
              >
                About
              </Link>
              <Link
                href="/services"
                className="block text-lg font-medium hover:text-blue-600 transition"
              >
                Services
              </Link>
              <button
                onClick={toggleModal}
                className="block w-full text-left text-lg text-gray-600 hover:text-blue-600 transition"
              >
                TL;DR
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TL;DR Button (when menu closed) */}
        {!menuOpen && (
          <motion.button
            ref={tldrButtonRef}
            onClick={toggleModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm font-medium px-4 py-2 rounded-full border hover:bg-gray-100 transition relative"
          >
            {modalOpen ? "✕" : "TL;DR"}
          </motion.button>
        )}

        {/* TL;DR Dropdown (under button) */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[50vw] bg-white/90 backdrop-blur-xl border rounded-3xl shadow-2xl p-8 z-40"
            >
              <h3 className="text-xl font-semibold mb-4">Quick Categories</h3>
              <ul className="space-y-3 text-base">
                <li className="hover:text-blue-600 cursor-pointer">Branding</li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Web Design
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Animation
                </li>
                <li className="hover:text-blue-600 cursor-pointer">Strategy</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT — CONTACT */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Link
          href="/contact"
          className="px-4 py-2 rounded-full bg-black text-white text-sm md:text-base hover:bg-gray-800 transition"
        >
          Contact
        </Link>
      </motion.div>
    </header>
  );
};

export default Header;
