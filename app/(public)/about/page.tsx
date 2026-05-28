import type { Metadata } from "next";
import Image from "next/image";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Emmanuel Rojas is a Brisbane-based photographer and visual storyteller with 4+ years of experience and 200+ weddings, events, portraits and brand stories captured across Australia and worldwide.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Emmanuel Rojas | Brisbane Photographer",
    description:
      "4+ years of experience. 200+ events captured. Based in Brisbane, available Australia-wide and internationally. Wedding, event, portrait, maternity and branding photography.",
    url: "/about",
  },
};

const jsonLdPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Emmanuel Rojas",
  jobTitle: "Photographer and Visual Storyteller",
  description:
    "Brisbane-based photographer with 4+ years of experience specialising in weddings, events, portraits, couples, maternity and personal branding photography.",
  worksFor: {
    "@type": "Organization",
    name: "Emmanuel Rojas Photographer",
    url: "https://photographeraustralia.com",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brisbane",
    addressRegion: "QLD",
    addressCountry: "AU",
  },
  sameAs: ["https://www.instagram.com/emmanuel_r0jas_/"],
  image: "https://photographeraustralia.com/assets/emmanuel-portrait.jpg",
};

const credentials = [
  { label: "Experience", value: "4+ years" },
  { label: "Events captured", value: "200+" },
  { label: "Based in", value: "Brisbane, QLD" },
  { label: "Available", value: "Australia & Worldwide" },
  { label: "Specialties", value: "Wedding · Event · Portrait · Branding" },
  { label: "Gallery delivery", value: "Private online portal" },
];

export default function AboutPage() {
  return (
    <main>
      <JsonLd data={jsonLdPerson} />

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
              I'm Emmanuel Rojas, a Brisbane-based photographer and visual
              storyteller with over {studio.stats.years} years of experience and{" "}
              {studio.stats.events}+ weddings, events, portraits and brand
              stories captured across Australia and around the world.
            </p>
            <p className={styles.sectionCopy} style={{ marginTop: "24px" }}>
              My work blends documentary emotion with cinematic direction,
              natural light, clean composition and colour grading that feels
              timeless. Whether it is a wedding, a brand session, a maternity
              story or a live event, every image is created with intention, care
              and emotional honesty.
            </p>
            <p className={styles.sectionCopy} style={{ marginTop: "24px" }}>
              I believe photography should feel natural, elegant and deeply
              personal — preserving not only how a moment looked, but how it
              felt. I guide clients through every session in a calm, unhurried
              way so the images reflect who they truly are.
            </p>
            <p className={styles.sectionCopy} style={{ marginTop: "24px" }}>
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
              style={{ display: "inline-flex", marginTop: "36px" }}
            >
              Book Your Session
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className={styles.portrait}>
            <Image
              src="/assets/emmanuel-portrait.jpg"
              alt="Emmanuel Rojas, Brisbane photographer and visual storyteller"
              width={1200}
              height={1600}
              priority
              quality={88}
            />
          </div>
        </Reveal>
      </section>

      {/* E-E-A-T credentials */}
      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Experience & trust</p>
            <h2 className={styles.sectionTitle}>Built on years of real work.</h2>
          </Reveal>
        </div>
        <div className={styles.benefitsList}>
          {credentials.map((c, i) => (
            <Reveal delay={i * 0.06} key={c.label}>
              <div className={styles.benefitItem}>
                <p className={styles.meta} style={{ marginBottom: "8px" }}>{c.label}</p>
                <h3 style={{ fontFamily: "var(--gallery-title)", fontSize: "clamp(18px,1.8vw,24px)", fontWeight: 400, margin: 0 }}>{c.value}</h3>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={`${styles.sectionTight} ${styles.cta}`}>
        <div>
          <p className={styles.sectionEyebrow}>Let's work together</p>
          <h2 className={styles.sectionTitle}>Tell me what needs to be remembered.</h2>
        </div>
        <TransitionLink className={styles.buttonLight} href="/contact">
          Start Enquiry
        </TransitionLink>
      </section>
    </main>
  );
}
