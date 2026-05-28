import Image from "next/image";
import { redirect } from "next/navigation";
import { readDB } from "@/lib/db";
import { resolveGalleryAccess } from "@/lib/galleries/access";
import { hasGallerySession } from "@/lib/gallery-auth/session";
import styles from "@/components/gallery/Gallery.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

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
  const access = resolveGalleryAccess(db, slug);
  const gallery = access.gallery;
  const client = access.client;

  if (access.state === "ready" && slug !== access.canonicalSlug) {
    redirect(`/gallery/${access.canonicalSlug}`);
  }

  if (
    access.state === "ready" &&
    (await hasGallerySession(access.canonicalSlug, access.client.id))
  ) {
    redirect(`/gallery/${access.canonicalSlug}/view`);
  }

  const unavailableCopy = {
    not_found:
      "Gallery not found. Please check the link or gallery code and try again.",
    not_published:
      "This gallery is not published yet. Please contact Emmanuel Rojas if you believe this is a mistake.",
    client_missing:
      "This gallery is missing client access details. Please contact Emmanuel Rojas if you believe this is a mistake.",
  } as const;

  const pinError =
    error === "locked"
      ? "Too many failed attempts. Please wait 15 minutes and try again."
      : error === "1" || error === "invalid"
        ? "Invalid PIN. Please try again."
        : undefined;

  return (
    <main className={styles.login}>
      <section className={styles.loginPanel}>
        <Image src="/assets/er-logo-black.png" alt="ER" width={86} height={86} priority />
        <p className={styles.eyebrow}>Client Portal</p>
        <h1 className={styles.title}>
          {access.state === "ready" ? "Access your private gallery." : "Gallery not available."}
        </h1>
        {access.state === "ready" ? (
          <>
            <p className={styles.copy}>
              {access.gallery.title} {access.client.name ? `for ${access.client.name}` : ""}.
              Enter your personal PIN to continue.
            </p>
            <form
              action={`/api/gallery/${access.gallery.slug}/auth`}
              className={styles.form}
              method="post"
            >
              {pinError ? <p className={styles.error}>{pinError}</p> : null}
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
            {unavailableCopy[access.state]}
          </p>
        )}
      </section>
      <section className={styles.loginArt}>
        <Image src="/assets/studio-hero.png" alt="" fill sizes="50vw" priority />
      </section>
    </main>
  );
}
