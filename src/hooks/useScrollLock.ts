// src/hooks/useScrollLock.ts
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export const useScrollLock = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const [isLocked, setIsLocked] = useState(false);
  const lockingRef = useRef(false);

  const lastY = useRef(0);
  const direction = useRef<"up" | "down">("down");

  // ===============================
  // TRACK SCROLL DIRECTION
  // ===============================
  useEffect(() => {
    const onScroll = () => {
      if (isLocked) return; // do not track direction while locked
      const y = window.scrollY;

      direction.current = y > lastY.current ? "down" : "up";
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLocked]);

  // ===============================
  // BODY FREEZE / UNFREEZE
  // ===============================
  const lockBody = (y: number) => {
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
  };

  const unlockBody = () => {
    const frozenY = Math.abs(parseInt(document.body.style.top || "0", 10));

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";

    // restore exact scroll position (no jumping)
    window.scrollTo(0, frozenY);
  };

  // ===============================
  // WAIT FOR SCROLL STILLNESS
  // ===============================
  const waitForStillness = useCallback(
    () =>
      new Promise<void>((resolve) => {
        let last = window.scrollY;
        let still = 0;

        const detect = () => {
          const now = window.scrollY;
          if (Math.abs(now - last) < 0.5) still++;
          else still = 0;

          last = now;

          if (still >= 6) resolve();
          else requestAnimationFrame(detect);
        };

        requestAnimationFrame(detect);
      }),
    []
  );

  // ===============================
  // ENTER LOGIC (DOWNWARD)
  // ===============================
  const handleEnterLock = useCallback(
    async (el: HTMLElement) => {
      if (isLocked || lockingRef.current) return;
      if (direction.current !== "down") return;

      lockingRef.current = true;

      // Scroll element to center
      el.scrollIntoView({ behavior: "smooth", block: "center" });

      // Wait until scroll actually finishes
      await waitForStillness();

      // Freeze body at that position
      lockBody(window.scrollY);
      setIsLocked(true);

      lockingRef.current = false;
    },
    [isLocked, waitForStillness]
  );

  // ===============================
  // EXIT LOGIC (UP OR DOWN)
  // ===============================
  const handleExitUnlock = useCallback(() => {
    if (!isLocked || lockingRef.current) return;

    lockingRef.current = true;

    unlockBody();
    setIsLocked(false);

    lockingRef.current = false;
  }, [isLocked]);

  // ===============================
  // INTERSECTION OBSERVER
  // ===============================
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const rect = entry.boundingClientRect;
        const centerY = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;

        const isCentered =
          Math.abs(centerY - viewportCenter) < window.innerHeight * 0.15;

        const isLeaving = rect.bottom < 0 || rect.top > window.innerHeight;

        if (isCentered) handleEnterLock(el);
        if (isLeaving) handleExitUnlock();
      },
      { threshold: Array.from({ length: 40 }, (_, i) => i / 39) }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [handleEnterLock, handleExitUnlock]);

  return { sectionRef, isLocked, unlock: handleExitUnlock };
};
