import { Reveal } from "@/components/public/Reveal";
import styles from "@/components/public/Public.module.css";

export const metadata = {
  title: "Project",
  description: "A new chapter is coming — Emmanuel Rojas photography projects.",
};

export default function ProjectPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>Project</p>
          <h1 className={styles.pageTitle}>
            Something new is being built.
          </h1>
        </Reveal>
      </section>
      <section className={styles.sectionTight}>
        <Reveal>
          <p className={styles.sectionCopy} style={{ maxWidth: 560 }}>
            This section is coming soon. In the meantime, feel free to explore
            the portfolio or get in touch to discuss your project.
          </p>
        </Reveal>
      </section>
    </main>
  );
}
