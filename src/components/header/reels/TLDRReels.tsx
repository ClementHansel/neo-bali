"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FloatingPanel from "@/components/UI/FloatingPanel";
import { Reel } from "./ReelTypes";
import ReelMedia from "./ReelMedia";
import ReelProgress from "./ReelProgress";
import ReelControls from "./ReelControls";

interface TLDRReelsProps {
  open: boolean;
  onClose: () => void;
  advanceMs?: number;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

export default function TLDRReels({
  open,
  onClose,
  advanceMs = 5000,
  anchorRef,
}: TLDRReelsProps) {
  const reels = useMemo<Reel[]>(
    () => [
      {
        id: 1,
        title: "Branding",
        content: "Quick insight into branding direction.",
        audioSrc: "/audio/branding.mp3",
        bgImage: "/media/branding.jpg",
        bgImageWidth: 1600,
        bgImageHeight: 900,
      },
      {
        id: 2,
        title: "Web Design",
        content: "Clean, modern UI.",
        audioSrc: "/audio/webdesign.mp3",
        bgVideo: "/media/webdesign.mp4",
        bgImage: "/media/webdesign-poster.jpg",
        bgImageWidth: 1600,
        bgImageHeight: 900,
      },
      {
        id: 3,
        title: "Animation",
        content: "Motion that enhances storytelling.",
        bgImage: "/media/animation.jpg",
        bgImageWidth: 1600,
        bgImageHeight: 900,
      },
      {
        id: 4,
        title: "Strategy",
        content: "Smart planning for impactful results.",
        bgImage: "/media/strategy.jpg",
        bgImageWidth: 1600,
        bgImageHeight: 900,
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /** Detect mobile dynamically */
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /** NEXT / PREV */
  const next = useCallback(() => {
    setIndex((i) => {
      const nextIdx = i + 1;
      if (nextIdx >= reels.length) {
        onClose();
        return i;
      }
      setProgress(0);
      lastTsRef.current = null;
      return nextIdx;
    });
  }, [onClose, reels.length]);

  const prev = useCallback(() => {
    setIndex((i) => {
      const prevIdx = Math.max(0, i - 1);
      setProgress(0);
      lastTsRef.current = null;
      return prevIdx;
    });
  }, []);

  /** AUDIO HANDLING */
  useEffect(() => {
    if (!open) return;
    const src = reels[index]?.audioSrc;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (src) {
      const a = new Audio(src);
      a.preload = "auto";
      audioRef.current = a;
      a.play().catch(() => {});
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [open, index, reels]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPaused || isHolding) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
  }, [isPaused, isHolding]);

  /** PROGRESS RAF */
  useEffect(() => {
    if (!open || isPaused || isHolding) return;
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;

      setProgress((p) => {
        const np = p + dt / advanceMs;
        if (np >= 1) {
          if (index < reels.length - 1) next();
          else onClose();
          return 0;
        }
        return np;
      });

      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
      rafRef.current = null;
    };
  }, [
    open,
    isPaused,
    isHolding,
    index,
    next,
    advanceMs,
    onClose,
    reels.length,
  ]);

  /** PROGRESS BAR CLICK */
  const handleProgressClick = (i: number) => {
    setIndex(i);
    setProgress(0);
  };

  const progressPct = Math.min(100, Math.max(0, Math.round(progress * 100)));

  return (
    <FloatingPanel
      open={open}
      onClose={onClose}
      anchorRef={anchorRef}
      maxWidth="screen-md"
      onHoldStart={() => setIsHolding(true)}
      onHoldEnd={() => setIsHolding(false)}
    >
      {/* Progress bar */}
      <ReelProgress
        reels={reels}
        index={index}
        progressPct={progressPct}
        onClick={handleProgressClick} // works on all devices now
      />

      <div className="w-full h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6 text-center relative">
          <ReelMedia
            reel={reels[index]}
            isActive
            onSwipeLeft={next} // swipe to next
            onSwipeRight={prev} // swipe to prev
          />
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">{reels[index].title}</h3>
            <p className="text-lg text-gray-700">{reels[index].content}</p>
          </div>
        </div>

        {/* CONTROLS (DESKTOP ONLY) */}
        {!isMobile && (
          <ReelControls
            isPaused={isPaused}
            index={index}
            total={reels.length}
            onPauseToggle={() => setIsPaused((p) => !p)}
            onPrev={prev}
            onNext={next}
          />
        )}
      </div>
    </FloatingPanel>
  );
}
