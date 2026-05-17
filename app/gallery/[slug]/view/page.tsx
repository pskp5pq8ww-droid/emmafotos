import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { ReviewForm } from "@/components/gallery/ReviewForm";
import { readDB } from "@/lib/db";
import { resolveGalleryAccess } from "@/lib/galleries/access";
import { hasGallerySession } from "@/lib/gallery-auth/session";
import styles from "@/components/gallery/Gallery.module.css";

export const dynamic = "force-dynamic";

export default async function GalleryViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = await readDB();
  const access = resolveGalleryAccess(db, slug);

  if (access.state !== "ready") {
    redirect(`/gallery/${slug}`);
  }

  if (slug !== access.canonicalSlug) {
    redirect(`/gallery/${access.canonicalSlug}/view`);
  }

  if (!(await hasGallerySession(access.canonicalSlug, access.gallery.clientId))) {
    redirect(`/gallery/${access.canonicalSlug}`);
  }

  const gallery = access.gallery;
  const client = access.client;
  const photos = db.galleryImages
    .filter((image) => image.galleryId === gallery.id)
    .map((image) => ({
      id: image.id,
      filename: image.filename,
      path: image.path,
      thumbPath: image.thumbPath,
      favorite: db.favorites.some(
        (favorite) => favorite.galleryId === gallery.id && favorite.imageId === image.id,
      ),
    }));

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <Image src="/assets/er-logo-black.png" alt="" width={72} height={72} />
          Emmanuel Rojas
        </Link>
        <div className={styles.toolbar}>
          {photos.length ? (
            <a className={styles.ghostButton} href={`/api/gallery/${access.canonicalSlug}/download`}>
              Download all
            </a>
          ) : null}
        </div>
      </header>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Private gallery</p>
        <h1 className={styles.title}>{gallery.title}</h1>
        <p className={styles.copy}>
          {client?.name ? `${client.name}, ` : ""}
          your images are ready. Mark favourites with the star, open images full screen, or download the originals.
        </p>
      </section>
      {photos.length ? (
        <PhotoGrid photos={photos} slug={access.canonicalSlug} />
      ) : (
        <section className={styles.emptyState}>
          <p className={styles.eyebrow}>Gallery is being prepared</p>
          <h2>This gallery has no images yet.</h2>
          <p>
            Please contact Emmanuel Rojas if you believe this is a mistake.
          </p>
        </section>
      )}
      <ReviewForm defaultName={client.name} slug={access.canonicalSlug} />
    </main>
  );
}
