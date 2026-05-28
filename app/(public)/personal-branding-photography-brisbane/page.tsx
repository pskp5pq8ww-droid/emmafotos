import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { HowItWorks } from "@/components/public/HowItWorks";
import { FaqSection } from "@/components/public/FaqSection";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Personal Branding Photographer Brisbane",
  description:
    "Editorial personal branding photography in Brisbane for creatives, entrepreneurs and professionals by Emmanuel Rojas. From $450.",
  alternates: { canonical: "/personal-branding-photography-brisbane" },
  openGraph: {
    title: "Personal Branding Photographer Brisbane | Emmanuel Rojas Photographer",
    description: "Editorial branding sessions in Brisbane for entrepreneurs, creatives and brands. Clarity, confidence and intentional imagery.",
    url: "/personal-branding-photography-brisbane",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Personal Branding Photography in Brisbane",
  provider: { "@type": "ProfessionalService", name: "Emmanuel Rojas Photographer", url: "https://photographeraustralia.com" },
  areaServed: [{ "@type": "City", name: "Brisbane" }],
  serviceType: "Personal Branding Photography",
  offers: { "@type": "Offer", price: "450", priceCurrency: "AUD", description: "Starting from $450" },
  description: "Editorial personal branding photography in Brisbane for entrepreneurs, creatives and professionals.",
};

const faq = [
  { question: "Who is personal branding photography for?", answer: "Entrepreneurs, business owners, coaches, creatives, freelancers, artists and anyone who wants professional imagery that communicates who they are and what they do." },
  { question: "Where are branding sessions held?", answer: "Sessions can be held at your workspace, a studio, an outdoor Brisbane location or a venue that reflects your brand. I'll help choose a setting that tells your story authentically." },
  { question: "What images will I receive?", answer: "A variety of portrait styles, working shots, environmental images and detail images — delivered as a cohesive set ready for your website, social media, LinkedIn and press materials." },
  { question: "How should I prepare for a branding session?", answer: "I'll send a pre-session guide covering outfit choices, location scouting and what to bring. Preparation makes a significant difference to the quality and variety of your final images." },
  { question: "Can I use the images for social media and marketing?", answer: "Yes. All images are licensed for commercial use including social media, websites, print and digital marketing materials." },
];

export default function PersonalBrandingPhotographyBrisbane() {
  return (
    <main>
      <JsonLd data={jsonLd} />
      <section className={styles.serviceHero}>
        <div style={{ maxWidth: "1340px", margin: "0 auto" }}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Personal Branding Photography · Brisbane</p>
            <h1 className={styles.pageTitle}>Personal Branding Photographer in Brisbane</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy}>
              Editorial-style imagery for entrepreneurs, creatives and brands
              who want to present themselves with clarity, confidence and
              intention. From $450.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={styles.serviceHeroCtas}>
              <a className={styles.buttonLight} href={studio.whatsapp} target="_blank" rel="noopener noreferrer">Book a Branding Session</a>
              <TransitionLink className={styles.buttonGhost} href="/portfolio">View Branding Work</TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>What's included</p>
            <h2 className={styles.sectionTitle}>Your identity. Told with intention.</h2>
          </Reveal>
        </div>
        <div className={styles.benefitsList}>
          {[
            { title: "Pre-session planning", description: "A discovery call to understand your brand, audience and goals — so every image is purposeful." },
            { title: "Editorial portrait style", description: "Clean, confident and expressive imagery that communicates presence and professional identity." },
            { title: "Multiple setups and looks", description: "We cover different environments, outfits and expressions to give you a complete and versatile image library." },
            { title: "Colour grading for brand consistency", description: "A cohesive colour palette and editing style across every image in your set." },
            { title: "Commercial use licence", description: "Full rights to use your images across your website, social media, press, print and digital marketing." },
            { title: "Private gallery delivery", description: "Your edited images are delivered within 2 weeks through a private portal — ready to use immediately." },
          ].map((b, i) => (
            <Reveal delay={i * 0.06} key={b.title}>
              <div className={styles.benefitItem}><h3>{b.title}</h3><p>{b.description}</p></div>
            </Reveal>
          ))}
        </div>
      </section>

      <HowItWorks />
      <FaqSection items={faq} eyebrow="Branding FAQ" title="Questions about personal branding photography." />

      <section className={styles.sectionTight}>
        <Reveal>
          <div className={styles.areasGrid} style={{ gap: "16px" }}>
            <a className={styles.buttonLight} href={studio.whatsapp} target="_blank" rel="noopener noreferrer">Book Now — From $450</a>
            <TransitionLink className={styles.buttonGhost} href="/portrait-photography-brisbane">Portrait Sessions</TransitionLink>
            <TransitionLink className={styles.buttonGhost} href="/contact">Contact</TransitionLink>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
