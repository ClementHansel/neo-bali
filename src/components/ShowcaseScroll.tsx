// src/components/ShowcaseScroll.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useScrambleText } from "@/hooks/useScrambleText";
import ParallaxLayer from "@/components/ParallaxLayer";

type ShowcaseItem = {
  id: number;
  title: string;
  description: string;
  video: string;
};

const showcases: ShowcaseItem[] = [
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

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

interface Props {
  currentSlide: number;
  setCurrentSlide: (i: number) => void;
  totalSlides: number;
  isLocked?: boolean;
  requestUnlock?: () => void; // 🔥 MUST be included
}

const ShowcaseScroll: React.FC<Props> = ({
  currentSlide,
  setCurrentSlide,
  totalSlides,
  isLocked,
  requestUnlock,
}) => {
  const activeIndex = currentSlide;
  const [direction, setDirection] = useState(1);
  const animatingRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { display: scrambledTitle, scrambleOnce } = useScrambleText();

  // 🔥 Scramble new title only
  useEffect(
    () => scrambleOnce(showcases[activeIndex].title, 850),
    [activeIndex, scrambleOnce]
  );

  // 🔥 Slide navigation (disabled if animating OR disabled by lock)
  const goTo = useCallback(
    (i: number) => {
      if (animatingRef.current || i === activeIndex) return;
      if (i < 0 || i >= totalSlides) return;

      animatingRef.current = true;
      setDirection(i > activeIndex ? 1 : -1);
      setCurrentSlide(i);

      setTimeout(() => (animatingRef.current = false), 820);
    },
    [activeIndex, setCurrentSlide, totalSlides]
  );

  // 🔥 Parallax Tracking
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (ev: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      mouseRef.current.x = clamp((ev.clientX - cx) / (r.width / 2), -1, 1);
      mouseRef.current.y = clamp((ev.clientY - cy) / (r.height / 2), -1, 1);
    };

    const onLeave = () => {
      mouseRef.current.x = 0;
      mouseRef.current.y = 0;
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // 🔥 Smooth Parallax Animation
  useEffect(() => {
    let raf: number;

    const tick = () => {
      setParallax((p) => ({
        x: p.x + (mouseRef.current.x * 40 - p.x) * 0.08,
        y: p.y + (mouseRef.current.y * 30 - p.y) * 0.08,
      }));

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 🔥 CORE FIX: Internal scroll handler only when locked
  useEffect(() => {
    if (!isLocked) return;

    const wheelHandler = (e: WheelEvent) => {
      if (!isLocked) return;

      // === EXIT CONDITIONS ===
      if (e.deltaY > 0 && currentSlide === totalSlides - 1) {
        requestUnlock?.(); // Exit on DOWN beyond last slide
        return;
      }

      if (e.deltaY < 0 && currentSlide === 0) {
        requestUnlock?.(); // Exit on UP beyond first slide
        return;
      }

      // === INTERNAL SLIDE MOVEMENT ===
      if (e.deltaY > 0) goTo(currentSlide + 1);
      if (e.deltaY < 0) goTo(currentSlide - 1);

      e.preventDefault(); // VERY IMPORTANT: block page scroll
    };

    window.addEventListener("wheel", wheelHandler, { passive: false });
    return () => window.removeEventListener("wheel", wheelHandler);
  }, [isLocked, currentSlide, totalSlides, goTo, requestUnlock]);

  // 🔥 Progress bar ratio (0 to 1)
  const progress = totalSlides > 1 ? activeIndex / (totalSlides - 1) : 0;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black text-white select-none"
      role="group"
      aria-roledescription="carousel"
    >
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.video
            key={showcases[activeIndex].id}
            src={showcases[activeIndex].video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* CENTER CONTENT */}
      <div className="absolute inset-0 flex items-center justify-center px-6 text-center pointer-events-none">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={showcases[activeIndex].id}
            initial={{
              opacity: 0,
              rotateX: direction > 0 ? -85 : 85,
              y: direction > 0 ? 150 : -150,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              rotateX: 0,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              rotateX: direction > 0 ? 85 : -85,
              y: direction > 0 ? -150 : 150,
              scale: 0.985,
            }}
            transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
            style={{ perspective: 1400, width: "100%" }}
            className="relative max-w-5xl mx-auto"
          >
            {/* PARALLAX LAYERS */}
            <ParallaxLayer
              depth={0.18}
              className="absolute inset-0"
              style={{
                transform: `translate3d(${parallax.x * 0.18}px, ${
                  parallax.y * 0.18
                }px, 0) rotate(${parallax.x * 0.01}deg)`,
                willChange: "transform",
              }}
            />

            <ParallaxLayer
              depth={0.35}
              className="relative z-10"
              style={{
                transform: `translate3d(${parallax.x * 0.35}px, ${
                  parallax.y * 0.35
                }px, 0) rotate(${parallax.x * 0.02}deg)`,
                willChange: "transform",
              }}
            >
              <h2 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                <span aria-hidden>{scrambledTitle}</span>
                <span className="sr-only">{showcases[activeIndex].title}</span>
              </h2>

              <p className="text-lg max-w-2xl mx-auto leading-relaxed opacity-90">
                {showcases[activeIndex].description}
              </p>
            </ParallaxLayer>

            <ParallaxLayer
              depth={0.65}
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                transform: `translate3d(${parallax.x * 0.65}px, ${
                  parallax.y * 0.65
                }px, 0) rotate(${parallax.x * 0.025}deg)`,
                willChange: "transform",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* PROGRESS + DOTS */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex items-center gap-4">
        {/* PROGRESS BAR */}
        <div className="flex items-center">
          <div
            className="progress-column w-1 h-44 bg-white/10 rounded-full relative overflow-hidden"
            aria-hidden
            onClick={(e) => {
              const col = (e.target as HTMLElement).closest(".progress-column");
              if (!col) return;

              const rect = col.getBoundingClientRect();
              const clickY = e.nativeEvent.clientY - rect.top;
              const ratio = clickY / rect.height;
              const targetIndex = Math.round(ratio * (totalSlides - 1));

              goTo(targetIndex);
            }}
          >
            <motion.div
              initial={false}
              animate={{ height: `${Math.max(4, progress * 100)}%` }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-full"
            />
          </div>
        </div>

        {/* DOT NAVIGATION */}
        <motion.nav
          aria-label="Showcase navigation"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.32 },
            },
          }}
        >
          <ul className="flex flex-col gap-3">
            {Array.from({ length: totalSlides }).map((_, i) => {
              const isActive = i === activeIndex;

              return (
                <motion.li
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: 10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <motion.button
                    onClick={() => goTo(i)}
                    className="relative w-4 h-4 flex items-center justify-center"
                    aria-label={`Go to slide ${i + 1}`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      layout
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                      }}
                      className={`block rounded-full ${
                        isActive ? "w-4 h-4" : "w-2 h-2"
                      } bg-white`}
                      style={{
                        opacity: isActive ? 1 : 0.6,
                        boxShadow: isActive
                          ? "0 6px 20px rgba(255,255,255,0.08)"
                          : "none",
                      }}
                    />

                    {isActive && (
                      <motion.span
                        initial={{ scale: 0.6, opacity: 0.18 }}
                        animate={{ scale: 1.8, opacity: 0.06 }}
                        transition={{
                          duration: 0.9,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                        className="absolute rounded-full w-8 h-8 -z-10"
                        style={{
                          background:
                            "radial-gradient(closest-side, rgba(255,255,255,0.06), rgba(255,255,255,0))",
                        }}
                      />
                    )}
                  </motion.button>
                </motion.li>
              );
            })}
          </ul>
        </motion.nav>
      </div>
    </section>
  );
};

export default ShowcaseScroll;
