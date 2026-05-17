import Link from "next/link";
import { Reveal } from "@/components/public/Reveal";
import styles from "@/components/public/Public.module.css";
import { services } from "@/lib/public-content";

export const metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <main>
      <section className={`${styles.pageHeroWide} ${styles.pageHeroServices}`}>
        <div style={{ maxWidth: "1340px", margin: "0 auto" }}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Services</p>
            <h1 className={styles.pageTitle}>
              Visual production shaped for the way each story should be kept.
            </h1>
          </Reveal>
        </div>
      </section>
      <section className={styles.sectionTight}>
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <Reveal delay={index * 0.06} key={service.title}>
              <article className={styles.serviceCard}>
                <p className={styles.meta}>{service.kicker}</p>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <span className={styles.servicePrice}>{service.startingAt}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className={`${styles.sectionTight} ${styles.cta}`}>
        <div>
          <p className={styles.sectionEyebrow}>Availability</p>
          <h2 className={styles.sectionTitle}>Tell us what you are making.</h2>
        </div>
        <Link className={styles.buttonLight} href="/contact">
          Start Inquiry
        </Link>
      </section>
    </main>
  );
}
