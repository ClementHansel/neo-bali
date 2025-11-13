// src/components/COOTestimony.tsx
"use client";

import { motion, Variants, Easing } from "framer-motion";

const easeCurve: Easing = [0.25, 0.1, 0.25, 1];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeCurve,
      delay: i * 0.2,
    },
  }),
  exit: {
    opacity: 0,
    y: 40,
    transition: { duration: 0.4, ease: easeCurve },
  },
};

export default function COOTestimony() {
  return (
    <section className="w-full bg-white text-black py-32 px-6 md:px-16 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        {/* Quote */}
        <motion.blockquote
          className="text-2xl md:text-3xl lg:text-4xl font-light italic leading-relaxed text-gray-800 mb-10"
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeUp}
          custom={0}
        >
          “As a highly specialized boutique agency and business partner, we
          combine marketing, sales, and consulting expertise to deliver premium
          sales funnels to our clients.”
        </motion.blockquote>

        {/* Divider Line */}
        <motion.div
          className="w-16 h-0.5 bg-yellow-500 mx-auto mb-8"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          exit={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: easeCurve }}
        />

        {/* Names */}
        <motion.div
          className="flex flex-col items-center gap-1 text-gray-700"
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeUp}
          custom={1}
        >
          <p className="font-semibold text-lg">Raoul Miller</p>
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">
            Founder
          </p>

          <p className="font-semibold text-lg">Ayham Muhrez</p>
          <p className="text-sm uppercase tracking-wider text-gray-500">
            Co-Founder
          </p>
        </motion.div>
      </div>
    </section>
  );
}
