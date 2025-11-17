"use client";

import Image from "next/image";
import { Reel } from "./ReelTypes";
import { useRef } from "react";

interface Props {
  reel: Reel;
  /** whether this reel is currently active (used to set priority for LCP) */
  isActive: boolean;
  /** Callbacks for swipe gestures */
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function ReelMedia({
  reel,
  isActive,
  onSwipeLeft,
  onSwipeRight,
}: Props) {
  const DEFAULT_W = reel.bgImageWidth ?? 1920;
  const DEFAULT_H = reel.bgImageHeight ?? 1080;

  // Touch handling for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      const SWIPE_THRESHOLD = 50; // pixels
      if (deltaX > SWIPE_THRESHOLD) {
        // Swipe left
        onSwipeLeft?.();
      } else if (deltaX < -SWIPE_THRESHOLD) {
        // Swipe right
        onSwipeRight?.();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="absolute inset-0 w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {reel.bgVideo ? (
        <video
          src={reel.bgVideo}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : reel.bgImage ? (
        <Image
          src={reel.bgImage}
          alt={reel.title ?? ""}
          width={DEFAULT_W}
          height={DEFAULT_H}
          priority={isActive} // only the currently visible reel gets priority
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
      ) : null}

      {/* gradient overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/60 to-white/80 pointer-events-none" />
    </div>
  );
}
