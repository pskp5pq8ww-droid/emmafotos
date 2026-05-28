import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { HowItWorks } from "@/components/public/HowItWorks";
import { FaqSection } from "@/components/public/FaqSection";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Maternity Photographer Brisbane",
  description:
    "Soft, elegant and emotional maternity photography in Brisbane by Emmanuel Rojas. Natural sessions that preserve the beauty and warmth of expecting.",
  alternates: { canonical: "/maternity-photography-brisbane" },
  openGraph: {
    title: "Maternity Photographer Brisbane | Emmanuel Rojas Photographer",
    description: "Natural and emotional maternity photography in Brisbane. Softness, warmth and timeless memories of one of life's most meaningful seasons.",
    url: "/maternity-photography-brisbane",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Maternity Photography in Brisbane",
  provider: { "@type": "ProfessionalService", name: "Emmanuel Rojas Photographer", url: "https://photographeraustralia.com" },
  areaServed: [{ "@type": "City", name: "Brisbane" }, { "@type": "State", name: "Queensland" }],
  serviceType: "Maternity Photography",
  offers: { "@type": "Offer", price: "350", priceCurrency: "AUD", description: "Starting from $350" },
  description: "Soft, natural and emotional maternity photography in Brisbane. Sessions designed to preserve the beauty, warmth and feeling of expecting.",
};

const faq = [
  { question: "When is the best time to book a maternity session?", answer: "The ideal time is between 28 and 36 weeks, when the bump is beautifully visible but still comfortable. I recommend booking early to secure your preferred date and time of day." },
  { question: "Can my partner and other children be included?", answer: "Absolutely. Partners, siblings and family members are always welcome. Including them often creates the most naturally emotional and memorable images." },
  { question: "Where can maternity sessions be held in Brisbane?", answer: "Sessions work beautifully in natural Brisbane settings — gardens, parks, riverside locations or your own home. Golden hour outdoor sessions are especially popular." },
  { question: "What should I wear for a maternity session?", answer: "Flowy fabrics, soft neutrals and comfortable fitted options all photograph beautifully. I'll send a detailed outfit guide before your session to help you prepare." },
  { question: "How many photos will I receive?", answer: "Standard sessions deliver 50–80+ fully edited images, delivered through your private gallery within 2–3 weeks." },
];

export default function MaternityPhotographyBrisbane() {
  return (
    <main>
      <JsonLd data={jsonLd} />
      <section className={styles.serviceHero}>
        <div style={{ maxWidth: "1340px", margin: "0 auto" }}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Maternity Photography · Brisbane</p>
            <h1 className={styles.pageTitle}>Maternity Photographer in Brisbane</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy}>
              Natural and emotional maternity sessions designed to preserve one
              of the most meaningful seasons of your life with elegance, warmth
              and genuine feeling.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={styles.serviceHeroCtas}>
              <a className={styles.buttonLight} href={studio.whatsapp} target="_blank" rel="noopener noreferrer">Book Your Session — From $350</a>
              <TransitionLink className={styles.buttonGhost} href="/portfolio">View Maternity Work</TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>A season worth preserving</p>
            <h2 className={styles.sectionTitle}>Softness. Warmth. Genuine emotion.</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy}>
              Every maternity session is designed to feel calm, natural and
              unhurried — so you can relax, be present and let the images
              capture how this time truly feels.
            </p>
          </Reveal>
        </div>
        <div className={styles.benefitsList}>
          {[
            { title: "Natural outdoor settings", description: "Brisbane's golden-hour parks, gardens and riverside locations create a warm, timeless backdrop for maternity sessions." },
            { title: "Calm, gentle direction", description: "I guide expecting mothers through every pose and movement gently, ensuring complete comfort throughout the session." },
            { title: "Partners and family welcome", description: "Include your partner, older children or close family — the most emotional images often come from these shared moments." },
            { title: "Timeless editing", description: "Soft, warm colour grading that feels classic and consistent — images you'll love looking back on for years." },
            { title: "Outfit guidance included", description: "A detailed style guide helps you choose outfits that photograph beautifully and reflect your personal taste." },
            { title: "Private gallery delivery", description: "Your edited gallery is delivered within 2–3 weeks through a secure private portal." },
          ].map((b, i) => (
            <Reveal delay={i * 0.06} key={b.title}>
              <div className={styles.benefitItem}><h3>{b.title}</h3><p>{b.description}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <HowItWorks />
      <FaqSection items={faq} eyebrow="Maternity FAQ" title="What to know before your maternity session." />

      <section className={styles.sectionTight}>
        <Reveal>
          <div className={styles.areasGrid} style={{ gap: "16px" }}>
            <a className={styles.buttonLight} href={studio.whatsapp} target="_blank" rel="noopener noreferrer">Book Now — From $350</a>
            <TransitionLink className={styles.buttonGhost} href="/portrait-photography-brisbane">Portrait Sessions</TransitionLink>
            <TransitionLink className={styles.buttonGhost} href="/contact">Contact</TransitionLink>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
