"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type MenuItem = {
  id: string;
  label: string;
};

const MENU: MenuItem[] = [
  { id: "digital", label: "digital" },
  { id: "marketing", label: "marketing strategy." },
  { id: "creatives", label: "creatives." },
  { id: "technology", label: "technology." },
  { id: "ads", label: "ads." },
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
    </section>
  );
}
