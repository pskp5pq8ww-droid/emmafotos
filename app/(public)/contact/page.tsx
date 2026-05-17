import { Reveal } from "@/components/public/Reveal";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Emmanuel Rojas to book your wedding, couple session or event photography in Brisbane, Australia.",
};

export default function ContactPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>Contact</p>
          <h1 className={styles.pageTitle}>
            Tell me the date, the place and what should be remembered.
          </h1>
        </Reveal>
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
              <label htmlFor="type">Project type</label>
              <select id="type" name="type" defaultValue="Wedding">
                <option>Wedding</option>
                <option>Couple Session</option>
                <option>Event</option>
                <option>Drone Photography</option>
                <option>Other</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required />
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
                <dd>{studio.location}</dd>
              </div>
            </dl>
          </aside>
        </Reveal>
      </section>
    </main>
  );
}
