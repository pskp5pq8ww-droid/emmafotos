import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { HowItWorks } from "@/components/public/HowItWorks";
import { FaqSection } from "@/components/public/FaqSection";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Event Photographer Brisbane",
  description:
    "Professional event photography in Brisbane for corporate launches, private parties, live events and brand experiences. From $750.",
  alternates: { canonical: "/event-photography-brisbane" },
  openGraph: {
    title: "Event Photographer Brisbane | Emmanuel Rojas Photographer",
    description: "Corporate launches, private events and live coverage in Brisbane. Atmosphere, energy and editorial storytelling. From $750.",
    url: "/event-photography-brisbane",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Event Photography in Brisbane",
  provider: { "@type": "ProfessionalService", name: "Emmanuel Rojas Photographer", url: "https://photographeraustralia.com" },
  areaServed: [{ "@type": "City", name: "Brisbane" }, { "@type": "State", name: "Queensland" }],
  serviceType: "Event Photography",
  offers: { "@type": "Offer", price: "750", priceCurrency: "AUD", description: "Starting from $750" },
  description: "Professional event photography in Brisbane — corporate launches, private parties and live events documented with energy, clarity and cinematic intention.",
};

const faq = [
  { question: "What types of events do you cover?", answer: "Corporate launches, product reveals, brand activations, gala dinners, private parties, birthday events, live music, festivals and community events across Brisbane and Queensland." },
  { question: "Do you provide edited images on the same day?", answer: "For most events, fully edited images are delivered within 5–7 business days. Rush delivery may be available for select events — enquire when booking." },
  { question: "How many photographers are needed for large events?", answer: "For events over 150 guests or with multiple simultaneous spaces, a second photographer may be recommended. This can be arranged and quoted separately." },
  { question: "Can you handle low-light event venues?", answer: "Yes. I work comfortably in low-light environments — clubs, theatres, evening venues and dimly lit corporate spaces." },
  { question: "Do you photograph live music and concerts?", answer: "Yes. Concert and live performance photography is available for artists, venues and promoters in Brisbane and Queensland." },
];

export default function EventPhotographyBrisbane() {
  return (
    <main>
      <JsonLd data={jsonLd} />
      <section className={styles.serviceHero}>
        <div style={{ maxWidth: "1340px", margin: "0 auto" }}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Event Photography · Brisbane</p>
            <h1 className={styles.pageTitle}>Event Photographer in Brisbane</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy}>
              Corporate launches, private celebrations and live events
              documented with clarity, energy and intention. Every atmosphere
              captured with a cinematic eye.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={styles.serviceHeroCtas}>
              <a className={styles.buttonLight} href={studio.whatsapp} target="_blank" rel="noopener noreferrer">Enquire — From $750</a>
              <TransitionLink className={styles.buttonGhost} href="/portfolio">View Event Work</TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>What's included</p>
            <h2 className={styles.sectionTitle}>Every event told with purpose.</h2>
          </Reveal>
        </div>
        <div className={styles.benefitsList}>
          {[
            { title: "Atmosphere and energy", description: "I capture the full environment — the crowd, the details, the speakers, the energy — so the story of your event is complete." },
            { title: "Corporate and brand events", description: "Product launches, brand activations, corporate conferences and networking events documented professionally and efficiently." },
            { title: "Live music and concerts", description: "Stage lighting, performance energy and crowd moments captured with precision and rhythm." },
            { title: "Low-light expertise", description: "Comfortable working in dimly lit venues, theatres, clubs and evening event spaces." },
            { title: "Fast delivery", description: "Edited galleries delivered within 5–7 business days. Rush delivery available for select events." },
            { title: "Brisbane and beyond", description: "Available for events across Brisbane, Gold Coast, Sunshine Coast and Queensland-wide." },
          ].map((b, i) => (
            <Reveal delay={i * 0.06} key={b.title}>
              <div className={styles.benefitItem}><h3>{b.title}</h3><p>{b.description}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <HowItWorks />
      <FaqSection items={faq} eyebrow="Event FAQ" title="Common questions about event photography." />

      <section className={styles.sectionTight}>
        <Reveal>
          <div className={styles.areasGrid} style={{ gap: "16px" }}>
            <a className={styles.buttonLight} href={studio.whatsapp} target="_blank" rel="noopener noreferrer">Enquire Now</a>
            <TransitionLink className={styles.buttonGhost} href="/portfolio">Portfolio</TransitionLink>
            <TransitionLink className={styles.buttonGhost} href="/drone-photography-brisbane">Drone Photography</TransitionLink>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
