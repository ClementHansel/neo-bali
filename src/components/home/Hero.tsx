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

  const startTouchYRef = useRef<number | null>(null);
  const scrollTimeoutRef = useRef(false);
  const scrollYBeforeLockRef = useRef(0);
  const [isLocked, setIsLocked] = useState(false);

  /* ---------------- NEW CENTERING STATE ---------------- */
  const [isCentering, setIsCentering] = useState(false);

  /* ---------------- VIDEO ---------------- */
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

  /* ---------------- SCROLL LOCK ---------------- */
  const lockScroll = () => {
    scrollYBeforeLockRef.current = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYBeforeLockRef.current}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";

    setIsLocked(true);
  };

  const unlockScroll = () => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";

    window.scrollTo(0, scrollYBeforeLockRef.current);
    setIsLocked(false);
  };

  const isHeroInView = () => {
    if (!sectionRef.current) return false;
    const rect = sectionRef.current.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  };

  /* ---------------- CENTER HERO (with await) ---------------- */
  const centerHeroToViewport = () => {
    return new Promise<void>((resolve) => {
      if (!sectionRef.current) return resolve();

      const top = sectionRef.current.offsetTop;
      const height = sectionRef.current.offsetHeight;

      const target = top - (window.innerHeight - height) / 2;

      setIsCentering(true);

      window.scrollTo({
        top: target,
        behavior: "smooth",
      });

      const start = performance.now();
      const check = () => {
        const diff = Math.abs(window.scrollY - target);
        if (diff < 2 || performance.now() - start > 1200) {
          setIsCentering(false);
          return resolve();
        }
        requestAnimationFrame(check);
      };

      requestAnimationFrame(check);
    });
  };

  /* ---------------- LOCK MANAGER (fixed) ---------------- */
  useEffect(() => {
    const shouldLock = activeIndex < MENU.length - 1 && isHeroInView();

    if (shouldLock && !isLocked && !isCentering) {
      centerHeroToViewport().then(() => {
        requestAnimationFrame(() => lockScroll());
      });
    }

    if (!shouldLock && isLocked && !isCentering) {
      requestAnimationFrame(() => unlockScroll());
    }
  }, [activeIndex, isLocked, isCentering]);

  /* ---------------- SCROLL & SWIPE ---------------- */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isHeroInView()) return;
      if (scrollTimeoutRef.current) return;

      scrollTimeoutRef.current = true;
      setTimeout(() => (scrollTimeoutRef.current = false), 80);

      // When scrolling inside hero → center it FIRST
      if (!isLocked && !isCentering) centerHeroToViewport();

      if (activeIndex < MENU.length - 1) e.preventDefault();

      if (e.deltaY > 10)
        setActiveIndex((p) => Math.min(p + 1, MENU.length - 1));
      else if (e.deltaY < -10) setActiveIndex((p) => Math.max(p - 1, 0));
    };

    const handleTouchStart = (e: TouchEvent) => {
      startTouchYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isHeroInView()) return;
      if (startTouchYRef.current == null || scrollTimeoutRef.current) return;

      const dy = startTouchYRef.current - e.touches[0].clientY;

      // Center before locking
      if (!isLocked && !isCentering) centerHeroToViewport();

      if (Math.abs(dy) > 30) {
        e.preventDefault();
        scrollTimeoutRef.current = true;
        setTimeout(() => (scrollTimeoutRef.current = false), 150);

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
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      if (isLocked) unlockScroll();

      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeIndex, isLocked, isCentering]);

  const handleSelect = (i: number) => {
    // Force recenter on manual click
    centerHeroToViewport().then(() => {
      setActiveIndex(i);
    });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-svh overflow-hidden font-inter lowercase"
    >
      <div className="sticky top-0 h-svh w-full">
        {/* VIDEO */}
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

        {/* ----------------
            LEFT: responsive Figma-derived layout
            - Desktop: positions mimic Figma
            - Tablet/Mobile: stacks and scales
           ---------------- */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Title: "neo." */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: cinematic }}
            className="
    pointer-events-auto text-white font-brand font-normal 
    leading-20 tracking-tight
    text-[22px] md:text-[24px] md:w-[434px]
    absolute 
    top-16 md:top-[87px]
    left-6 md:left-1/2 md:-translate-x-1/2
  "
            style={{ letterSpacing: "-0.01em" }}
          >
            neo.
          </motion.h1>

          {/* left column block 1 */}
          <p
            className="
    pointer-events-auto absolute 
    top-[140px] md:top-[159px]
    left-6 md:left-3
    text-white font-mono2 font-light 
    text-[22px] md:text-[24px]
    leading-[22px] md:w-[223px]
  "
            style={{ letterSpacing: "-0.01em", margin: 0 }}
          >
            global luxury
            <br />
            brand factory.
          </p>

          {/* left column block 2 */}
          <p
            className="
    pointer-events-auto absolute 
    top-[206px] md:top-[225px]
    left-6 md:left-3
    text-white font-mono2 font-light
    text-[22px] md:text-[24px]
    leading-[22px] md:w-[195px]
  "
            style={{ letterSpacing: "-0.01em", margin: 0 }}
          >
            creating in
            <br />
            bali and berlin.
          </p>

          {/* left column block 3 */}
          <p
            className="
    pointer-events-auto absolute 
    top-[270px] md:top-[291px]
    left-6 md:left-3
    text-white font-mono2 font-light
    text-[22px] md:text-[24px]
    leading-[22px] md:w-[195px]
  "
            style={{ letterSpacing: "-0.01em", margin: 0 }}
          >
            founded by
            <br />
            consultants and
            <br />
            developers.
          </p>
        </div>

        {/* RIGHT MENU (unchanged logic / layout) */}
        <div className="absolute bottom-35 right-6 md:bottom-25 md:right-16 z-30 text-right font-mono2 text-white">
          <div className="text-[22px] md:text-[24px] tracking-widest font-mono2 text-white mb-1 md:mb-2">
            industries.
          </div>

          <ul className="flex flex-col gap-1 md:gap-2">
            {MENU.map((item, i) => {
              const active = i === activeIndex;
              return (
                <li key={item.id}>
                  <button onClick={() => handleSelect(i)} className="group">
                    <motion.span
                      animate={{
                        x: active ? 8 : 0,
                        opacity: active ? 1 : 0.9,
                        color: active ? "#FFFFFFFF" : "#ffffffa3",
                      }}
                      transition={{ ease: cinematic, duration: 0.4 }}
                      className="text-[22px] md:text-[24px] font-light font-inter transition-all"
                    >
                      {item.label}
                    </motion.span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-2 md:mt-4 text-xs text-gray-300 tracking-wide">
            {activeIndex + 1} / {MENU.length}
          </div>
        </div>

        {/* WHATSAPP BUTTON (unchanged) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <a
            href="https://wa.me/4917682360647"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-sm md:text-base font-inter font-medium">
              Accelerate
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 md:w-6 md:h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20.52 3.48A11.86 11.86 0 0012 0C5.37 0 .14 5.23.14 11.84a11.8 11.8 0 001.6 5.94L0 24l6.4-1.68a11.85 11.85 0 005.66 1.44h.01c6.63 0 11.86-5.23 11.86-11.84a11.8 11.8 0 00-3.41-8.44ZM12 21.36a9.46 9.46 0 01-4.81-1.31l-.35-.21-3.79 1 1.01-3.69-.24-.38A9.4 9.4 0 012.6 11.84c0-5.19 4.22-9.41 9.41-9.41a9.37 9.37 0 016.65 2.76 9.31 9.31 0 012.75 6.65c0 5.19-4.22 9.41-9.41 9.41Zm5.46-7.03c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.5-.17-.01-.37-.03-.57-.03-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.87 1.2 3.07c.15.2 2.09 3.19 5.07 4.47.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.43.25-.71.25-1.32.17-1.43-.07-.12-.27-.2-.57-.35Z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
