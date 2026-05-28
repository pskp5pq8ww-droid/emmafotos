import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { HowItWorks } from "@/components/public/HowItWorks";
import { FaqSection } from "@/components/public/FaqSection";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Drone Photographer Brisbane",
  description:
    "Cinematic drone photography and aerial footage in Brisbane for weddings, events, brands and special projects by Emmanuel Rojas Photographer.",
  alternates: { canonical: "/drone-photography-brisbane" },
  openGraph: {
    title: "Drone Photographer Brisbane | Emmanuel Rojas Photographer",
    description: "Aerial photography and cinematic drone footage in Brisbane for weddings, events and brand campaigns.",
    url: "/drone-photography-brisbane",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Drone Photography in Brisbane",
  provider: { "@type": "ProfessionalService", name: "Emmanuel Rojas Photographer", url: "https://photographeraustralia.com" },
  areaServed: [{ "@type": "City", name: "Brisbane" }, { "@type": "State", name: "Queensland" }],
  serviceType: "Drone Photography",
  description: "Cinematic aerial photography and footage for weddings, events and brands in Brisbane and Queensland.",
};

const faq = [
  { question: "Is drone photography available for indoor venues?", answer: "Drone photography is best suited for outdoor venues and open-air locations. Indoor venues and restricted airspace may not be suitable — this is confirmed during planning." },
  { question: "Do you need special permissions for drone photography?", answer: "All drone operations follow CASA (Civil Aviation Safety Authority) regulations in Australia. Certain locations require permits — this is handled during the planning phase." },
  { question: "Can drone footage be added to my wedding package?", answer: "Yes. Drone photography and footage can be added to wedding coverage as an add-on. It works especially well for outdoor ceremony venues, coastal locations and rural properties." },
  { question: "What does drone photography add to an event or wedding?", answer: "Aerial shots add scale, context and a cinematic dimension that ground-level photography cannot capture — establishing shots of the venue, landscape perspectives and sweeping coverage of large gatherings." },
  { question: "What weather conditions affect drone photography?", answer: "High winds, rain and low visibility affect drone operations. Conditions are checked before each session and a backup plan is always discussed." },
];

export default function DronePhotographyBrisbane() {
  return (
    <main>
      <JsonLd data={jsonLd} />
      <section className={styles.serviceHero}>
        <div style={{ maxWidth: "1340px", margin: "0 auto" }}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Drone Photography · Brisbane</p>
            <h1 className={styles.pageTitle}>Drone Photographer in Brisbane</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy}>
              Cinematic aerial photography and footage for weddings, events,
              brands and special projects across Brisbane and Queensland. A
              wider perspective that adds depth, scale and emotion to your story.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={styles.serviceHeroCtas}>
              <a className={styles.buttonLight} href={studio.whatsapp} target="_blank" rel="noopener noreferrer">Enquire About Drone Coverage</a>
              <TransitionLink className={styles.buttonGhost} href="/drone-photography-for-weddings-queensland">Drone for Weddings Guide</TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Aerial perspective</p>
            <h2 className={styles.sectionTitle}>A new dimension for every story.</h2>
          </Reveal>
        </div>
        <div className={styles.benefitsList}>
          {[
            { title: "Wedding aerial coverage", description: "Sweeping views of your outdoor ceremony, venue and surroundings add a cinematic dimension to your wedding story." },
            { title: "Event and brand campaigns", description: "Aerial perspectives for corporate events, activations, large gatherings and brand content." },
            { title: "CASA compliant", description: "All drone operations follow Australian aviation regulations. Permits are handled during planning where required." },
            { title: "Available across Queensland", description: "Drone photography available in Brisbane, Gold Coast, Sunshine Coast, Toowoomba and regional Queensland." },
            { title: "Seamlessly integrated", description: "Drone imagery integrates naturally with your ground-level coverage for a cohesive, cinematic final gallery." },
            { title: "Weather-adapted planning", description: "Conditions are assessed before every session. Backup plans are always in place." },
          ].map((b, i) => (
            <Reveal delay={i * 0.06} key={b.title}>
              <div className={styles.benefitItem}><h3>{b.title}</h3><p>{b.description}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <HowItWorks />
      <FaqSection items={faq} eyebrow="Drone FAQ" title="Questions about drone photography." />

      <section className={styles.sectionTight}>
        <Reveal>
          <div className={styles.areasGrid} style={{ gap: "16px" }}>
            <a className={styles.buttonLight} href={studio.whatsapp} target="_blank" rel="noopener noreferrer">Enquire Now</a>
            <TransitionLink className={styles.buttonGhost} href="/wedding-photography-brisbane">Wedding Photography</TransitionLink>
            <TransitionLink className={styles.buttonGhost} href="/event-photography-brisbane">Event Photography</TransitionLink>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
