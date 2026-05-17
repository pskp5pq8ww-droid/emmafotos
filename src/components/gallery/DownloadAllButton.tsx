"use client";

import { useDownloadQueue } from "./DownloadProvider";

export function DownloadAllButton({
  slug,
  galleryTitle,
  className,
}: {
  slug: string;
  galleryTitle: string;
  className?: string;
}) {
  const { enqueueZip } = useDownloadQueue();
  return (
    <button
      type="button"
      className={className}
      onClick={() => enqueueZip(slug, galleryTitle)}
    >
      Download all
    </button>
  );
}
