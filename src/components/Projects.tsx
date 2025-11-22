"use client";

import Image from "next/image";
import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

const projects = [
  {
    id: 1,
    image: "/images/6907a82e05f27503ad48410d.png",
    title: "AZURA",
    subtitle: "the property brand in bali (Villa)",
    role: "Strategy Accelerator and Creative Partner",
    services:
      "Strategy / Brand & Campaign / CRM / Automations / Content Production",
  },
  {
    id: 2,
    image: "/images/6907a82eebf93330fd292a20.png",
    title: "ADDRESSBALI®",
    subtitle: "",
    role: "Strategy Accelerator and Creative Partner",
    services:
      "Strategy / Brand & Campaign / CRM / Automations / Content Production",
  },
  {
    id: 3,
    image: "/images/6907a82eebf9335152292a1f.png",
    title: "YAMAHA",
    subtitle: "",
    role: "Digital Strategy and Growth",
    services: "Strategy / Brand & Campaign / CRM / Automations",
  },
];

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.2 });

  const EASING: [number, number, number, number] = [0.6, 0.01, 0.05, 0.95];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASING },
    },
  };

  return (
    <section
      ref={ref}
      className="
        bg-white text-black
        flex flex-col items-center justify-center
        px-6 md:px-12
        py-4 sm:py-4 md:py-4
      "
    >
      {/* Section Header */}
      <motion.h2
        initial={{ opacity: 0, y: 25 }}
        animate={
          inView
            ? { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASING } }
            : { opacity: 0, y: 25 }
        }
        className="text-4xl md:text-6xl font-bold mb-12 sm:mb-16 text-center"
      >
        OUR PROJECTS
      </motion.h2>

      {/* Projects */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          gap-10 sm:gap-12
          max-w-7xl w-full
        "
      >
        {projects.map((p) => (
          <motion.div
            key={p.id}
            variants={cardVariants}
            className="
              group rounded-3xl overflow-hidden
              bg-gray-50 shadow-sm
              hover:shadow-lg transition-shadow duration-500
            "
          >
            <div className="relative w-full h-64 sm:h-72 md:h-80">
              <Image
                src={p.image}
                alt={p.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="p-6 sm:p-7 md:p-8">
              <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                {p.title}
              </h3>

              {p.subtitle && <p className="text-gray-500 mb-2">{p.subtitle}</p>}

              <p className="text-sm font-medium text-gray-700 mb-4">{p.role}</p>

              <p className="text-gray-600 text-sm leading-relaxed">
                {p.services}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
