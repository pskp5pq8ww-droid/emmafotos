import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { HeroSlideshow } from "@/components/public/HeroSlideshow";
import { ViewProjectButton } from "@/components/public/ViewProjectButton";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Reveal } from "@/components/public/Reveal";
import { AnimatedStat } from "@/components/public/AnimatedStat";
import { HeroParallax } from "@/components/public/HeroParallax";
import { ReviewsMarquee } from "@/components/public/ReviewsMarquee";
import { HowItWorks } from "@/components/public/HowItWorks";
import { FaqSection } from "@/components/public/FaqSection";
import { JsonLd } from "@/components/public/JsonLd";
import { StickyBookCta } from "@/components/public/StickyBookCta";
import styles from "@/components/public/Public.module.css";
import { readDB } from "@/lib/db";
import { projects, services, studio, globalFaq } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Emmanuel Rojas Photographer | Brisbane Wedding, Event & Portrait Photographer",
  description:
    "Brisbane-based photographer and visual storyteller capturing weddings, events, portraits, couple sessions, maternity, personal branding and drone photography across Australia and worldwide.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Emmanuel Rojas Photographer | Brisbane Wedding, Event & Portrait Photographer",
    description:
      "Brisbane-based photographer crafting cinematic weddings, events, portraits and brand stories across Australia and worldwide.",
    url: "/",
  },
};

function fileUrl(filePath?: string) {
  if (!filePath) return undefined;
  return `/api/files/${filePath.split("/").map(encodeURIComponent).join("/")}`;
}

const homepageServices = services.slice(0, 4);
const homepageProjects = projects.slice(0, 3);
// Mobile FAQ shows only the 4 highest-value questions
const mobileFaqItems = globalFaq.slice(0, 4);

