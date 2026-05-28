import type { Metadata } from "next";
import { TransitionLink } from "@/components/public/TransitionLink";
import { Reveal } from "@/components/public/Reveal";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "What to Wear for a Couple Photoshoot",
  description:
    "A photographer's guide to choosing outfits for a couple photoshoot — colours, textures, coordination, comfort and what to avoid for beautiful, timeless images.",
  alternates: { canonical: "/what-to-wear-for-a-couple-photoshoot" },
  openGraph: {
    title: "What to Wear for a Couple Photoshoot | Emmanuel Rojas Photographer",
    description: "Practical styling tips for couple sessions — what colours, textures and combinations photograph best for natural, cinematic images.",
    url: "/what-to-wear-for-a-couple-photoshoot",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What to Wear for a Couple Photoshoot",
  description: "Outfit tips and styling advice for couple photoshoots — colours, textures, coordination and what to avoid.",
  author: { "@type": "Person", name: "Emmanuel Rojas", url: "https://photographeraustralia.com/about" },
  publisher: { "@type": "Organization", name: "Emmanuel Rojas Photographer", url: "https://photographeraustralia.com" },
  url: "https://photographeraustralia.com/what-to-wear-for-a-couple-photoshoot",
  datePublished: "2025-01-01",
  dateModified: new Date().toISOString().split("T")[0],
};

export default function WhatToWearCouple() {
  return (
    <main>
      <JsonLd data={jsonLd} />
      <section className={styles.articleHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>Guide · Couple Photoshoot Styling</p>
          <h1 className={styles.pageTitle}>What to Wear for a Couple Photoshoot</h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className={styles.sectionCopy} style={{ marginTop: "20px", maxWidth: "64ch" }}>
            Outfit choices make a real difference to how your couple photos
            look and feel. Here is a practical guide — from someone who
            photographs couples in Brisbane regularly — on what works
            beautifully and what to leave at home.
          </p>
        </Reveal>
      </section>

      <section className={styles.articleBody}>
        <Reveal>
          <h2>Choose neutral and earthy tones</h2>
          <p>
            Soft neutrals — cream, sand, white, ivory, taupe, warm grey,
            terracotta and sage green — photograph exceptionally well in
            Brisbane's natural light. These tones complement the landscape,
            work beautifully in golden hour and don't distract from your
            connection as a couple.
          </p>
          <p>
            Avoid very bright or saturated colours — neons, electric blues or
            harsh reds — which can overpower the scene and make editing for
            consistency more difficult.
          </p>

          <h2>Coordinate, don't match perfectly</h2>
          <p>
            The most visually appealing couples in photos wear outfits that
            complement each other without being identical. Choose colours in
            the same tonal family — for example, one person in cream and the
            other in warm camel. Or coordinate by texture rather than exact
            colour.
          </p>
          <p>
            Avoid wearing completely different colour families — one in a bright
            pattern and the other in dark navy — as this creates visual
            imbalance in the images.
          </p>

          <h2>Prioritise texture over pattern</h2>
          <p>
            Subtle textures — linen, knit, cotton, silk, suede — photograph
            beautifully and add depth to images without being distracting.
            Bold patterns, logos and text draw the eye away from faces and
            expressions. Opt for solid colours or very subtle prints.
          </p>

          <h2>Avoid distracting logos and graphics</h2>
          <p>
            Large graphic prints, visible brand logos and text across clothing
            almost always look dated quickly and pull attention away from the
            connection between you. Keep your outfits clean and timeless — you
            want to look back at these images in 20 years and still love them.
          </p>

          <h2>Consider Brisbane weather and movement</h2>
          <p>
            Brisbane sessions often happen in warm weather — even in autumn and
            winter. Choose fabrics that breathe and feel comfortable as you move.
            Stiff, formal outfits can make natural movement harder and
            photographs look more awkward.
          </p>
          <p>
            For women, flowy skirts and dresses photograph beautifully in
            movement, especially in a breeze. For men, a well-fitted linen or
            cotton shirt (untucked or lightly tucked) with clean trousers or
            chinos works consistently well.
          </p>

          <h2>Bring an outfit change</h2>
          <p>
            If your session is 90 minutes or longer, bringing a second outfit
            gives your gallery more variety and visual interest. Choose outfits
            that are different enough to create a distinct look — for example,
            one more formal and one more casual — while staying within the
            same colour palette.
          </p>

          <h2>Wear what makes you feel like yourself</h2>
          <p>
            The most important thing is that you feel genuinely comfortable and
            like the best version of yourself. If you're not usually someone
            who wears dresses, don't force one for the session — the discomfort
            will show in the images. Dress for who you are, and the confidence
            will come through naturally.
          </p>

          <h2>Summary — outfit checklist</h2>
          <ul>
            <li>Neutral or earthy tones — cream, sand, taupe, sage, terracotta</li>
            <li>Coordinate colours without matching exactly</li>
            <li>Subtle textures — linen, cotton, knit, silk</li>
            <li>No large logos, graphic prints or bold text</li>
            <li>Comfortable fabrics for warm Brisbane weather</li>
            <li>Clothes you can move, sit and walk naturally in</li>
            <li>Bring a second outfit for longer sessions</li>
            <li>Iron or steam outfits the night before</li>
          </ul>
        </Reveal>

        <div className={styles.articleInternalLinks}>
          <p>Related</p>
          <TransitionLink href="/couple-photography-brisbane">→ Couple Photography in Brisbane</TransitionLink>
          <TransitionLink href="/best-locations-for-couple-photos-brisbane">→ Best Brisbane Locations</TransitionLink>
          <TransitionLink href="/best-time-of-day-for-photos-brisbane">→ Best Time of Day for Photos</TransitionLink>
          <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer">→ Book Your Session</a>
        </div>
      </section>
    </main>
  );
}
