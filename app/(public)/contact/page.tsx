import type { Metadata } from "next";
import { Reveal } from "@/components/public/Reveal";
import { JsonLd } from "@/components/public/JsonLd";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book your photography session in Brisbane with Emmanuel Rojas. Weddings, events, couples, maternity, personal branding and drone photography across Australia and worldwide.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Book a Session | Emmanuel Rojas Photographer Brisbane",
    description:
      "Get in touch to enquire about availability for wedding, event, portrait, maternity or branding photography in Brisbane and beyond.",
    url: "/contact",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Book a Photography Session — Emmanuel Rojas Photographer",
  url: "https://photographeraustralia.com/contact",
  description:
    "Contact Emmanuel Rojas Photographer to enquire about availability for wedding, event, portrait, maternity or branding photography in Brisbane.",
};

const trustPoints = [
  "Private online gallery delivery",
  "Professional editing and colour grading",
  "Natural direction — no stiff posing",
  "Drone photography available",
  "Brisbane based · Available worldwide",
  "Responds within 24 hours",
];

export default function ContactPage() {
  return (
    <main>
      <JsonLd data={jsonLd} />

      <section className={`${styles.pageHeroWide} ${styles.pageHeroContact}`}>
        <div style={{ maxWidth: "1340px", margin: "0 auto" }}>
          <Reveal>
            <p className={styles.sectionEyebrow}>Contact</p>
            <h1 className={styles.pageTitle}>
              Book your photography session in Brisbane.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className={styles.sectionCopy} style={{ marginTop: "18px", maxWidth: "56ch" }}>
              Tell me about your date, location and the type of story you want
              to capture. I'll get back to you with availability, next steps
              and the best option for your session.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={`${styles.sectionTight} ${styles.contactGrid}`}>
        <Reveal>
          <form className={styles.form} action="/api/contact" method="post">
            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input id="name" name="name" autoComplete="name" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="phone">Phone / WhatsApp — optional</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="0400 000 000"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="type">Type of session</label>
              <select id="type" name="type" defaultValue="Wedding Photography">
                <option>Wedding Photography</option>
                <option>Couple Session</option>
                <option>Event Coverage</option>
                <option>Drone Photography</option>
                <option>Personal Branding</option>
                <option>Maternity Photography</option>
                <option>Portrait Session</option>
                <option>Other</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="date">Date — optional</label>
              <input id="date" name="date" type="text" placeholder="e.g. 15 March 2026" />
            </div>
            <div className={styles.field}>
              <label htmlFor="location">Location</label>
              <input id="location" name="location" type="text" placeholder="e.g. Brisbane, Gold Coast…" />
            </div>
            <div className={styles.field}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows={5} required />
            </div>
            <button className={styles.button} type="submit">
              Send Enquiry
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <aside className={styles.contactAside}>
            <dl>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  <a href={studio.whatsapp} target="_blank" rel="noopener noreferrer">
                    {studio.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Instagram</dt>
                <dd>
                  <a href={studio.instagram} target="_blank" rel="noopener noreferrer">
                    {studio.instagramHandle}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${studio.email}`}>{studio.email}</a>
                </dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>Brisbane, Queensland, Australia</dd>
              </div>
            </dl>

            <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid var(--line)" }}>
              <p className={styles.meta} style={{ marginBottom: "16px" }}>What you can expect</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {trustPoints.map((point) => (
                  <li
                    key={point}
                    style={{
                      color: "var(--muted)",
                      fontSize: "14px",
                      lineHeight: 1.7,
                      paddingBottom: "8px",
                      paddingLeft: "14px",
                      position: "relative",
                    }}
                  >
                    <span style={{ position: "absolute", left: 0, color: "var(--gold)" }}>—</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Reveal>
      </section>
    </main>
  );
}
