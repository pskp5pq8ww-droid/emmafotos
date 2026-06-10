import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Best Locations for Couple Photos in Brisbane",
  description:
    "Discover the best outdoor locations for couple photoshoots in Brisbane — from Kangaroo Point Cliffs to New Farm Park. Tips on timing, light and what makes each spot special.",
  alternates: { canonical: "/best-locations-for-couple-photos-brisbane" },
  openGraph: {
    title: "Best Locations for Couple Photos in Brisbane | Emmanuel Rojas Photographer",
    description: "A local photographer's guide to the best Brisbane spots for couple sessions — golden hour tips, light quality and what to expect at each location.",
    url: "/best-locations-for-couple-photos-brisbane",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best Locations for Couple Photos in Brisbane",
  description: "A guide to the best outdoor locations for couple photoshoots in Brisbane, with tips on timing and light.",
  author: { "@type": "Person", name: "Emmanuel Rojas", url: "https://photographeraustralia.com/about" },
  publisher: { "@type": "Organization", name: "Emmanuel Rojas Photographer", url: "https://photographeraustralia.com" },
  url: "https://photographeraustralia.com/best-locations-for-couple-photos-brisbane",
  datePublished: "2025-01-01",
  dateModified: new Date().toISOString().split("T")[0],
};

const locations = [
  {
    name: "Kangaroo Point Cliffs",
    suburb: "Kangaroo Point",
    bestTime: "Golden hour — 1 hour before sunset",
    lightType: "Warm, directional side light with dramatic cliff backdrop",
    style: "Editorial, cinematic, urban-natural",
    why: "The limestone cliffs and Brisbane River views create an iconic backdrop. The elevated walkway above gives sweeping perspectives. Sunset light reflects warmly off the rock face.",
    tip: "Arrive 15 minutes early to claim the best position on the cliff lookout before golden hour peaks.",
  },
  {
    name: "Brisbane City Botanic Gardens",
    suburb: "CBD",
    bestTime: "Late afternoon or golden hour",
    lightType: "Dappled light through rainforest canopy, open lawns",
    style: "Lush, romantic, natural",
    why: "The tropical gardens offer incredible variety — fern walks, open lawns, fig tree canopies and river views — all within a few minutes of each other.",
    tip: "The bamboo grove and the path near the river wall are especially beautiful in late afternoon light.",
  },
  {
    name: "New Farm Park",
    suburb: "New Farm",
    bestTime: "Morning or golden hour",
    lightType: "Open, soft light through mature Moreton Bay fig trees",
    style: "Soft, romantic, airy",
    why: "The enormous fig trees create natural framing and beautiful dappled light. The rose garden in season adds colour and romance to the setting.",
    tip: "The rotunda area and the fig tree avenue both offer distinct looks — enough variety for a full session without moving venues.",
  },
  {
    name: "South Bank Parklands",
    suburb: "South Bank",
    bestTime: "Blue hour or sunset",
    lightType: "Artificial and natural mixed light, city reflections",
    style: "Urban, vibrant, contemporary",
    why: "South Bank offers city skyline views, the river, the lagoon area and architectural elements. The diversity of backdrops within walking distance is hard to match.",
    tip: "Stay for blue hour when the city lights come on — the river reflections create a magical, cinematic effect.",
  },
  {
    name: "Mount Coot-tha",
    suburb: "Toowong / The Gap",
    bestTime: "Sunrise or sunset for the lookout; anytime for the gardens",
    lightType: "Panoramic natural light at the summit; soft filtered light in the botanic gardens",
    style: "Dramatic, wide landscape, editorial",
    why: "The summit lookout gives the best panoramic view of Brisbane's skyline and surrounding landscape. The botanic gardens below offer shade, tropical planting and quiet paths.",
    tip: "For the lookout, get there 30 minutes before sunset to stake out a position as it gets busy on clear evenings.",
  },
  {
    name: "Roma Street Parkland",
    suburb: "CBD",
    bestTime: "Morning or late afternoon",
    lightType: "Filtered through subtropical planting, intimate scale",
    style: "Lush, intimate, editorial",
    why: "Less well-known than the City Botanic Gardens but equally beautiful — with water features, formal garden beds and a more intimate, quiet feel.",
    tip: "The area near the rose gardens and the stepped amphitheatre both give clean, elegant backdrops.",
  },
  {
    name: "Teneriffe / Newstead",
    suburb: "Inner North",
    bestTime: "Late afternoon or blue hour",
    lightType: "Industrial brick textures, river light",
    style: "Urban, editorial, contemporary",
    why: "The converted warehouses, riverside walkways and urban textures of Teneriffe and Newstead work perfectly for couples who want something less traditional.",
    tip: "The Gasworks area and the woolstore precinct offer a warm, textured industrial feel that photographs beautifully.",
  },
  {
    name: "Shorncliffe Pier",
    suburb: "Shorncliffe",
    bestTime: "Sunset — the pier faces west",
    lightType: "Direct golden sunset light over Bramble Bay",
    style: "Romantic, wide open, sea and sky",
    why: "One of Queensland's longest timber jetties stretching over the bay — the sunset view here is extraordinary and the location feels genuinely cinematic.",
    tip: "This location requires a 25-minute drive north of the city centre. The extra travel is worth it for the right couple and the right evening.",
  },
];

