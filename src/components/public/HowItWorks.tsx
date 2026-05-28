import { Reveal } from "./Reveal";
import { howItWorks } from "@/lib/public-content";
import styles from "./Public.module.css";

export function HowItWorks() {
  return (
    <section className={styles.sectionTight}>
      <div className={styles.sectionHeader}>
        <Reveal>
          <p className={styles.sectionEyebrow}>How it works</p>
          <h2 className={styles.sectionTitle}>From first message to delivered gallery.</h2>
        </Reveal>
      </div>
      <div className={styles.howItWorksGrid}>
        {howItWorks.map((item, index) => (
          <Reveal delay={index * 0.08} key={item.step}>
            <div className={styles.howItWorksStep}>
              <span className={styles.howItWorksNumber}>{item.step}</span>
              <h3 className={styles.howItWorksTitle}>{item.title}</h3>
              <p className={styles.howItWorksDesc}>{item.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
