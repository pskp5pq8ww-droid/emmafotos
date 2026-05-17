import { readDB } from "@/lib/db";
import { updateStudioSettings } from "../actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const db = await readDB();
  const settings = db.settings;

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Configuration</p>
          <h1 className={styles.title}>Settings</h1>
        </div>
      </div>
      <section className={`${styles.panel} ${styles.panelPad}`}>
        <form action={updateStudioSettings} className={styles.form}>
          <div className={styles.twoColumn}>
            <div className={styles.form}>
              <h2 className={styles.panelTitle}>Studio details</h2>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="studioName">
                  Studio name
                </label>
                <input
                  id="studioName"
                  name="studioName"
                  defaultValue={settings?.studioName}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="contactEmail">
                  Contact email
                </label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={settings?.contactEmail}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="instagram">
                  Instagram
                </label>
                <input id="instagram" name="instagram" defaultValue={settings?.instagram} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="phone">
                  Phone
                </label>
                <input id="phone" name="phone" defaultValue={settings?.phone} />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="emailTemplate">
                  Email template
                </label>
                <textarea
                  id="emailTemplate"
                  name="emailTemplate"
                  defaultValue={settings?.emailTemplate}
                />
              </div>
            </div>
            <div className={styles.form}>
              <h2 className={styles.panelTitle}>Admin PIN</h2>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="currentPin">
                  Current PIN
                </label>
                <input id="currentPin" name="currentPin" type="password" />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="nextPin">
                  New PIN
                </label>
                <input id="nextPin" name="nextPin" type="password" />
              </div>
            </div>
          </div>
          <button className={styles.textButton} type="submit">
            Save settings
          </button>
        </form>
      </section>
    </div>
  );
}