export default async function HomePage() {
  const db = await readDB();
  const approvedReviews = db.reviews
    .filter((review) => review.approved && review.allowPublicDisplay)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((review) => {
      if (review.profilePhotoPath) {
        return {
          name: review.clientName,
          rating: review.rating,
          text: review.message,
          imageUrl: fileUrl(review.profilePhotoPath),
        };
      }
      const galleryImage = review.imageId
        ? db.galleryImages.find((image) => image.id === review.imageId)
        : db.galleryImages.find((image) => image.galleryId === review.galleryId);
      return {
        name: review.clientName,
        rating: review.rating,
        text: review.message,
        imageUrl: fileUrl(
          galleryImage?.previewPath ?? galleryImage?.thumbPath ?? galleryImage?.path,
        ),
      };
    });

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: globalFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main>
      <JsonLd data={jsonLdFaq} />

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <HeroSlideshow />
        </div>
        <div className={styles.heroInner}>
          <HeroParallax>
            <Reveal>
              <p className={styles.eyebrow}>
                Brisbane, Australia · Lifelong Memory Maker
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className={styles.heroTitle}>Emmanuel Rojas Photographer</h1>
            </Reveal>
            <Reveal delay={0.16}>
              {/* Desktop: full multi-line copy. Mobile: one tight line via CSS. */}
              <p className={styles.heroCopy}>
                Cinematic photography and visual storytelling for weddings,
                events, portraits and brands — crafted with emotion, elegance
                and intention.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className={styles.heroCtas}>
                <a
                  className={styles.buttonLight}
                  href={studio.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Your Session
                </a>
                {/* Secondary CTAs hidden on mobile — revealed lower in the page */}
                <span className={styles.heroCtasSecondary}>
                  <TransitionLink className={styles.buttonGhost} href="/gallery">
                    View Your Gallery
                  </TransitionLink>
                  <ViewProjectButton className={styles.buttonGhost} />
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.34}>
              <div className={styles.heroStats}>
                <div>
                  <AnimatedStat value={studio.stats.years} />
                  <span>years experience</span>
                </div>
                <div>
                  <AnimatedStat value={studio.stats.events} />
                  <span>events captured</span>
                </div>
                <div>
                  <strong>Brisbane</strong>
                  <span>Worldwide</span>
                </div>
              </div>
            </Reveal>
          </HeroParallax>
        </div>
      </section>

      {/* Sticky book CTA — mobile only, appears after hero scrolls away */}
      <StickyBookCta finalCtaId="homepage-final-cta" />

      {/* ── TRUST STRIP (mobile: tight one-liner after hero) ── */}
      <div className={styles.trustStrip} aria-hidden="true">
        <span>4+ Years Experience</span>
        <span className={styles.trustDot} />
        <span>200+ Events Captured</span>
        <span className={styles.trustDot} />
        <span>Brisbane &amp; Worldwide</span>
      </div>

      {/* ── SERVICES ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Services</p>
            <h2 className={styles.sectionTitle}>
              Images created with rhythm, emotion and intention.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className={styles.sectionCopy}>
              Every session is shaped around the story that deserves to be
              remembered — the feeling, the atmosphere, the connection and the
              details that will live long after the moment has passed.
            </p>
          </Reveal>
        </div>

        {/* Desktop: 4-col grid. Mobile: horizontal scroll carousel. */}
        <div className={styles.servicesGrid}>
          {homepageServices.map((service, index) => (
            <Reveal delay={index * 0.06} key={service.title}>
              <TransitionLink
                href={`/${service.slug}`}
                className={styles.serviceCard}
                style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
              >
                <p className={styles.meta}>{service.kicker}</p>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <span className={styles.servicePrice}>{service.startingAt}</span>
              </TransitionLink>
            </Reveal>
          ))}
        </div>
        {/* Mobile carousel — same cards, touch-scroll, hidden on desktop */}
        <div className={styles.servicesCarousel} aria-hidden="true">
          {homepageServices.map((service) => (
            <TransitionLink
              key={service.title}
              href={`/${service.slug}`}
              className={styles.servicesCarouselCard}
            >
              <p className={styles.meta}>{service.kicker}</p>
              <h3 className={styles.servicesCarouselTitle}>{service.title}</h3>
              <p className={styles.servicesCarouselDesc}>{service.description}</p>
              <span className={styles.servicePrice}>{service.startingAt}</span>
            </TransitionLink>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div style={{ textAlign: "center", marginTop: "clamp(28px, 4vw, 52px)" }}>
            <TransitionLink className={styles.button} href="/services">
              View All Services
            </TransitionLink>
          </div>
        </Reveal>
      </section>

      {/* ── MICRO-CTA (mobile: between services and portfolio) ── */}
      <a
        href={studio.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.microCta}
      >
        <span className={styles.microCtaLabel}>Ready to book?</span>
        <span className={styles.microCtaAction}>Book Your Session →</span>
      </a>

      {/* ── SELECTED WORK ── */}
      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Selected Work</p>
            <h2 className={styles.sectionTitle}>Quiet frames. Lasting pull.</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <TransitionLink className={styles.button} href="/portfolio">
              View Portfolio
            </TransitionLink>
          </Reveal>
        </div>
        <div className={styles.projectGrid}>
          {homepageProjects.map((project, index) => (
            <Reveal delay={index * 0.08} key={project.slug}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorks />

      {/* ── REVIEWS ── */}
      <ReviewsMarquee reviews={approvedReviews} />

      {/* ── FAQ ── */}
      <div
        style={{
          width: "min(100%, 1340px)",
          margin: "0 auto",
          padding: "0 clamp(20px, 6vw, 92px)",
        }}
      >
        {/* Desktop: all 7 questions. Mobile: top 4 via CSS data attribute. */}
        <FaqSection
          items={globalFaq}
          mobileLimit={4}
          eyebrow="FAQ"
          title="Questions people ask before booking."
        />
      </div>

      {/* ── AREAS ── */}
      <section className={styles.sectionTight}>
        <div className={styles.sectionHeader}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Areas I serve</p>
            <h2 className={styles.sectionTitle}>
              Based in Brisbane. Available anywhere.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy}>
              Available for weddings, events, portraits, brand sessions and
              drone photography across Brisbane, Queensland and beyond.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className={styles.areasGrid}>
            {[
              "Brisbane",
              "Gold Coast",
              "Sunshine Coast",
              "Ipswich",
              "Logan",
              "Toowoomba",
              "Byron Bay",
              "Queensland",
              "Australia-wide",
              "Worldwide",
            ].map((area) => (
              <span key={area} className={styles.areaTag}>
                {area}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        id="homepage-final-cta"
        className={`${styles.sectionTight} ${styles.cta}`}
      >
        <div>
          <p className={styles.sectionEyebrow}>Ready to begin?</p>
          <h2 className={styles.sectionTitle}>
            Ready to create your lifelong memories?
          </h2>
        </div>
        <a
          className={styles.buttonLight}
          href={studio.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book Your Session
        </a>
      </section>
    </main>
  );
}
