import Company from "@/components/Company";
import Hero from "../components/Hero";
import { Project } from "../types";
import Projects from "@/components/Projects";
import WhatWeDo from "@/components/WhatWeDo";
import COOTestimony from "@/components/COOTestimony";
import { Footer } from "@/components/Footer";
import ShowcaseScroll from "@/components/ShowcaseScroll";

export default function Home({}: { projects: Project[] }) {
  return (
    <>
      <Hero />
      <Company />
      <Projects />
      <WhatWeDo />
      <ShowcaseScroll />
      <COOTestimony />
      <Footer />
    </>
  );
}
