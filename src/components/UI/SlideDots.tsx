import { motion } from "framer-motion";

export default function SlideDots({
  total,
  current,
  onJump,
}: {
  total: number;
  current: number;
  onJump: (n: number) => void;
}) {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
      {Array.from({ length: total }).map((_, i) => (
        <motion.button
          key={i}
          onClick={() => onJump(i)}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12, type: "spring", stiffness: 120 }}
          className="group"
        >
          <div
            className={`h-3 w-3 rounded-full transition-all duration-300
              ${i === current ? "bg-white scale-125 shadow-lg" : "bg-white/40"}
            `}
          ></div>

          {/* progress bar next to the dot */}
          <div className="h-1 w-6 bg-white/20 mt-1 overflow-hidden rounded">
            <motion.div
              className="h-full bg-white"
              animate={{ width: i <= current ? "100%" : "0%" }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </motion.button>
      ))}
    </div>
  );
}
