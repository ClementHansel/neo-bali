"use client";
import React, { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        video.muted = true;
        video.play();
      });
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // --- Scroll-driven transforms ---
  const line1X = useTransform(scrollYProgress, [0, 0.5], [0, -300]);
  const line2X = useTransform(scrollYProgress, [0, 0.5], [0, 300]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // --- Animation Variants ---
  const lineVariants = {
    initial: { opacity: 0, y: 40 },
    enter: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] }, // "easeOut"
    },
    exitLeft: {
      opacity: 0,
      x: -300,
      transition: { duration: 1, ease: [0.42, 0, 0.58, 1] }, // "easeInOut"
    },
    exitRight: {
      opacity: 0,
      x: 300,
      transition: { duration: 1, ease: [0.42, 0, 0.58, 1] },
    },
  } as const;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Sticky hero */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Background video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="/images/azura_living_bali_DK8JvGtI4lW.mp4"
            type="video/mp4"
          />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-10" />

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-6 text-white uppercase font-light tracking-[0.15em] text-[clamp(1rem,3vw,2.5rem)] leading-[1.6]">
          <AnimatePresence>
            <motion.div
              variants={lineVariants}
              initial="initial"
              animate="enter"
              exit="exitLeft"
              style={{ x: line1X, opacity: textOpacity }}
              className="flex justify-center"
            >
              <span>WE CREATE CONNECTED DIGITAL ECOSYSTEMS</span>
            </motion.div>
            <motion.div
              variants={lineVariants}
              initial="initial"
              animate="enter"
              exit="exitRight"
              transition={{ delay: 0.3 }}
              style={{ x: line2X, opacity: textOpacity }}
              className="flex justify-center"
            >
              <span>THROUGH DESIGN AND TECHNOLOGY.</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: indicatorOpacity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70 z-30"
        >
          <div className="w-[26px] h-[42px] border-2 border-white/50 rounded-full flex justify-center relative">
            <motion.div
              className="w-1 h-2 bg-white rounded-full absolute top-2"
              animate={{ y: [0, 12, 0], opacity: [1, 0.4, 1] }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
            />
          </div>
          <motion.span
            className="mt-3 text-xs tracking-widest font-light text-white/60"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            SCROLL
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
