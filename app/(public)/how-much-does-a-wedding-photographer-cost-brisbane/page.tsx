import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "How Much Does a Wedding Photographer Cost in Brisbane?",
  description:
    "A transparent guide to wedding photography pricing in Brisbane — what affects cost, what's typically included, and how to choose the right photographer for your day.",
  alternates: { canonical: "/how-much-does-a-wedding-photographer-cost-brisbane" },
  openGraph: {
    title: "How Much Does a Wedding Photographer Cost in Brisbane? | Emmanuel Rojas Photographer",
    description: "What affects wedding photography pricing in Brisbane — hours, editing, experience, drone, travel and what to look for.",
    url: "/how-much-does-a-wedding-photographer-cost-brisbane",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Much Does a Wedding Photographer Cost in Brisbane?",
  description: "A guide to wedding photography pricing in Brisbane — what affects the cost and what to expect at different price points.",
  author: { "@type": "Person", name: "Emmanuel Rojas", url: "https://photographeraustralia.com/about" },
  publisher: { "@type": "Organization", name: "Emmanuel Rojas Photographer", url: "https://photographeraustralia.com" },
  url: "https://photographeraustralia.com/how-much-does-a-wedding-photographer-cost-brisbane",
  datePublished: "2025-01-01",
  dateModified: new Date().toISOString().split("T")[0],
};

export default function WeddingPhotographerCostBrisbane() {
  return (
    <main>
      <JsonLd data={jsonLd} />
      <section className={styles.articleHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>Guide · Wedding Photography Brisbane</p>
          <h1 className={styles.pageTitle}>How Much Does a Wedding Photographer Cost in Brisbane?</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className={styles.sectionCopy} style={{ marginTop: "20px", maxWidth: "64ch" }}>
            A transparent look at what affects wedding photography pricing in
            Brisbane — and how to choose the right photographer for your day,
            your style and your budget.
          </p>
        </Reveal>
      </section>

      <section className={styles.articleBody}>
        <Reveal>
          <p>
            Wedding photography pricing in Brisbane varies significantly — from
            around $1,500 for a budget option to $5,000 or more for highly
            experienced photographers with a strong published portfolio. The
            difference in price reflects differences in experience, style,
            editing quality, coverage time and the full service delivered.
          </p>
          <p>
            Understanding what affects the cost makes it easier to compare
            photographers honestly and make the right choice for your wedding day.
          </p>

          <h2>Factors that affect wedding photography pricing</h2>

          <h3>Hours of coverage</h3>
          <p>
            Most wedding photography packages are structured around hours of
            coverage. A short ceremony-only package (3–4 hours) will cost less
            than full-day coverage (8–10+ hours) that includes getting ready,
            the ceremony, portraits, reception and final celebrations. More
            hours means more images, more moments captured and a more complete
            story of the day.
          </p>

          <h3>Experience and published work</h3>
          <p>
            A photographer with 4+ years of experience and a strong published
            portfolio has developed reliable skills in difficult lighting
            conditions, fast-moving ceremonies and emotional moments. Less
            experienced photographers may charge less but carry more risk on a
            day that cannot be repeated.
          </p>

          <h3>Editing and post-production</h3>
          <p>
            The quality of editing — colour grading, skin tones, consistency
            and attention to detail — takes significant time after the wedding
            day. High-quality editing is part of what makes images feel timeless
            and professional rather than flat or inconsistent.
          </p>

          <h3>Private gallery delivery</h3>
          <p>
            A dedicated private online gallery where you can download
            high-resolution images, share with family and store your memories
            is a standard part of a professional package. Budget options may
            offer a basic file transfer without a dedicated viewing experience.
          </p>

          <h3>Drone photography</h3>
          <p>
            Aerial drone coverage — for outdoor venues, ceremony grounds and
            sweeping landscape shots — adds a cinematic dimension and is
            typically offered as an add-on to a base package. It requires
            additional equipment, preparation and CASA compliance.
          </p>

          <h3>Travel and destination weddings</h3>
          <p>
            For weddings outside Brisbane — Gold Coast, Sunshine Coast,
            regional Queensland, interstate or international — travel costs are
            factored into the quote. Based in Brisbane, travel to nearby regions
            is straightforward, with larger distances quoted individually.
          </p>

          <h2>What should be included in any professional package</h2>
          <ul>
            <li>A pre-wedding consultation to plan the day and timeline</li>
            <li>Full editing of all delivered images to a consistent standard</li>
            <li>Private online gallery with download rights</li>
            <li>Commercial use rights for printing and sharing</li>
            <li>Clear communication before, during and after the day</li>
            <li>Backup equipment — cameras and memory cards</li>
          </ul>

          <h2>How to compare Brisbane wedding photographers</h2>
          <p>
            The most important factor is not price — it's whether the
            photographer's style, approach and energy is right for your wedding.
            Look at complete galleries rather than highlight shots, read client
            reviews and have a conversation before committing. The photographer
            you choose will spend your entire day with you. That relationship
            matters as much as the images.
          </p>
          <p>
            I offer transparent, flexible pricing for Brisbane weddings with a
            focus on natural light, cinematic colour and genuine emotional
            storytelling. Enquire to receive a detailed quote tailored to your
            date and coverage needs.
          </p>
        </Reveal>

        <div className={styles.articleInternalLinks}>
          <p>Book or enquire</p>
          <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer">→ Enquire About Your Wedding Date</a>
          <TransitionLink href="/wedding-photography-brisbane">→ Wedding Photography Brisbane</TransitionLink>
          <TransitionLink href="/drone-photography-brisbane">→ Drone Photography Add-on</TransitionLink>
          <TransitionLink href="/contact">→ Contact</TransitionLink>
        </div>
      </section>
    </main>
  );
}
