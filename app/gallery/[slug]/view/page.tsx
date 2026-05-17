import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DownloadAllButton } from "@/components/gallery/DownloadAllButton";
import { DownloadPanel } from "@/components/gallery/DownloadPanel";
import { DownloadProvider } from "@/components/gallery/DownloadProvider";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { ReviewForm } from "@/components/gallery/ReviewForm";
import { Reveal } from "@/components/public/Reveal";
import { readDB } from "@/lib/db";
import { resolveGalleryAccess } from "@/lib/galleries/access";
import { hasGallerySession } from "@/lib/gallery-auth/session";
import styles from "@/components/gallery/Gallery.module.css";

export const dynamic = "force-dynamic";

function formatEventDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

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
  const formattedDate = formatEventDate(gallery.eventDate);
  const photos = db.galleryImages
    .filter((image) => image.galleryId === gallery.id)
    .map((image) => ({
      id: image.id,
      filename: image.filename,
      path: image.path,
      thumbPath: image.thumbPath,
      previewPath: image.previewPath,
      originalPath: image.originalPath,
      favorite: db.favorites.some(
        (favorite) => favorite.galleryId === gallery.id && favorite.imageId === image.id,
      ),
    }));

  return (
    <DownloadProvider>
      <main className={styles.shell}>
        <header className={styles.header}>
          <Link className={styles.brand} href="/">
            <Image src="/assets/er-logo-black.png" alt="" width={72} height={72} />
            Emmanuel Rojas
          </Link>
          <div className={styles.toolbar}>
            {photos.length ? (
              <DownloadAllButton
                slug={access.canonicalSlug}
                galleryTitle={gallery.title}
                className={styles.ghostButton}
              />
            ) : null}
          </div>
        </header>

        <section className={styles.galleryHero}>
          <Reveal>
            <p className={styles.galleryEyebrow}>Private Gallery</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className={styles.galleryTitle}>{gallery.title}</h1>
          </Reveal>
          {formattedDate ? (
            <Reveal delay={0.16}>
              <p className={styles.galleryDate}>{formattedDate}</p>
            </Reveal>
          ) : null}
          {client?.name ? (
            <Reveal delay={0.24}>
              <p className={styles.galleryCopy}>
                {client.name}, your images are ready. Mark favourites with the star,
                open photos full screen, or download the originals.
              </p>
            </Reveal>
          ) : null}
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
        <DownloadPanel />
      </main>
    </DownloadProvider>
  );
}
