"use client";
import React from "react";
import { Reel } from "./ReelTypes";

interface Props {
  reels: Reel[];
  index: number;
  progressPct: number; // 0..100
  onClick?: (i: number) => void;
}

export default function ReelProgress({
  reels,
  index,
  progressPct,
  onClick,
}: Props) {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 p-3">
      <div className="flex gap-2">
        {reels.map((r, i) => {
          const widthStyle =
            i < index
              ? { width: "100%" }
              : i === index
              ? { width: `${progressPct}%` }
              : { width: "0%" };

          return (
            <div
              key={r.id}
              className="flex-1 h-1 bg-gray-200 rounded overflow-hidden relative cursor-pointer"
              onClick={() => onClick?.(i)}
            >
              {/* Progress fill */}
              <div
                className="h-full bg-black transition-all duration-150"
                style={widthStyle}
              />

              {/* Pulse indicator */}
              {i === index && (
                <div
                  className="absolute top-1/2 left-0 transform -translate-y-1/2"
                  style={{ left: `calc(${progressPct}% - 0.25rem)` }} // center the 2px pulse
                >
                  <span className="block w-2 h-2 rounded-full bg-white border border-black shadow animate-pulse" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
