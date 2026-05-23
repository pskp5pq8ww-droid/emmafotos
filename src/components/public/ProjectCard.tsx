import Image from "next/image";
import type { Project } from "@/lib/public-content";
import { TransitionLink } from "./TransitionLink";
import styles from "./Public.module.css";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <TransitionLink className={styles.projectCard} href={`/portfolio/${project.slug}`}>
      <div className={styles.projectImage}>
        <Image
          src={project.cover}
          alt={project.title}
          width={900}
          height={1100}
          sizes="(max-width: 980px) 100vw, 33vw"
        />
      </div>
      <div className={styles.projectMeta}>
        <span>{project.category}</span>
        <span>{project.year}</span>
      </div>
      <h3>{project.title}</h3>
    </TransitionLink>
  );
}
