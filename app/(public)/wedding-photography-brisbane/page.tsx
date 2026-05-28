import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { HowItWorks } from "@/components/public/HowItWorks";
import { FaqSection } from "@/components/public/FaqSection";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Wedding Photographer Brisbane",
  description:
    "Cinematic and emotional wedding photography in Brisbane by Emmanuel Rojas. Natural, elegant coverage for couples who want timeless memories.",
  alternates: { canonical: "/wedding-photography-brisbane" },
  openGraph: {
    title: "Wedding Photographer Brisbane | Emmanuel Rojas Photographer",
    description:
      "Cinematic and emotional wedding photography in Brisbane by Emmanuel Rojas. Natural direction, honest emotion, private gallery delivery.",
    url: "/wedding-photography-brisbane",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Wedding Photography in Brisbane",
  provider: {
    "@type": "ProfessionalService",
    name: "Emmanuel Rojas Photographer",
    url: "https://photographeraustralia.com",
  },
  areaServed: [
    { "@type": "City", name: "Brisbane" },
    { "@type": "State", name: "Queensland" },
    { "@type": "Country", name: "Australia" },
  ],
  serviceType: "Wedding Photography",
  description:
    "Cinematic and emotional wedding photography in Brisbane by Emmanuel Rojas. Natural, elegant coverage for couples who want timeless memories.",
};

const faq = [
  {
    question: "Do you photograph weddings outside Brisbane?",
    answer:
      "Yes. I'm available for weddings across Brisbane, Gold Coast, Sunshine Coast, Toowoomba, Byron Bay, Queensland-wide and Australia-wide. Travel fees may apply for locations beyond Brisbane.",
  },
  {
    question: "How many hours of coverage do you offer?",
    answer:
      "Coverage is flexible and tailored to your day — from intimate ceremonies through to full-day packages covering preparation, ceremony, portraits and reception. Enquire for a custom quote.",
  },
  {
    question: "When do we receive our wedding gallery?",
    answer:
      "Your private gallery is typically delivered within 4–6 weeks of your wedding day. You'll receive a link to view, download and share all final images.",
  },
  {
    question: "Do you offer drone coverage for weddings?",
    answer:
      "Yes. Aerial drone photography and footage can be added to wedding coverage where the venue and conditions allow. Ask about this when enquiring.",
  },
  {
    question: "What is your style?",
    answer:
      "Natural, cinematic and documentary — focused on genuine emotion, real moments and elegant light. I guide couples gently so portraits feel authentic rather than forced.",
  },
];

const benefits = [
  {
    title: "Natural emotion, captured honestly",
    description:
      "I document your day as it actually unfolds — the laughter, the tears, the quiet in-between moments that make your story yours.",
  },
  {
    title: "Cinematic editing and colour grading",
    description:
      "Every image is carefully edited with a timeless, film-influenced colour palette that feels elegant and consistent.",
  },
  {
    title: "Private gallery delivery",
    description:
      "Your final wedding gallery is delivered through a secure private portal — ready to view, download and share at your own pace.",
  },
  {
    title: "Calm, natural direction",
    description:
      "I guide you through portraits in a relaxed, unhurried way — so you feel comfortable in front of the camera and the images reflect who you are.",
  },
  {
    title: "Available across Queensland",
    description:
      "Based in Brisbane and available for weddings across the Gold Coast, Sunshine Coast, Toowoomba, regional Queensland and Australia-wide.",
  },
  {
    title: "Drone photography available",
    description:
      "Aerial photography and footage can be added to your wedding package where permitted, adding a cinematic perspective to your day.",
  },
];

export default function WeddingPhotographyBrisbane() {
  return (
    <main>
      <JsonLd data={jsonLd} />

      <section className={styles.serviceHero}>
        <div style={{ maxWidth: "1340px", margin: "0 auto" }}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Wedding Photography · Brisbane</p>
            <h1 className={styles.pageTitle}>Wedding Photographer in Brisbane</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy}>
              Your wedding day told with honesty and beauty — from the quiet
              moments to the celebration. Natural, cinematic and deeply personal
              coverage designed to honour every real emotion.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={styles.serviceHeroCtas}>
              <a
                className={styles.buttonLight}
                href={studio.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                Enquire About Your Wedding Date
              </a>
              <TransitionLink className={styles.buttonGhost} href="/portfolio">
                View Wedding Portfolio
              </TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why choose Emmanuel */}
      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Why couples choose Emmanuel</p>
            <h2 className={styles.sectionTitle}>
              Photography that preserves how the day felt.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy}>
              With 4+ years of experience and 200+ events captured, Emmanuel
              Rojas offers Brisbane couples a calm, professional and deeply
              personal approach to wedding photography.
            </p>
          </Reveal>
        </div>
        <div className={styles.benefitsList}>
          {benefits.map((b, i) => (
            <Reveal delay={i * 0.06} key={b.title}>
              <div className={styles.benefitItem}>
                <h3>{b.title}</h3>
                <p>{b.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Areas */}
      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Available across Queensland</p>
            <h2 className={styles.sectionTitle}>Based in Brisbane. Ready to travel.</h2>
          </Reveal>
        </div>
        <Reveal>
          <div className={styles.areasGrid}>
            {["Brisbane", "Gold Coast", "Sunshine Coast", "Ipswich", "Logan", "Toowoomba", "Byron Bay", "Queensland", "Australia-wide"].map((a) => (
              <span key={a} className={styles.areaTag}>{a}</span>
            ))}
          </div>
        </Reveal>
      </section>

      <HowItWorks />
      <FaqSection items={faq} eyebrow="Wedding FAQ" title="Common questions about wedding photography." />

      {/* Internal links */}
      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Explore more</p>
          </Reveal>
        </div>
        <Reveal>
          <div className={styles.areasGrid} style={{ gap: "16px" }}>
            <TransitionLink className={styles.button} href="/contact">Enquire Now</TransitionLink>
            <TransitionLink className={styles.buttonGhost} href="/portfolio">Portfolio</TransitionLink>
            <TransitionLink className={styles.buttonGhost} href="/couple-photography-brisbane">Couple Sessions</TransitionLink>
            <TransitionLink className={styles.buttonGhost} href="/drone-photography-brisbane">Drone Photography</TransitionLink>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
