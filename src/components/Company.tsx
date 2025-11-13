"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

export default function Company() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });

  // ✅ Safe easing curve for browser-based motion
  const EASING: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

  // ✨ Kinetic letter animation
  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASING },
    },
    exitLeft: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.6, ease: EASING },
    },
    exitRight: {
      opacity: 0,
      x: 100,
      transition: { duration: 0.6, ease: EASING },
    },
  };

  // ✨ Container with stagger for smooth sequencing
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05 },
    },
    exitLeft: {
      transition: { staggerChildren: 0.03, staggerDirection: -1 },
    },
  };

  const text = "NEO THE AGENCY";

  return (
    <section
      ref={ref}
      className="h-screen flex flex-col items-center justify-center bg-white text-black relative overflow-hidden"
    >
      {/* === Animated Company Title === */}
      <motion.h1
        className="text-6xl md:text-8xl font-bold tracking-tight flex flex-wrap justify-center"
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "exitLeft"}
      >
        {text.split("").map((char, i) => (
          <motion.span key={i} variants={letterVariants}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>

      {/* === Subtitle === */}
      <motion.p
        initial={{ opacity: 0, y: 60 }}
        animate={
          inView
            ? {
                opacity: 1,
                y: 0,
                transition: { delay: 0.8, duration: 1, ease: EASING },
              }
            : { opacity: 0, y: 60, transition: { duration: 0.6, ease: EASING } }
        }
        className="mt-6 text-lg md:text-2xl text-gray-600 max-w-2xl text-center leading-relaxed"
      >
        We craft interactive experiences, digital products, and creative
        strategies that connect ideas to people — bridging design, technology,
        and emotion.
      </motion.p>

      {/* === Background Accent === */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={
          inView
            ? {
                scale: 1,
                opacity: 0.06,
                transition: { duration: 2, ease: EASING },
              }
            : {
                scale: 0.8,
                opacity: 0,
                transition: { duration: 0.6, ease: EASING },
              }
        }
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[60%] h-[60%] rounded-full bg-linear-to-r from-black to-gray-500 blur-3xl" />
      </motion.div>
    </section>
  );
}
