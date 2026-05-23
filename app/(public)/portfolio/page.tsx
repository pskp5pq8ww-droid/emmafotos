import { ProjectCard } from "@/components/public/ProjectCard";
import { Reveal } from "@/components/public/Reveal";
import styles from "@/components/public/Public.module.css";
import { projects } from "@/lib/public-content";

export const metadata = {
  title: "Portfolio",
};

export default function PortfolioPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>Portfolio</p>
          <h1 className={styles.pageTitle}>
            Selected public projects with permission to share.
          </h1>
        </Reveal>
      </section>
      <section className={styles.sectionTight}>
        <div className={styles.projectGrid}>
          {projects.map((project, index) => (
            <Reveal delay={index * 0.08} key={project.slug}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
