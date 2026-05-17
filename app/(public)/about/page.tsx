import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/public/Reveal";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata = {
  title: "About",
  description:
    "Emmanuel Rojas is a wedding photographer based in Brisbane, Australia, creating natural, emotional and cinematic imagery for couples who value meaningful memories.",
};

export default function AboutPage() {
  return (
    <main>
      <section className={`${styles.pageHeroWide} ${styles.pageHeroAbout}`}>
        <div style={{ maxWidth: "1340px", margin: "0 auto" }}>
          <Reveal>
            <p className={styles.sectionEyebrow}>About</p>
            <h1 className={styles.pageTitle}>
              A calm eye for people, light and the moments in between.
            </h1>
          </Reveal>
        </div>
      </section>
      <section className={`${styles.sectionTight} ${styles.split}`}>
        <Reveal>
          <div>
            <p className={styles.sectionCopy}>
              I'm Emmanuel Rojas, a wedding photographer based in Brisbane,
              Australia — with over {studio.stats.years} years of experience
              and {studio.stats.events}+ events captured across Colombia,
              Australia, and around the world.
            </p>
            <p className={styles.sectionCopy}>
              I specialise in weddings, couple sessions and events — always
              with a natural, unhurried approach that lets real moments breathe.
              My philosophy is simple: be present, anticipate the instant, and
              tell the story as it truly happened.
            </p>
            <p className={styles.sectionCopy}>
              Every private gallery is delivered through a secure client portal
              where you can review, favourite and download your images at your
              own pace. From the first conversation to final delivery, every
              step is designed to feel as seamless as the memories themselves.
            </p>
            <a
              className={styles.button}
              href={studio.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", marginTop: "32px" }}
            >
              Book Your Session
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className={styles.portrait}>
            <Image
              src="/assets/emmanuel-portrait.jpg"
              alt="Emmanuel Rojas, photographer"
              width={1200}
              height={1600}
              priority
              quality={88}
            />
          </div>
        </Reveal>
      </section>
    </main>
  );
}
