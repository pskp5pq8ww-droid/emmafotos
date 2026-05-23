import { notFound } from "next/navigation";
import { Reveal } from "@/components/public/Reveal";
import styles from "@/components/public/Public.module.css";
import { getProject, projects } from "@/lib/public-content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  return {
    title: project?.title ?? "Project",
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <main>
      <section className={styles.portfolioHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>{project.category}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className={styles.portfolioTitle}>{project.title}</h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className={styles.portfolioDate}>
            {project.location} · {project.year}
          </p>
        </Reveal>
        {project.summary ? (
          <Reveal delay={0.24}>
            <p className={styles.portfolioSummary}>{project.summary}</p>
          </Reveal>
        ) : null}
      </section>

      <section className={styles.portfolioMasonry}>
        {project.images.map((image, index) => (
          <article
            className={styles.portfolioPhoto}
            key={image}
            style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={project.title}
              loading={index < 3 ? "eager" : "lazy"}
              decoding="async"
            />
          </article>
        ))}
      </section>
    </main>
  );
}
