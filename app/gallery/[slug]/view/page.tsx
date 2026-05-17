import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { readDB } from "@/lib/db";
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
  const gallery = db.galleries.find((item) => item.slug === slug && item.isActive);

  if (!gallery) {
    redirect(`/gallery/${slug}`);
  }

  if (!(await hasGallerySession(slug, gallery.clientId))) {
    redirect(`/gallery/${slug}`);
  }

  const client = db.clients.find((item) => item.id === gallery.clientId);
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
          Emmanuel Rojas Studio
        </Link>
        <div className={styles.toolbar}>
          <a className={styles.ghostButton} href={`/api/gallery/${slug}/download`}>
            Download all
          </a>
        </div>
      </header>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Private Gallery</p>
        <h1 className={styles.title}>{gallery.title}</h1>
        <p className={styles.copy}>
          {client?.name ? `${client.name}, ` : ""}
          your images are ready. Mark favorites with the star, open images in the
          lightbox, or download the originals.
        </p>
      </section>
      <PhotoGrid photos={photos} slug={slug} />
    </main>
  );
}
