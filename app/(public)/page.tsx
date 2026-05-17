import Image from "next/image";
import Link from "next/link";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Reveal } from "@/components/public/Reveal";
import styles from "@/components/public/Public.module.css";
import { projects, reviews, services, studio } from "@/lib/public-content";

export default function HomePage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image
            src="/assets/og-preview.png"
            alt="Emmanuel Rojas Studio"
            fill
            sizes="100vw"
            priority
          />
        </div>
        <div className={styles.heroInner}>
          <Reveal>
            <p className={styles.eyebrow}>
              Brisbane, Australia · Bodas · Sesiones · Eventos · Video & Drone
            </p>
            <h1 className={styles.heroTitle}>Emmanuel Rojas</h1>
            <p className={styles.heroCopy}>
              Fotografía de bodas elegante, natural y emocional en Brisbane.
              Más de {studio.stats.events} eventos capturados con una mirada que convierte momentos en memorias para toda la vida.
            </p>
            <Link className={styles.buttonLight} href="/contact">
              Reserva tu sesión
            </Link>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={styles.heroStats}>
              <div><strong>{studio.stats.years} años</strong><span>de experiencia</span></div>
              <div><strong>{studio.stats.events} eventos</strong><span>capturados</span></div>
              <div><strong>Brisbane</strong><span>· Worldwide</span></div>
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
              Every production is designed around the final memory: what should
              be felt, what should be preserved, and how the work will live
              digitally after the day ends.
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

      <section className={styles.quoteBand}>
        <div className={styles.sectionTight}>
          <div className={styles.reviews}>
            {reviews.map((review) => (
              <article className={styles.review} key={review.name}>
                <p className={styles.meta}>{review.name}</p>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.sectionTight} ${styles.cta}`}>
        <div>
          <p className={styles.sectionEyebrow}>¿Listo para empezar?</p>
          <h2 className={styles.sectionTitle}>
            Cuéntame sobre tu día especial y lo haré eterno.
          </h2>
        </div>
        <Link className={styles.buttonLight} href="/contact">
          Hablemos
        </Link>
      </section>
    </main>
  );
}
