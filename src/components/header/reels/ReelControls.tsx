"use client";

interface Props {
  isPaused: boolean;
  index: number;
  total: number;
  onPauseToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ReelControls({
  isPaused,
  index,
  total,
  onPauseToggle,
  onPrev,
  onNext,
}: Props) {
  // Only render controls on desktop (>= md)
  return (
    <div className="hidden md:flex p-3 border-t bg-white/70 items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={onPauseToggle}
          aria-label={isPaused ? "Resume" : "Pause"}
          title={isPaused ? "Resume" : "Pause"}
          className="px-3 py-2 rounded-full border hover:bg-gray-100 transition"
        >
          {isPaused ? "Play" : "Pause"}
        </button>

        <button
          onClick={onPrev}
          aria-label="Previous reel"
          title="Previous"
          className="px-3 py-2 rounded-full border hover:bg-gray-100 transition"
        >
          Prev
        </button>

        <button
          onClick={onNext}
          aria-label="Next reel"
          title="Next"
          className="px-3 py-2 rounded-full border hover:bg-gray-100 transition"
        >
          Next
        </button>
      </div>

      <div className="text-sm text-gray-600">
        {index + 1}/{total}
      </div>
    </div>
  );
}
