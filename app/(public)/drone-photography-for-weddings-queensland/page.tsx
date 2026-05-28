import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Drone Photography for Weddings in Queensland",
  description:
    "How drone photography can elevate your Queensland wedding — best venues, legal considerations, weather, cinematic uses and what to expect from aerial coverage.",
  alternates: { canonical: "/drone-photography-for-weddings-queensland" },
  openGraph: {
    title: "Drone Photography for Weddings in Queensland | Emmanuel Rojas Photographer",
    description: "A guide to aerial drone photography for Queensland weddings — when it works best, legal considerations and what it adds to your story.",
    url: "/drone-photography-for-weddings-queensland",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Drone Photography for Weddings in Queensland",
  description: "How drone photography adds a cinematic dimension to Queensland weddings — locations, legal considerations and creative uses.",
  author: { "@type": "Person", name: "Emmanuel Rojas", url: "https://photographeraustralia.com/about" },
  publisher: { "@type": "Organization", name: "Emmanuel Rojas Photographer", url: "https://photographeraustralia.com" },
  url: "https://photographeraustralia.com/drone-photography-for-weddings-queensland",
  datePublished: "2025-01-01",
  dateModified: new Date().toISOString().split("T")[0],
};

export default function DronePhotographyWeddingsQueensland() {
  return (
    <main>
      <JsonLd data={jsonLd} />
      <section className={styles.articleHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>Guide · Drone Photography for Weddings</p>
          <h1 className={styles.pageTitle}>Drone Photography for Weddings in Queensland</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className={styles.sectionCopy} style={{ marginTop: "20px", maxWidth: "64ch" }}>
            Queensland is one of the most beautiful places in the world to get
            married — and drone photography captures that at a scale that
            ground-level images simply cannot reach.
          </p>
        </Reveal>
      </section>

      <section className={styles.articleBody}>
        <Reveal>
          <h2>What drone photography adds to a wedding story</h2>
          <p>
            Ground-level photography tells the intimate story of your wedding
            — the expressions, the details, the small moments. Aerial drone
            photography adds the wider perspective — the venue in its
            landscape, the procession from above, the surrounding scenery that
            gives context and scale to the day.
          </p>
          <p>
            In Queensland, where outdoor venues often feature stunning
            coastline, hinterland, vineyard or rural settings, aerial
            photography can transform a wedding gallery. A single wide drone
            shot of a ceremony set against the Hinterland ranges or the
            Sunshine Coast beach creates an image that stands entirely on its own.
          </p>

          <h2>When drone photography works best for weddings</h2>
          <p>
            Drone coverage is most impactful for:
          </p>
          <ul>
            <li>Outdoor ceremonies — especially garden, vineyard, beach or rural settings</li>
            <li>Venues with significant landscape or architectural context</li>
            <li>Aerial portraits of the couple in an open outdoor environment</li>
            <li>Grand entrances, processions or confetti moments from above</li>
            <li>Sunset or golden-hour landscape shots of the venue and surroundings</li>
          </ul>

          <h2>Outdoor venues across Queensland that suit drone coverage</h2>
          <p>
            Some of the Queensland wedding venues and regions where drone
            photography adds most to the story:
          </p>
          <ul>
            <li>Sunshine Coast hinterland venues — Montville, Maleny, Mapleton</li>
            <li>Gold Coast beachfront and hinterland properties</li>
            <li>Brisbane Valley and Scenic Rim rural properties</li>
            <li>Noosa and surrounding coastal areas</li>
            <li>Toowoomba tablelands — especially during flower season</li>
            <li>Hunter Valley and regional properties for destination weddings</li>
          </ul>

          <h2>Legal and safety considerations in Queensland</h2>
          <p>
            In Australia, all recreational and commercial drone operations are
            regulated by CASA (Civil Aviation Safety Authority). As a drone
            operator, I ensure full compliance with all relevant regulations.
            Key considerations include:
          </p>
          <ul>
            <li>Drones must not fly over people without appropriate approval</li>
            <li>Flight within 5.5 km of a controlled aerodrome (airport) requires ATC approval</li>
            <li>National parks and restricted airspace require permits</li>
            <li>Maximum altitude of 120 metres above ground level applies</li>
            <li>Flights must occur during daylight hours and in visual line of sight</li>
          </ul>
          <p>
            All of these requirements are assessed during the planning phase.
            Venues and locations are checked in advance and any required
            permits are arranged before the wedding day.
          </p>

          <h2>Weather and conditions</h2>
          <p>
            Queensland's weather is generally excellent for drone photography —
            especially in autumn and winter when conditions are reliably clear.
            Drones cannot operate safely in high winds (typically above 30 km/h),
            rain, low visibility or electrical storm conditions.
          </p>
          <p>
            Weather conditions are monitored in the days before and on the
            morning of the wedding. If conditions prevent drone operation on
            the day, alternative photography coverage continues as planned
            and any drone fees are handled transparently.
          </p>

          <h2>How to include drone coverage in your wedding package</h2>
          <p>
            Drone photography is available as an add-on to wedding coverage
            in Brisbane and Queensland. When enquiring about your wedding date,
            simply mention that you're interested in drone coverage — I'll
            confirm whether your venue and location are suitable and provide
            a clear quote for the addition.
          </p>
          <p>
            The result is a cohesive wedding gallery that combines intimate
            ground-level storytelling with the wide, cinematic perspective that
            only aerial photography can provide.
          </p>
        </Reveal>

        <div className={styles.articleInternalLinks}>
          <p>Related</p>
          <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer">→ Enquire About Drone Coverage</a>
          <TransitionLink href="/drone-photography-brisbane">→ Drone Photography Brisbane</TransitionLink>
          <TransitionLink href="/wedding-photography-brisbane">→ Wedding Photography Brisbane</TransitionLink>
          <TransitionLink href="/contact">→ Contact</TransitionLink>
        </div>
      </section>
    </main>
  );
}
