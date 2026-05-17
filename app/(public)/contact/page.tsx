import { Reveal } from "@/components/public/Reveal";
import styles from "@/components/public/Public.module.css";
import { studio } from "@/lib/public-content";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <main>
      <section className={styles.pageHero}>
        <Reveal>
          <p className={styles.sectionEyebrow}>Contacto</p>
          <h1 className={styles.pageTitle}>
            Cuéntame la fecha, el lugar y lo que debe recordarse.
          </h1>
        </Reveal>
      </section>
      <section className={`${styles.sectionTight} ${styles.contactGrid}`}>
        <Reveal>
          <form className={styles.form} action="/api/contact" method="post">
            <div className={styles.field}>
              <label htmlFor="name">Nombre</label>
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
              <label htmlFor="type">Tipo de proyecto</label>
              <select id="type" name="type" defaultValue="Boda">
                <option>Boda</option>
                <option>Sesión de retratos</option>
                <option>Evento</option>
                <option>Video & Drone</option>
                <option>Otro</option>
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="message">Mensaje</label>
              <textarea id="message" name="message" required />
            </div>
            <button className={styles.button} type="submit">
              Enviar consulta
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
                <dt>Base</dt>
                <dd>{studio.location}</dd>
              </div>
            </dl>
          </aside>
        </Reveal>
      </section>
    </main>
  );
}
