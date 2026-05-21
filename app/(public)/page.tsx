import Link from "next/link";
import { HeroSlideshow } from "@/components/public/HeroSlideshow";
import { ViewProjectButton } from "@/components/public/ViewProjectButton";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Reveal } from "@/components/public/Reveal";
import { AnimatedStat } from "@/components/public/AnimatedStat";
import { HeroParallax } from "@/components/public/HeroParallax";
// ReviewsMarquee import kept but section hidden until real reviews are collected
// import { ReviewsMarquee } from "@/components/public/ReviewsMarquee";
import styles from "@/components/public/Public.module.css";
import { projects, services, studio } from "@/lib/public-content";

export default async function HomePage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <HeroSlideshow />
        </div>
        <div className={styles.heroInner}>
          <HeroParallax>
          <Reveal>
            <p className={styles.eyebrow}>
              Brisbane, Australia · Lifelong Memory Maker
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className={styles.heroTitle}>Emmanuel Rojas</h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className={styles.heroCopy}>
              Elegant wedding photography for moments that last forever.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
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
              <ViewProjectButton className={styles.buttonGhost} />
            </div>
          </Reveal>
          <Reveal delay={0.34}>
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
                <span>Worldwide</span>
              </div>
            </div>
          </Reveal>
          </HeroParallax>
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

      {/* ReviewsMarquee hidden — uncomment when real client reviews are collected */}
      {/* <ReviewsMarquee reviews={approvedReviews} /> */}

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
