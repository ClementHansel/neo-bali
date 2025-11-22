"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type MenuItem = {
  id: string;
  label: string;
};

const MENU: MenuItem[] = [
  { id: "digital", label: "digital" },
  { id: "marketing", label: "marketing strategy" },
  { id: "creatives", label: "creatives" },
  { id: "technology", label: "technology" },
  { id: "ads", label: "ads" },
];

// TS-safe framer motion easing
const cinematic = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  /* ------------------------ VIDEO OPTIMIZATION ------------------------ */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;

    const playVideo = async () => {
      try {
        await v.play();
      } catch {}
    };

    v.addEventListener("loadeddata", playVideo);
    return () => v.removeEventListener("loadeddata", playVideo);
  }, []);

  /* ------------------------ AUTO-CYCLING RIGHT TEXT ------------------------ */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % MENU.length);
    }, 2500); // every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSelect = (i: number) => {
    setActiveIndex(i);
  };

  return (
    <section className="w-full min-h-[200vh] relative overflow-hidden font-inter lowercase">
      {/* Sticky background video */}
      <div className="sticky top-0 h-[200vh] w-full">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="/poster.jpg"
        >
          <source src="/cut.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/40" />

        {/* LEFT STATIC INTRO TEXT */}
        <div className="sticky top-0 h-screen flex items-center px-12 z-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: cinematic }}
            className="text-white max-w-xl"
          >
            <h1 className="text-6xl font-light font-sohne">neo.</h1>
            <p className="mt-4 text-lg opacity-90">
              global luxury brand factory.
            </p>
            <p className="mt-2 text-lg opacity-90">
              prototyping in bali and berlin.
            </p>
            <p className="mt-4 text-sm opacity-70">
              founded by consultants and developers.
            </p>
          </motion.div>
        </div>

        {/* RIGHT MENU */}
        <div className="absolute bottom-20 right-16 z-30 text-right">
          <div className="text-sm tracking-widest text-gray-300 mb-6">
            explore
          </div>

          <ul className="flex flex-col gap-4">
            {MENU.map((item, i) => {
              const active = i === activeIndex;

              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleSelect(i)}
                    className="group w-full text-right"
                  >
                    <motion.span
                      animate={{
                        x: active ? 8 : 0,
                        opacity: active ? 1 : 0.85,
                        color: active
                          ? [
                              "#ffffff",
                              "#e3baff",
                              "#9ec7ff",
                              "#ffb3b3",
                              "#ffffff",
                            ]
                          : "#d1d1d1",
                      }}
                      transition={{
                        ease: cinematic,
                        duration: active ? 2.2 : 0.25,
                        repeat: active ? Infinity : 0,
                      }}
                      className="text-3xl font-light font-inter transition-all"
                    >
                      {item.label}
                    </motion.span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 text-xs text-gray-400 tracking-wide">
            {activeIndex + 1} / {MENU.length}
          </div>
        </div>
      </div>

      {/* ============================
          WHATSAPP CTA BUTTON
      ============================ */}
      <a
        href="https://wa.me/4917682360647"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
      >
        {/* WhatsApp Icon (SVG) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 .14 5.23.14 11.84a11.8 11.8 0 001.6 5.94L0 24l6.4-1.68a11.85 11.85 0 005.66 1.44h.01c6.63 0 11.86-5.23 11.86-11.84a11.8 11.8 0 00-3.41-8.44ZM12 21.36a9.46 9.46 0 01-4.81-1.31l-.35-.21-3.79 1 1.01-3.69-.24-.38A9.4 9.4 0 012.6 11.84c0-5.19 4.22-9.41 9.41-9.41a9.37 9.37 0 016.65 2.76 9.31 9.31 0 012.75 6.65c0 5.19-4.22 9.41-9.41 9.41Zm5.46-7.03c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.5-.17-.01-.37-.03-.57-.03-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.2 3.07c.15.2 2.09 3.19 5.07 4.47.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.43.25-.71.25-1.32.17-1.43-.07-.12-.27-.2-.57-.35Z" />
        </svg>

        <span className="text-sm font-medium">Chat on WhatsApp</span>
      </a>
    </section>
  );
}
