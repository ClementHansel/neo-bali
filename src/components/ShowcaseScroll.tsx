"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const showcases = [
  {
    id: 1,
    title: "Design Excellence",
    description: "Crafting premium aesthetics that define modern experiences.",
    video: "/videos/design.mp4",
  },
  {
    id: 2,
    title: "Technology & Innovation",
    description:
      "Harnessing cutting-edge tools to deliver seamless performance.",
    video: "/videos/tech.mp4",
  },
  {
    id: 3,
    title: "Strategic Growth",
    description:
      "Aligning creativity with business goals for exponential reach.",
    video: "/videos/strategy.mp4",
  },
  {
    id: 4,
    title: "Brand Storytelling",
    description:
      "Transforming data into emotional journeys that resonate deeply.",
    video: "/videos/storytelling.mp4",
  },
  {
    id: 5,
    title: "Customer Engagement",
    description: "Delivering tailored interactions that build lasting loyalty.",
    video: "/videos/engagement.mp4",
  },
];

const ShowcaseScroll = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const isScrolling = useRef(false);

  /** ──────────────── SCROLL CONTROL ──────────────── **/
  const nextSlide = useCallback(() => {
    if (isScrolling.current) return;
    isScrolling.current = true;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % showcases.length);
    setTimeout(() => (isScrolling.current = false), 1200);
  }, []);

  const prevSlide = useCallback(() => {
    if (isScrolling.current) return;
    isScrolling.current = true;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + showcases.length) % showcases.length);
    setTimeout(() => (isScrolling.current = false), 1200);
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex]
  );

  /** ──────────────── WHEEL SCROLL ──────────────── **/
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;
      if (e.deltaY > 30) nextSlide();
      else if (e.deltaY < -30) prevSlide();
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [nextSlide, prevSlide]);

  /** ──────────────── KEYBOARD NAV ──────────────── **/
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling.current) return;
      if (e.key === "ArrowDown") nextSlide();
      if (e.key === "ArrowUp") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  /** ──────────────── TOUCH SWIPE ──────────────── **/
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;
    const distance = touchStartY.current - touchEndY.current;
    if (Math.abs(distance) > 50) {
      if (distance > 0) nextSlide(); // swipe up
      else prevSlide(); // swipe down
    }
    touchStartY.current = null;
    touchEndY.current = null;
  };

  /** ──────────────── UI ──────────────── **/
  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-black text-white touch-pan-x"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ───── Background Video Transition ───── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.video
            key={showcases[activeIndex].id}
            src={showcases[activeIndex].video}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* ───── Showcase Content (Vertical Flip) ───── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={showcases[activeIndex].id}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          initial={{
            opacity: 0,
            rotateX: direction > 0 ? -90 : 90,
            y: direction > 0 ? 100 : -100,
          }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{
            opacity: 0,
            rotateX: direction > 0 ? 90 : -90,
            y: direction > 0 ? -100 : 100,
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ perspective: 1000 }}
        >
          <motion.h2
            className="text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {showcases[activeIndex].title}
          </motion.h2>
          <motion.p
            className="text-lg max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {showcases[activeIndex].description}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* ───── Side Dots Navigation ───── */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col space-y-3 z-20">
        {showcases.map((item, i) => (
          <button
            key={item.id}
            onClick={() => goToSlide(i)}
            title={`Go to ${item.title}`}
            aria-label={`Go to ${item.title}`}
            className={`w-3 h-3 rounded-full transition-all ${
              activeIndex === i
                ? "bg-white scale-125"
                : "bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ShowcaseScroll;
