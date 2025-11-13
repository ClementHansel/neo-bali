import fs from "fs";
import path from "path";
import { Project } from "../types";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export function getAllProjects(): Project[] {
  const files = fs.readdirSync(PROJECTS_DIR);
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(PROJECTS_DIR, file), "utf-8");
    return JSON.parse(raw) as Project;
  });
}

export function getProjectBySlug(slug: string): Project | null {
  const projects = getAllProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}
