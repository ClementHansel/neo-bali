// src/components/home/Hero.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type MenuItem = { id: string; label: string };

const MENU: MenuItem[] = [
  { id: "development", label: "development." },
  { id: "hospitality", label: "hospitality." },
  { id: "dental", label: "dental." },
];

const cinematic = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const startTouchYRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef(false);
  const lastScrollYRef = useRef(0);

  /* ---------------- VIDEO ---------------- */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.preload = "auto";
    v.muted = true;
    v.playsInline = true;
    const playVideo = () => v.play().catch(() => {});
    v.addEventListener("loadeddata", playVideo);
    return () => v.removeEventListener("loadeddata", playVideo);
  }, []);

  /* ---------------- CHECK IF HERO IS IN VIEW ---------------- */
  const heroInView = () => {
    if (!sectionRef.current) return false;
    const rect = sectionRef.current.getBoundingClientRect();
    const visibleHeight =
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

    return visibleHeight >= window.innerHeight * 0.7;
  };

  /* ---------------- SCROLL LOCK ---------------- */
  const lockScroll = () => {
    lastScrollYRef.current = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${lastScrollYRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    setIsLocked(true);
  };

  const unlockScroll = () => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.overflow = "";
    window.scrollTo(0, lastScrollYRef.current);
    setIsLocked(false);
  };

  /* ---------------- APPLY LOCK BASED ON INDEX ---------------- */
  useEffect(() => {
    const shouldLock = heroInView() && activeIndex < MENU.length - 1;

    if (shouldLock && !isLocked) {
      requestAnimationFrame(lockScroll);
    }
    if (!shouldLock && isLocked) {
      requestAnimationFrame(unlockScroll);
    }
  }, [activeIndex, isLocked]);

  /* ---------------- SCROLL & SWIPE SYSTEM ---------------- */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!heroInView()) return;
      if (scrollTimeoutRef.current) return;

      scrollTimeoutRef.current = true;
      setTimeout(() => (scrollTimeoutRef.current = false), 120);

      if (activeIndex < MENU.length - 1) e.preventDefault();

      if (e.deltaY > 10) {
        setActiveIndex((p) => Math.min(p + 1, MENU.length - 1));
      } else if (e.deltaY < -10) {
        setActiveIndex((p) => Math.max(p - 1, 0));
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      startTouchYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!heroInView()) return;
      if (scrollTimeoutRef.current) return;
      if (startTouchYRef.current == null) return;

      const dy = startTouchYRef.current - e.touches[0].clientY;

      if (isLocked) e.preventDefault();

      if (Math.abs(dy) > 40) {
        scrollTimeoutRef.current = true;
        setTimeout(() => (scrollTimeoutRef.current = false), 200);

        if (dy > 0) setActiveIndex((p) => Math.min(p + 1, MENU.length - 1));
        else setActiveIndex((p) => Math.max(p - 1, 0));

        startTouchYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = () => {
      startTouchYRef.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      if (isLocked) unlockScroll();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeIndex, isLocked]);

  /* ---------------- MENU CLICK (WORKS ANYTIME) ---------------- */
  const handleSelect = (i: number) => {
    // ALWAYS update active index (no heroInView condition)
    setActiveIndex(i);

    // When clicking menu from outside Hero, scroll back to Hero
    if (!heroInView() && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-svh overflow-hidden font-inter lowercase"
    >
      <div className="sticky top-0 h-svh w-full">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/cut.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/5" />

        {/* LEFT TEXT */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: cinematic }}
            className="
              pointer-events-auto text-white font-brand font-normal 
              leading-20 tracking-tight text-[22px] md:text-[24px] md:w-[434px]
              absolute top-16 md:top-[87px] left-6 md:left-16
            "
          >
            neo.
          </motion.h1>

          <p className="pointer-events-auto absolute top-[140px] md:top-[159px] left-6 md:left-16 text-white font-mono2 font-light text-[22px] md:text-[24px] leading-[22px] md:w-[223px]">
            global luxury <br /> brand factory.
          </p>

          <p className="pointer-events-auto absolute top-[206px] md:top-[225px] left-6 md:left-16 text-white font-mono2 font-light text-[22px] md:text-[24px] leading-[22px] md:w-[195px]">
            creating in <br /> bali and berlin.
          </p>

          <p className="pointer-events-auto absolute top-[270px] md:top-[291px] left-6 md:left-16 text-white font-mono2 font-light text-[22px] md:text-[24px] leading-[22px] md:w-[195px]">
            founded by <br /> consultants and <br /> developers.
          </p>
        </div>

        {/* RIGHT MENU */}
        <div className="absolute bottom-35 right-6 md:bottom-25 md:right-16 z-30 text-right text-white font-mono2">
          <div className="text-[22px] md:text-[24px] tracking-widest mb-2">
            industries.
          </div>

          <ul className="flex flex-col gap-2">
            {MENU.map((item, i) => {
              const active = i === activeIndex;
              return (
                <li key={item.id}>
                  <button onClick={() => handleSelect(i)}>
                    <motion.span
                      animate={{
                        x: active ? 8 : 0,
                        opacity: active ? 1 : 0.9,
                        color: active ? "#ffffffff" : "#ffffffa3",
                      }}
                      transition={{ ease: cinematic, duration: 0.4 }}
                      className="text-[22px] md:text-[24px] font-light font-inter"
                    >
                      {item.label}
                    </motion.span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 text-xs text-gray-300">
            {activeIndex + 1} / {MENU.length}
          </div>
        </div>

        {/* WHATSAPP */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <a
            href="https://wa.me/4917682360647"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95"
          >
            <span className="text-sm md:text-base font-inter font-medium">
              Accelerate
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
