import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { UploadDropzone } from "@/components/admin/UploadDropzone";
import { readDB } from "@/lib/db";
import {
  deleteGallery,
  deleteGalleryImage,
  toggleGalleryActive,
  updateGallery,
} from "../../actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

function fileUrl(filePath: string) {
  return `/api/files/${filePath.split("/").map(encodeURIComponent).join("/")}`;
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await readDB();
  const gallery = db.galleries.find((item) => item.id === id);

  if (!gallery) {
    notFound();
  }

  const client = db.clients.find((item) => item.id === gallery.clientId);
  const images = db.galleryImages.filter((image) => image.galleryId === gallery.id);

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Gallery</p>
          <h1 className={styles.title}>{gallery.title}</h1>
          <p className={styles.muted}>
            {client?.name ?? "Unknown"} · {gallery.eventDate || "No date"} · /gallery/
            {gallery.slug}
          </p>
        </div>
        <div className={styles.inlineActions}>
          <CopyLinkButton href={`/gallery/${gallery.slug}`} />
          <form action={toggleGalleryActive}>
            <input name="id" type="hidden" value={gallery.id} />
            <button className={styles.ghostButton} type="submit">
              {gallery.isActive ? "Disable" : "Activate"}
            </button>
          </form>
          <form action={deleteGallery}>
            <input name="id" type="hidden" value={gallery.id} />
            <ConfirmSubmitButton
              className={styles.dangerButton}
              message="Delete this gallery and all uploaded photos?"
              type="submit"
            >
              Delete gallery
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      <section className={styles.twoColumn}>
        <div className={styles.panel}>
          <div className={styles.panelPad}>
            <h2 className={styles.panelTitle}>Photos</h2>
            <UploadDropzone galleryId={gallery.id} galleryTitle={gallery.title} />
          </div>
          <div className={`${styles.panelPad} ${styles.imageGrid}`}>
            {images.map((image) => (
              <article className={styles.imageCard} key={image.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fileUrl(image.previewPath ?? image.thumbPath ?? image.path)}
                  alt={image.filename}
                  loading="lazy"
                  decoding="async"
                />
                <div className={styles.imageCardFooter}>
                  <span className={styles.muted}>{image.filename}</span>
                  <div className={styles.inlineActions}>
                    <Link
                      className={styles.ghostButton}
                      href={fileUrl(image.originalPath ?? image.path)}
                    >
                      Open
                    </Link>
                    <Link
                      className={styles.ghostButton}
                      href={`${fileUrl(image.originalPath ?? image.path)}?download=1`}
                    >
                      Download
                    </Link>
                    <form action={deleteGalleryImage}>
                      <input name="galleryId" type="hidden" value={gallery.id} />
                      <input name="imageId" type="hidden" value={image.id} />
                      <ConfirmSubmitButton
                        className={styles.dangerButton}
                        message="Delete this photo?"
                        type="submit"
                      >
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </div>
              </article>
            ))}
            {!images.length ? <p className={styles.muted}>No photos uploaded yet.</p> : null}
          </div>
        </div>

        <aside className={`${styles.panel} ${styles.panelPad} ${styles.sticky}`}>
          <h2 className={styles.panelTitle}>Edit gallery</h2>
          <form action={updateGallery} className={styles.form}>
            <input name="id" type="hidden" value={gallery.id} />
            <div className={styles.field}>
              <label className={styles.label} htmlFor="title">
                Title
              </label>
              <input id="title" name="title" defaultValue={gallery.title} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="eventDate">
                Event date
              </label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                defaultValue={gallery.eventDate}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={gallery.description}
              />
            </div>
            <button className={styles.textButton} type="submit">
              Save changes
            </button>
          </form>
        </aside>
      </section>
    </div>
  );
}
