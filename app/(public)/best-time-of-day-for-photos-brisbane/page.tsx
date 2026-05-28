import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Best Time of Day for Photos in Brisbane",
  description:
    "A Brisbane photographer's guide to the best lighting times for outdoor photography — golden hour, blue hour, midday light and seasonal considerations in Queensland.",
  alternates: { canonical: "/best-time-of-day-for-photos-brisbane" },
  openGraph: {
    title: "Best Time of Day for Photos in Brisbane | Emmanuel Rojas Photographer",
    description: "When to shoot for the most beautiful light in Brisbane — golden hour, blue hour, cloudy days and seasonal tips from a local photographer.",
    url: "/best-time-of-day-for-photos-brisbane",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best Time of Day for Photos in Brisbane",
  description: "A guide to the best lighting conditions for outdoor photography in Brisbane, including golden hour, blue hour, midday and seasonal tips.",
  author: { "@type": "Person", name: "Emmanuel Rojas", url: "https://photographeraustralia.com/about" },
  publisher: { "@type": "Organization", name: "Emmanuel Rojas Photographer", url: "https://photographeraustralia.com" },
  url: "https://photographeraustralia.com/best-time-of-day-for-photos-brisbane",
  datePublished: "2025-01-01",
  dateModified: new Date().toISOString().split("T")[0],
};

export default function BestTimeOfDayPhotosBrisbane() {
  return (
    <main>
      <JsonLd data={jsonLd} />
      <section className={styles.articleHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>Guide · Brisbane Photography Lighting</p>
          <h1 className={styles.pageTitle}>Best Time of Day for Photos in Brisbane</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className={styles.sectionCopy} style={{ marginTop: "20px", maxWidth: "64ch" }}>
            Light is the most important ingredient in any photograph. In
            Brisbane's subtropical climate, knowing when to shoot makes the
            difference between ordinary and extraordinary images.
          </p>
        </Reveal>
      </section>

      <section className={styles.articleBody}>
        <Reveal>
          <h2>Golden hour — the single best time for outdoor Brisbane sessions</h2>
          <p>
            Golden hour refers to the period approximately 60–90 minutes before
            sunset. In Brisbane, this light is especially beautiful — warm,
            directional and soft. It flatters skin tones, creates natural depth
            in outdoor scenes and gives images a timeless, cinematic quality.
          </p>
          <p>
            For couple sessions, family portraits, maternity shoots and wedding
            portraits in Brisbane, I always aim to work within this window.
            The light is reliable, the shadows are long and interesting, and
            the overall warmth of the scene is something that cannot be
            replicated at other times of day.
          </p>
          <p>
            In Brisbane, sunset times vary across the year — from around
            5:00 pm in winter (June–July) to 7:00 pm or later in summer
            (December–January). Always plan your session start time around the
            actual sunset for that specific date.
          </p>

          <h2>Blue hour — cinematic and dramatic</h2>
          <p>
            Blue hour occurs in the 20–30 minutes immediately after sunset,
            when the sky holds a deep blue tone and the city lights begin to
            appear. For Brisbane sessions near the river, South Bank or any
            urban setting with reflections, blue hour creates a uniquely
            cinematic, atmospheric look.
          </p>
          <p>
            It is brief — act quickly and move efficiently. I love finishing
            couple sessions at blue hour for the final 10–15 minutes when the
            light transforms completely.
          </p>

          <h2>Sunrise — the underused alternative</h2>
          <p>
            Sunrise provides the same quality of light as golden hour but
            earlier in the day. The advantage in Brisbane is that popular
            locations like Kangaroo Point, New Farm Park and South Bank are
            significantly quieter at sunrise — which means more space, more
            freedom and a calmer, more intimate atmosphere for portraits.
          </p>
          <p>
            In summer, Brisbane sunrise is as early as 4:50 am. In winter it's
            closer to 6:20 am — much more practical for most people.
          </p>

          <h2>Midday and harsh afternoon sun — generally best avoided</h2>
          <p>
            Between approximately 10:00 am and 3:00 pm in Brisbane, the sun
            is high, direct and unflattering for portraits. It creates harsh
            shadows under eyes and noses, causes subjects to squint and
            flattens the overall mood of images.
          </p>
          <p>
            If a session must take place at midday — for schedule or venue
            reasons — I work in deep shade, under tree canopies or in
            open-shade areas where the direct sun is completely blocked. This
            provides even, soft light even at difficult times.
          </p>

          <h2>Overcast and cloudy days — an underappreciated option</h2>
          <p>
            An overcast sky acts as a giant natural softbox — diffusing light
            evenly across the scene without harsh shadows or blown-out
            highlights. For portrait sessions in Brisbane, a lightly overcast
            day can produce beautiful, even and flattering light at almost any
            time of day.
          </p>
          <p>
            The colour palette shifts cooler and softer on overcast days —
            which works especially well for a moodier, more editorial aesthetic.
          </p>

          <h2>Seasonal considerations for Brisbane photography</h2>
          <p>
            <strong>Autumn (April–June)</strong> — arguably the best season
            for outdoor photography in Brisbane. Comfortable temperatures,
            reliable clear skies and warm late-afternoon light.
          </p>
          <p>
            <strong>Winter (July–August)</strong> — cool, dry and consistently
            clear. Earlier sunsets make golden-hour sessions more accessible.
            Perfect for outdoor sessions of any kind.
          </p>
          <p>
            <strong>Spring (September–November)</strong> — warming up quickly.
            Beautiful light but weather becomes more unpredictable with
            afternoon storms developing from October onward.
          </p>
          <p>
            <strong>Summer (December–March)</strong> — hot and humid with
            frequent afternoon thunderstorms. Morning sessions work best.
            The light quality can be extraordinary when storms clear — but
            planning requires flexibility.
          </p>
        </Reveal>

        <div className={styles.articleInternalLinks}>
          <p>Related</p>
          <TransitionLink href="/best-locations-for-couple-photos-brisbane">→ Best Locations for Couple Photos in Brisbane</TransitionLink>
          <TransitionLink href="/couple-photography-brisbane">→ Couple Photography Brisbane</TransitionLink>
          <TransitionLink href="/what-to-wear-for-a-couple-photoshoot">→ What to Wear for a Photoshoot</TransitionLink>
          <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer">→ Book Your Session</a>
        </div>
      </section>
    </main>
  );
}
