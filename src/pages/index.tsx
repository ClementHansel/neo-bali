// src/pages/index.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

import Company from "@/components/Company";
import Hero from "@/components/Hero";
import { Project } from "@/types";
import Projects from "@/components/Projects";
import WhatWeDo from "@/components/WhatWeDo";
import COOTestimony from "@/components/COOTestimony";
import { Footer } from "@/components/Footer";
import ShowcaseScroll from "@/components/ShowcaseScroll";

import { useScrollLock } from "@/hooks/useScrollLock";

export default function Home({}: { projects: Project[] }) {
  const TOTAL_SHOWCASE_SLIDES = 5;

  /** Use NEW hook API */
  const { sectionRef, isLocked, unlock } = useScrollLock();

  const [currentSlide, setCurrentSlide] = useState(0);
  const isAnimating = useRef(false);

  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  /** Prevent scroll immediately after unlock */
  const scrollFreeze = useRef(false);

  /** Unified safeUnlock wrapper for page-controlled exits */
  const safeUnlock = useCallback(() => {
    scrollFreeze.current = true;

    unlock(); // new hook API, no args

    setTimeout(() => {
      scrollFreeze.current = false;
    }, 250);
  }, [unlock]);

  /** Small nudges to continue page scroll on exit */
  const nudgeDown = () =>
    window.scrollBy({ top: 2, behavior: "instant" as ScrollBehavior });
  const nudgeUp = () =>
    window.scrollBy({ top: -2, behavior: "instant" as ScrollBehavior });

  // ==========================
  // WHEEL CONTROL
  // ==========================
  useEffect(() => {
    if (!isLocked) return;

    const onWheel = (e: WheelEvent) => {
      if (scrollFreeze.current) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      if (isAnimating.current) return;
      isAnimating.current = true;

      const goingDown = e.deltaY > 0;

      setCurrentSlide((prev) => {
        if (goingDown) {
          if (prev < TOTAL_SHOWCASE_SLIDES - 1) return prev + 1;

          // exit downward
          safeUnlock();
          requestAnimationFrame(nudgeDown);
          return prev;
        } else {
          if (prev > 0) return prev - 1;

          // exit upward
          safeUnlock();
          requestAnimationFrame(nudgeUp);
          return prev;
        }
      });

      setTimeout(() => (isAnimating.current = false), 700);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isLocked, safeUnlock]);

  // ==========================
  // TOUCH SWIPE CONTROL
  // ==========================
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onTouchStart = (ev: TouchEvent) => {
      if (!isLocked) return;
      touchStartY.current = ev.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const onTouchEnd = (ev: TouchEvent) => {
      if (!isLocked) return;
      if (scrollFreeze.current) return;
      if (touchStartY.current === null) return;

      const endY = ev.changedTouches[0].clientY;
      const diff = touchStartY.current - endY;
      const dt = Date.now() - touchStartTime.current;

      const isSwipe = Math.abs(diff) > 40 && dt < 500;
      if (!isSwipe) {
        touchStartY.current = null;
        return;
      }

      if (isAnimating.current) {
        touchStartY.current = null;
        return;
      }

      isAnimating.current = true;

      const goingDown = diff > 0;

      setCurrentSlide((prev) => {
        if (goingDown) {
          if (prev < TOTAL_SHOWCASE_SLIDES - 1) return prev + 1;

          safeUnlock();
          requestAnimationFrame(nudgeDown);
          return prev;
        } else {
          if (prev > 0) return prev - 1;

          safeUnlock();
          requestAnimationFrame(nudgeUp);
          return prev;
        }
      });

      setTimeout(() => (isAnimating.current = false), 650);

      touchStartY.current = null;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [isLocked, sectionRef, safeUnlock]);

  // ==========================
  // PAGE STRUCTURE
  // ==========================
  return (
    <>
      <Hero />
      <Company />
      <Projects />
      <WhatWeDo />

      <div
        ref={sectionRef}
        className="h-screen w-screen relative overflow-hidden"
      >
        <ShowcaseScroll
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          totalSlides={TOTAL_SHOWCASE_SLIDES}
          isLocked={isLocked}
          requestUnlock={unlock}
        />
      </div>

      <COOTestimony />
      <Footer />
    </>
  );
}
