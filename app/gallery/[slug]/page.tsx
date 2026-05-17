import Image from "next/image";
import { redirect } from "next/navigation";
import { readDB } from "@/lib/db";
import { hasGallerySession } from "@/lib/gallery-auth/session";
import styles from "@/components/gallery/Gallery.module.css";

export const dynamic = "force-dynamic";

export default async function GalleryLoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const { error } = await searchParams;
  const db = await readDB();
  const gallery = db.galleries.find((item) => item.slug === slug && item.isActive);
  const client = gallery
    ? db.clients.find((item) => item.id === gallery.clientId)
    : undefined;

  if (gallery && client && (await hasGallerySession(slug, client.id))) {
    redirect(`/gallery/${slug}/view`);
  }

  return (
    <main className={styles.login}>
      <section className={styles.loginPanel}>
        <Image src="/assets/er-logo-black.png" alt="ER" width={86} height={86} priority />
        <p className={styles.eyebrow}>Client Portal</p>
        <h1 className={styles.title}>
          {gallery ? "Access your private gallery." : "Gallery unavailable."}
        </h1>
        {gallery ? (
          <>
            <p className={styles.copy}>
              {gallery.title} {client?.name ? `for ${client.name}` : ""}. Enter your
              personal PIN to continue.
            </p>
            <form
              action={`/api/gallery/${gallery.slug}/auth`}
              className={styles.form}
              method="post"
            >
              {error ? <p className={styles.error}>The PIN was not accepted.</p> : null}
              <div className={styles.field}>
                <label htmlFor="pin">PIN</label>
                <input id="pin" name="pin" inputMode="numeric" type="password" required />
              </div>
              <button className={styles.button} type="submit">
                Access gallery
              </button>
            </form>
          </>
        ) : (
          <p className={styles.copy}>
            This gallery is inactive or the link is no longer available.
          </p>
        )}
      </section>
      <section className={styles.loginArt}>
        <Image src="/assets/studio-hero.png" alt="" fill sizes="50vw" priority />
      </section>
    </main>
  );
}
