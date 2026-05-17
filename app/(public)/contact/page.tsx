import { Reveal } from "@/components/public/Reveal";
import styles from "@/components/public/Public.module.css";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>Contact</p>
          <h1 className={styles.pageTitle}>
            Start with the date, the place and what should be remembered.
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
              <label htmlFor="type">Project Type</label>
              <select id="type" name="type" defaultValue="Wedding">
                <option>Wedding</option>
                <option>Portrait</option>
                <option>Event</option>
                <option>Commercial</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required />
            </div>
            <button className={styles.button} type="submit">
              Send Inquiry
            </button>
          </form>
        </Reveal>
        <Reveal delay={0.1}>
          <aside className={styles.contactAside}>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>hello@emmanuelrojas.studio</dd>
              </div>
              <div>
                <dt>Instagram</dt>
                <dd>@emmanuelrojas.studio</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>Available on request</dd>
              </div>
              <div>
                <dt>Base</dt>
                <dd>Miami, FL · Worldwide</dd>
              </div>
            </dl>
          </aside>
        </Reveal>
      </section>
    </main>
  );
}
