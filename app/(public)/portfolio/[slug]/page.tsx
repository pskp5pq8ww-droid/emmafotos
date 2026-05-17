import Image from "next/image";
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
      <section className={`${styles.pageHero} ${styles.detailHero}`}>
        <Reveal>
          <p className={styles.sectionEyebrow}>{project.category}</p>
          <h1 className={styles.pageTitle}>{project.title}</h1>
          <p className={styles.sectionCopy}>{project.summary}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className={styles.detailImage}>
            <Image
              src={project.cover}
              alt={project.title}
              width={1200}
              height={760}
              priority
            />
          </div>
        </Reveal>
      </section>
      <section className={styles.sectionTight}>
        <div className={styles.imageRail}>
          {project.images.map((image) => (
            <Image
              src={image}
              alt={project.title}
              width={760}
              height={940}
              key={image}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
