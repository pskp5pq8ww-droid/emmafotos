import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { HowItWorks } from "@/components/public/HowItWorks";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { services, studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Wedding photography, couple sessions, event coverage, drone photography, maternity and personal branding photography in Brisbane by Emmanuel Rojas. Natural, cinematic and deeply personal.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Photography Services | Emmanuel Rojas Photographer Brisbane",
    description:
      "Wedding, event, couple, maternity, branding and drone photography in Brisbane by Emmanuel Rojas. Cinematic, natural and intentional.",
    url: "/services",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Photography Services — Emmanuel Rojas Photographer",
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: s.title,
    url: `https://photographeraustralia.com/${s.slug}`,
  })),
};

export default function ServicesPage() {
  return (
    <main>
      <JsonLd data={jsonLd} />

      <section className={`${styles.pageHeroWide} ${styles.pageHeroServices}`}>
        <div style={{ maxWidth: "1340px", margin: "0 auto" }}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Services</p>
            <h1 className={styles.pageTitle}>
              Visual production shaped for the way each story should be kept.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy} style={{ marginTop: "20px", maxWidth: "56ch" }}>
              From weddings to live events, brand sessions to maternity — every
              image is created with emotional honesty, cinematic craft and
              deep attention to the feeling behind the moment.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.sectionTight}>
        <div className={styles.servicesGrid} style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
          {services.map((service, index) => (
            <Reveal delay={index * 0.06} key={service.title}>
              <TransitionLink
                href={`/${service.slug}`}
                className={styles.serviceCard}
                style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
              >
                <p className={styles.meta}>{service.kicker}</p>
                <h2 style={{ margin: "16px 0 18px", fontFamily: "var(--gallery-title)", fontSize: "clamp(28px, 2.4vw, 36px)", fontWeight: 400, lineHeight: 1.08, letterSpacing: "-0.012em" }}>
                  {service.title}
                </h2>
                <p style={{ color: "var(--muted)", lineHeight: 1.78, fontSize: "14px", flex: 1 }}>{service.description}</p>
                <span className={styles.servicePrice}>{service.startingAt}</span>
              </TransitionLink>
            </Reveal>
          ))}
        </div>
      </section>

      <HowItWorks />

      <section className={`${styles.sectionTight} ${styles.cta}`}>
        <div>
          <p className={styles.sectionEyebrow}>Availability</p>
          <h2 className={styles.sectionTitle}>Tell me what you are making.</h2>
        </div>
        <a
          className={styles.buttonLight}
          href={studio.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          Start Enquiry
        </a>
      </section>
    </main>
  );
}
