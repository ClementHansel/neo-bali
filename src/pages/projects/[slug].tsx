import { GetStaticPaths, GetStaticProps } from "next";
import { getAllProjects, getProjectBySlug } from "../../lib/projects";
import { Project } from "../../types";
import Image from "next/image";

const ProjectPage: React.FC<{ project: Project }> = ({ project }) => {
  if (!project) return <div>Not found</div>;
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
      <p className="text-sm mb-6">{project.excerpt}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {project.images.map((src) => (
          <div key={src} className="relative h-72 rounded overflow-hidden">
            <Image
              src={src}
              alt={project.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = getAllProjects();
  return {
    paths: projects.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const project = getProjectBySlug(slug);
  return {
    props: { project },
  };
};
