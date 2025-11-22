"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

export default function Company() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });

  const EASING: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: EASING },
    },
    exitLeft: {
      opacity: 0,
      x: -60,
      transition: { duration: 0.55, ease: EASING },
    },
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.045 } },
    exitLeft: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
  };

  const text = "NEO THE AGENCY";

  return (
    <section
      ref={ref}
      className="
        flex flex-col items-center justify-center
        bg-white text-black relative overflow-hidden
        px-4 sm:px-6
        py-8 sm:py-12 md:py-16
      "
    >
      {/* Company Title */}
      <motion.h1
        className="
          text-4xl sm:text-5xl md:text-7xl lg:text-8xl 
          font-bold tracking-tight 
          flex flex-wrap justify-center text-center
        "
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

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={
          inView
            ? {
                opacity: 1,
                y: 0,
                transition: { delay: 0.6, duration: 0.8, ease: EASING },
              }
            : { opacity: 0, y: 40, transition: { duration: 0.5, ease: EASING } }
        }
        className="
    mt-3 sm:mt-5 md:mt-6
    text-base sm:text-lg md:text-2xl
    text-gray-600
    max-w-sm sm:max-w-xl md:max-w-2xl
    text-center leading-relaxed
  "
      >
        <span>
          We build immersive digital experiences, forward-thinking products, and
          creative strategies that turn ideas into human connections.
        </span>
        <br />
        <span className="block mt-2">
          Merging design, technology, and emotion into powerful brand moments.
        </span>
      </motion.p>

      {/* Background Accent */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={
          inView
            ? {
                scale: 1,
                opacity: 0.07,
                transition: { duration: 2, ease: EASING },
              }
            : {
                scale: 0.8,
                opacity: 0,
                transition: { duration: 0.6, ease: EASING },
              }
        }
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-4/5 sm:w-3/5 md:w-2/5 h-4/5 sm:h-3/5 md:h-2/5 rounded-full bg-linear-to-r from-black to-gray-500 blur-2xl sm:blur-3xl" />
      </motion.div>
    </section>
  );
}
