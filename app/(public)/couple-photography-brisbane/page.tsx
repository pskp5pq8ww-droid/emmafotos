import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { HowItWorks } from "@/components/public/HowItWorks";
import { FaqSection } from "@/components/public/FaqSection";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Couple Photographer Brisbane",
  description:
    "Natural and cinematic couple photography sessions in Brisbane by Emmanuel Rojas — crafted with emotion, connection and timeless style. From $350.",
  alternates: { canonical: "/couple-photography-brisbane" },
  openGraph: {
    title: "Couple Photographer Brisbane | Emmanuel Rojas Photographer",
    description:
      "Relaxed and editorial couple sessions in Brisbane. Natural light, genuine connection and cinematic colour grading. From $350.",
    url: "/couple-photography-brisbane",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Couple Photography in Brisbane",
  provider: { "@type": "ProfessionalService", name: "Emmanuel Rojas Photographer", url: "https://photographeraustralia.com" },
  areaServed: [{ "@type": "City", name: "Brisbane" }, { "@type": "State", name: "Queensland" }],
  serviceType: "Couple Photography",
  offers: { "@type": "Offer", price: "350", priceCurrency: "AUD", description: "Starting from $350" },
  description: "Natural and editorial couple sessions in Brisbane by Emmanuel Rojas. Relaxed direction, genuine emotion and cinematic style.",
};

const faq = [
  { question: "Where can we have our couple session in Brisbane?", answer: "Popular spots include Kangaroo Point Cliffs, New Farm Park, South Bank, Brisbane City Botanic Gardens and Mount Coot-tha. I'm happy to suggest locations that suit your style." },
  { question: "How long is a couple session?", answer: "Most couple sessions last 60–90 minutes. This gives us enough time to try a couple of locations, relax into the session and capture a variety of images." },
  { question: "What is the best time for a couple session in Brisbane?", answer: "Golden hour — one to two hours before sunset — gives the warmest, most cinematic light. I always recommend this timing for outdoor Brisbane sessions." },
  { question: "Do we need experience in front of a camera?", answer: "Not at all. I guide you naturally throughout the session so you feel comfortable, relaxed and yourself — no awkward posing required." },
  { question: "How many photos will we receive?", answer: "You will receive a gallery of 60–100+ fully edited images from a standard 90-minute session, delivered through your private online portal." },
];

export default function CouplePhotographyBrisbane() {
  return (
    <main>
      <JsonLd data={jsonLd} />
      <section className={styles.serviceHero}>
        <div style={{ maxWidth: "1340px", margin: "0 auto" }}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Couple Photography · Brisbane</p>
            <h1 className={styles.pageTitle}>Couple Photographer in Brisbane</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy}>
              Relaxed portrait sessions for couples who want honest, elegant and
              editorial images. Styled around your story, your energy and your
              way of being together.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={styles.serviceHeroCtas}>
              <a className={styles.buttonLight} href={studio.whatsapp} target="_blank" rel="noopener noreferrer">Book Your Session — From $350</a>
              <TransitionLink className={styles.buttonGhost} href="/best-locations-for-couple-photos-brisbane">Best Brisbane Locations</TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>What to expect</p>
            <h2 className={styles.sectionTitle}>Natural. Cinematic. Deeply personal.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy}>
              Every couple session is shaped around who you are — not a generic
              posing script. I keep the direction light and the atmosphere
              relaxed so the images feel honest and effortlessly real.
            </p>
          </Reveal>
        </div>
        <div className={styles.benefitsList}>
          {[
            { title: "Natural direction", description: "I guide you through every moment gently — no stiff poses, just prompts that bring out genuine expressions and connection." },
            { title: "Cinematic light and colour", description: "Sessions are timed around golden hour for the warmest, most flattering Brisbane light. Every image is colour graded with a timeless, film-inspired palette." },
            { title: "Multiple locations", description: "We can work across one or two Brisbane locations in a single session — parks, riverside, urban textures or wherever tells your story best." },
            { title: "Private gallery delivery", description: "Your edited gallery is delivered within 2–3 weeks through a private portal, ready to download, print and share." },
            { title: "Outfit guidance", description: "I'll send you a guide with tips on what to wear, how to coordinate colours and what to expect on the day so you arrive confident." },
            { title: "From $350", description: "Couple sessions start at $350 for a 60-minute session with full editing and private gallery delivery. Longer sessions and multiple locations available." },
          ].map((b, i) => (
            <Reveal delay={i * 0.06} key={b.title}>
              <div className={styles.benefitItem}><h3>{b.title}</h3><p>{b.description}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <HowItWorks />
      <FaqSection items={faq} eyebrow="Couple Session FAQ" title="What people ask about couple sessions." />

      <section className={styles.sectionTight}>
        <Reveal>
          <div className={styles.areasGrid} style={{ gap: "16px" }}>
            <a className={styles.buttonLight} href={studio.whatsapp} target="_blank" rel="noopener noreferrer">Book Now</a>
            <TransitionLink className={styles.buttonGhost} href="/portfolio">Portfolio</TransitionLink>
            <TransitionLink className={styles.buttonGhost} href="/wedding-photography-brisbane">Wedding Photography</TransitionLink>
            <TransitionLink className={styles.buttonGhost} href="/what-to-wear-for-a-couple-photoshoot">What to Wear</TransitionLink>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