export default function BestLocationsCouplePhotosBrisbane() {
  return (
    <main>
      <JsonLd data={jsonLd} />

      <section className={styles.articleHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>Guide · Brisbane Couple Photography</p>
          <h1 className={styles.pageTitle}>Best Locations for Couple Photos in Brisbane</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className={styles.sectionCopy} style={{ marginTop: "20px", maxWidth: "64ch" }}>
            After photographing couples across Brisbane for years, these are the
            locations I return to again and again — because the light, the
            atmosphere and the variety of backdrops make for genuinely
            beautiful images.
          </p>
        </Reveal>
      </section>

      <section className={styles.articleBody}>
        <Reveal>
          <p>
            Choosing the right location for a couple photoshoot makes an
            enormous difference to the final images. The best spots in Brisbane
            combine beautiful natural light, interesting textures and enough
            variety to create a full gallery without feeling repetitive.
          </p>
          <p>
            As a Brisbane photographer who specialises in couple sessions, I've
            explored most of the city's parks, reserves and riverside areas.
            Below is my honest guide to the locations I recommend most — with
            practical notes on timing, light and what makes each one special.
          </p>
        </Reveal>

        {locations.map((loc, i) => (
          <Reveal key={loc.name} delay={i * 0.04}>
            <div className={styles.locationCard}>
              <h2>{loc.name}</h2>
              <p style={{ fontSize: "13px", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.5, marginBottom: "14px" }}>{loc.suburb}</p>
              <p>{loc.why}</p>
              <div className={styles.locationMeta}>
                <span className={styles.locationMetaTag}>Best time: {loc.bestTime}</span>
                <span className={styles.locationMetaTag}>Light: {loc.lightType}</span>
                <span className={styles.locationMetaTag}>Style: {loc.style}</span>
              </div>
              <p style={{ marginTop: "14px", fontSize: "14px", color: "var(--gold)", fontStyle: "italic" }}>
                <strong>Photographer tip:</strong> {loc.tip}
              </p>
            </div>
          </Reveal>
        ))}

        <Reveal>
          <h2>When to book your Brisbane couple session</h2>
          <p>
            The best time of year in Brisbane for outdoor couple sessions is
            autumn (April–June) and winter (July–August) — cooler temperatures,
            clear skies and the most reliable golden-hour light. Spring can be
            beautiful but weather is more variable. Summer sessions are possible
            but the heat and humidity of Brisbane afternoons make morning
            golden-hour sessions more practical.
          </p>
          <p>
            Regardless of season, I always time sessions around golden hour —
            the 60 minutes before sunset — when the light is softest, warmest
            and most flattering for portraits. It is worth planning your session
            day and location around the sunset time for the best possible results.
          </p>
        </Reveal>

        <div className={styles.articleInternalLinks}>
          <p>Related</p>
          <TransitionLink href="/couple-photography-brisbane">→ Couple Photography in Brisbane</TransitionLink>
          <TransitionLink href="/what-to-wear-for-a-couple-photoshoot">→ What to Wear for a Couple Session</TransitionLink>
          <TransitionLink href="/best-time-of-day-for-photos-brisbane">→ Best Time of Day for Photos in Brisbane</TransitionLink>
          <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer">→ Book Your Session</a>
        </div>
      </section>
    </main>
  );
}
