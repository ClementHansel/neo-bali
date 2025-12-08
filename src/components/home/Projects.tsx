"use client";

import Image from "next/image";

// Project Data
const projects = [
  {
    id: 1,
    image: "/images/6907a82e05f27503ad48410d.png",
    title: "AZURA",
    subtitle: "",
    role: "Full Digital Marketing Strategy and Implementation Partner",
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
    role: "Digital Strategy Partner and Social Media Content Provider",
    services: "Strategy / Brand & Campaign / Social Media / Automations",
  },
];

// Brand font selector
function getBrandFont(title: string) {
  switch (title) {
    case "AZURA":
    case "Developer":
      return "font-azura lowercase";
    case "ADDRESSBALI®":
      return "font-ab";
    case "YAMAHA":
      return "font-yamaha text-red-500 font-bold tracking-wider";
    default:
      return "font-inter";
  }
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="
        bg-white text-black
        flex flex-col items-center justify-center
        px-6 md:px-12
        py-10 md:py-16
      "
    >
      {/* Section Header */}
      <h2 className="text-4xl md:text-6xl font-extrabold mb-10 tracking-tight font-inter">
        OUR PROJECTS
      </h2>

      {/* Project Cards */}
      <div
        className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          gap-10 sm:gap-12
          max-w-7xl w-full
        "
      >
        {projects.map((p) => (
          <article
            key={p.id}
            className="
              rounded-3xl overflow-hidden
              bg-gray-50 shadow-sm
              transition-all duration-300 hover:shadow-md
            "
          >
            <div className="relative w-full h-64 sm:h-72 md:h-80">
              <Image
                src={p.image}
                alt={p.title || "Project image"}
                fill
                className="object-cover"
                priority={p.id === 1}
              />
            </div>

            <div className="p-6 sm:p-7 md:p-8">
              <h3
                className={`
                  text-2xl md:text-3xl mb-2 tracking-tight
                  ${getBrandFont(p.title)}
                `}
              >
                {p.title}
              </h3>

              {p.subtitle && (
                <p className="text-gray-500 mb-2 font-inter">{p.subtitle}</p>
              )}

              <p className="text-sm font-semibold text-gray-700 mb-4 font-inter">
                {p.role}
              </p>

              <p className="text-gray-600 text-sm leading-relaxed font-inter">
                {p.services}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
