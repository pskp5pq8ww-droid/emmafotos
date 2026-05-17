import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Reveal } from "@/components/public/Reveal";
import { AnimatedStat } from "@/components/public/AnimatedStat";
import { ReviewsMarquee } from "@/components/public/ReviewsMarquee";
import styles from "@/components/public/Public.module.css";
import { readDB } from "@/lib/db";
import { projects, services, studio } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const db = await readDB();
  const approvedReviews = db.reviews
    .filter((review) => review.approved && review.allowPublicDisplay)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((review) => ({
      name: review.clientName,
      rating: review.rating,
      text: review.message,
    }));

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image
            src="/assets/og-preview.png"
            alt="Emmanuel Rojas — Wedding Photographer Brisbane"
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className={styles.heroInner}>
          <Reveal>
            <p className={styles.eyebrow}>
              Brisbane, Australia · Weddings · Sessions · Events · Drone
            </p>
            <h1 className={styles.heroTitle}>Emmanuel Rojas</h1>
            <p className={styles.heroCopy}>
              Wedding photography crafted with elegance, emotion, and timeless intention.
              I capture honest moments, refined details, and lifelong memories
              for couples who want their story told beautifully.
            </p>
            <div className={styles.heroCtas}>
              <a
                className={styles.buttonLight}
                href={studio.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Your Session
              </a>
              <Link className={styles.buttonGhost} href="/gallery">
                View Your Gallery
              </Link>
              <Link className={styles.buttonGhost} href="/project">
                View Project
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={styles.heroStats}>
              <div>
                <AnimatedStat value={studio.stats.years} />
                <span>years experience</span>
              </div>
              <div>
                <AnimatedStat value={studio.stats.events} />
                <span>events captured</span>
              </div>
              <div>
                <strong>Brisbane</strong>
                <span>· Worldwide</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Services</p>
            <h2 className={styles.sectionTitle}>
              Images built with rhythm, restraint and intention.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className={styles.sectionCopy}>
              Every session is shaped around the story that needs to be kept —
              what should be felt, what should endure, and how the work will
              live long after the day is over.
            </p>
          </Reveal>
        </div>
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <Reveal delay={index * 0.06} key={service.title}>
              <article className={styles.serviceCard}>
                <p className={styles.meta}>{service.kicker}</p>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className={styles.servicePrice}>{service.startingAt}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Selected Work</p>
            <h2 className={styles.sectionTitle}>Quiet frames. Lasting pull.</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <Link className={styles.button} href="/portfolio">
              View Portfolio
            </Link>
          </Reveal>
        </div>
        <div className={styles.projectGrid}>
          {projects.map((project, index) => (
            <Reveal delay={index * 0.08} key={project.slug}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      <ReviewsMarquee reviews={approvedReviews} />

      <section className={`${styles.sectionTight} ${styles.cta}`}>
        <div>
          <p className={styles.sectionEyebrow}>Ready to begin?</p>
          <h2 className={styles.sectionTitle}>
            Ready to create your lifelong memories?
          </h2>
        </div>
        <a
          className={styles.buttonLight}
          href={studio.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book Your Session
        </a>
      </section>
    </main>
  );
}
