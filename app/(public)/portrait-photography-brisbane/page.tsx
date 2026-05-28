import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { HowItWorks } from "@/components/public/HowItWorks";
import { FaqSection } from "@/components/public/FaqSection";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Portrait Photographer Brisbane",
  description:
    "Natural and editorial portrait photography in Brisbane by Emmanuel Rojas. Individual, couple and family portraits crafted with light, intention and genuine emotion.",
  alternates: { canonical: "/portrait-photography-brisbane" },
  openGraph: {
    title: "Portrait Photographer Brisbane | Emmanuel Rojas Photographer",
    description: "Cinematic portrait photography in Brisbane. Individual, professional and creative portraits crafted with natural light and genuine emotion.",
    url: "/portrait-photography-brisbane",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Portrait Photography in Brisbane",
  provider: { "@type": "ProfessionalService", name: "Emmanuel Rojas Photographer", url: "https://photographeraustralia.com" },
  areaServed: [{ "@type": "City", name: "Brisbane" }],
  serviceType: "Portrait Photography",
  description: "Natural, editorial and cinematic portrait photography in Brisbane. Individual, professional and creative portraits by Emmanuel Rojas.",
};

const faq = [
  { question: "What types of portrait sessions do you offer?", answer: "Individual portraits, professional headshots, creative editorial sessions, artist portraits, actor headshots and personal milestone sessions — all tailored to your purpose and aesthetic." },
  { question: "How is a portrait session different from a branding session?", answer: "A portrait session focuses primarily on capturing who you are as a person — your expression, presence and story. A branding session is focused on your professional identity and how you want to be perceived in a business context." },
  { question: "Where are portrait sessions held?", answer: "Outdoor Brisbane locations, urban settings or your chosen environment. I'm happy to suggest options based on the mood and style you're after." },
  { question: "Do I need experience in front of a camera?", answer: "No. I work with people at all levels of comfort with being photographed. The direction is always gentle, natural and focused on bringing out your authentic self." },
  { question: "How long is a portrait session?", answer: "Most portrait sessions last 45–90 minutes depending on the scope. Custom sessions are available for specific projects or longer shoots." },
];

export default function PortraitPhotographyBrisbane() {
  return (
    <main>
      <JsonLd data={jsonLd} />
      <section className={styles.serviceHero}>
        <div style={{ maxWidth: "1340px", margin: "0 auto" }}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Portrait Photography · Brisbane</p>
            <h1 className={styles.pageTitle}>Portrait Photographer in Brisbane</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy}>
              Individual, creative and editorial portraits crafted with natural
              light, genuine emotion and cinematic intention — images that
              capture not just how you look, but who you are.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={styles.serviceHeroCtas}>
              <a className={styles.buttonLight} href={studio.whatsapp} target="_blank" rel="noopener noreferrer">Book a Portrait Session</a>
              <TransitionLink className={styles.buttonGhost} href="/personal-branding-photography-brisbane">Personal Branding</TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Portraits with depth</p>
            <h2 className={styles.sectionTitle}>Your presence. Preserved honestly.</h2>
          </Reveal>
        </div>
        <div className={styles.benefitsList}>
          {[
            { title: "Individual and creative portraits", description: "For creatives, artists, musicians, performers and anyone who wants images that express their identity." },
            { title: "Professional headshots", description: "Clean, confident and contemporary headshots for LinkedIn, press profiles and professional use." },
            { title: "Natural direction", description: "I guide you at your own pace — no forced poses, just real expressions and genuine moments." },
            { title: "Golden hour light", description: "Outdoor Brisbane sessions timed around the warmest, most flattering natural light of the day." },
            { title: "Cinematic editing", description: "Every portrait is edited with a consistent, timeless palette — never over-processed or artificial." },
            { title: "Private delivery", description: "Your edited images delivered through a private gallery within 2 weeks of your session." },
          ].map((b, i) => (
            <Reveal delay={i * 0.06} key={b.title}>
              <div className={styles.benefitItem}><h3>{b.title}</h3><p>{b.description}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <HowItWorks />
      <FaqSection items={faq} eyebrow="Portrait FAQ" title="What to know about portrait sessions." />

      <section className={styles.sectionTight}>
        <Reveal>
          <div className={styles.areasGrid} style={{ gap: "16px" }}>
            <a className={styles.buttonLight} href={studio.whatsapp} target="_blank" rel="noopener noreferrer">Enquire Now</a>
            <TransitionLink className={styles.buttonGhost} href="/personal-branding-photography-brisbane">Personal Branding</TransitionLink>
            <TransitionLink className={styles.buttonGhost} href="/couple-photography-brisbane">Couple Sessions</TransitionLink>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
