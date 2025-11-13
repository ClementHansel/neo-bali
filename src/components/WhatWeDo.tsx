// src/components/WhatWeDo.tsx
"use client";

import { motion, Variants, Easing } from "framer-motion";
import Link from "next/link";

const easeCurve: Easing = [0.25, 0.1, 0.25, 1]; // cubic-bezier ease

// ✅ Fade-Up with TypeScript-safe easing and stagger delay
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeCurve,
      delay: i * 0.15,
    },
  }),
  exit: {
    opacity: 0,
    y: 40,
    transition: { duration: 0.4, ease: easeCurve },
  },
};

export default function WhatWeDo() {
  const sections = [
    {
      title: "STRATEGY",
      subtitle: "Connecting insight to impact",
      points: [
        "Brand Identity",
        "Journey Mapping",
        "Strategy Consulting",
        "Experience Design",
        "Process Design",
      ],
      link: "/strategy",
    },
    {
      title: "TECHNOLOGY",
      subtitle: "Powering seamless experiences",
      points: [
        "Meta",
        "Google Ads",
        "CRM",
        "WordPress",
        "Webflow",
        "SEO",
        "HTML",
        "Automation",
        "Tracking & Analytics",
        "AI",
      ],
      link: "/technology",
    },
    {
      title: "CREATIVES",
      subtitle: "Design that moves people",
      points: [
        "Ad Creative",
        "Brochure Design",
        "Landing Pages",
        "Videography",
        "Photography",
        "Brand Assets",
      ],
      link: "/creatives",
    },
    {
      title: "PERFORMANCE MARKETING (ADS)",
      subtitle: "Design that moves people",
      points: [
        "High Conversion Landingpages",
        "Tracking & Analytics",
        "Reporting",
        "Campaign Design",
      ],
      link: "/performance",
    },
  ];

  return (
    <section className="w-full bg-white text-black py-24 px-6 md:px-16 overflow-hidden">
      <div className="max-w-5xl mx-auto text-center">
        {/* Section Heading */}
        <motion.h2
          className="text-4xl md:text-6xl font-extrabold mb-6"
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeUp}
          custom={0}
        >
          WHAT WE DO
        </motion.h2>

        <motion.p
          className="text-lg md:text-xl text-gray-600 leading-relaxed mb-16"
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: false, amount: 0.3 }}
          variants={fadeUp}
          custom={1}
        >
          We love to create brands, convert leads into sales, and drive your
          growth. Relentless performance-driven, always customer-centered,
          high-conversion focused.
        </motion.p>
      </div>

      {/* Section List */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            className="text-center md:text-left border-t border-gray-200 pt-8"
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: false, amount: 0.3 }}
            variants={fadeUp}
            custom={i + 2}
          >
            <Link href={section.link} className="group block">
              <motion.h3
                className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-yellow-600 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {section.title}
              </motion.h3>

              <p className="text-gray-500 mb-4">{section.subtitle}</p>

              <ul className="flex flex-wrap justify-center md:justify-start gap-2 text-gray-700 text-sm">
                {section.points.map((p, j) => (
                  <li
                    key={j}
                    className="bg-gray-100 px-3 py-1 rounded-full hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
