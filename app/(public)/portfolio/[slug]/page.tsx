import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/public/Reveal";
import { TransitionLink } from "@/components/public/TransitionLink";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { getProject, projects } from "@/lib/public-content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };

  return {
    title: `${project.title} — ${project.category}`,
    description: project.summary,
    alternates: { canonical: `/portfolio/${slug}` },
    openGraph: {
      title: `${project.title} | Emmanuel Rojas Photographer`,
      description: project.summary,
      url: `/portfolio/${slug}`,
      images: [{ url: project.cover, alt: `${project.title} — ${project.category} by Emmanuel Rojas` }],
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    creator: {
      "@type": "Person",
      name: "Emmanuel Rojas",
      url: "https://photographeraustralia.com/about",
    },
    genre: project.category,
    locationCreated: { "@type": "Place", name: project.location },
    dateCreated: project.year,
    url: `https://photographeraustralia.com/portfolio/${slug}`,
    image: project.cover,
  };

  return (
    <main>
      <JsonLd data={jsonLd} />

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
              alt={`${project.category} by Emmanuel Rojas — ${project.title}, ${project.location} ${project.year}`}
              loading={index < 3 ? "eager" : "lazy"}
              decoding="async"
            />
          </article>
        ))}
      </section>

      <section className={styles.sectionTight}>
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            padding: "0 clamp(20px, 6vw, 92px)",
          }}
        >
          <TransitionLink className={styles.button} href="/portfolio">
            ← All Projects
          </TransitionLink>
          <TransitionLink className={styles.buttonGhost} href="/contact">
            Book a Session
          </TransitionLink>
        </div>
      </section>
    </main>
  );
}
