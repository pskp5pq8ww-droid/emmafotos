import Image from "next/image";
import { Reveal } from "@/components/public/Reveal";
import styles from "@/components/public/Public.module.css";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>About</p>
          <h1 className={styles.pageTitle}>
            A calm eye for people, spaces and meaningful movement.
          </h1>
        </Reveal>
      </section>
      <section className={`${styles.sectionTight} ${styles.split}`}>
        <Reveal>
          <div>
            <p className={styles.sectionCopy}>
              Emmanuel Rojas creates photography and visual production for
              couples, artists, founders and teams that care about atmosphere.
              His work is built on direction without force: clear composition,
              natural presence and details that feel remembered rather than
              staged.
            </p>
            <p className={styles.sectionCopy}>
              The studio blends creative direction, documentary timing and
              digital delivery. From the first conversation to the private
              gallery, every step is designed to feel polished and personal.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className={styles.portrait}>
            <Image
              src="/assets/emmanuel-portrait.jpg"
              alt="Emmanuel Rojas"
              width={791}
              height={1024}
              priority
            />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
