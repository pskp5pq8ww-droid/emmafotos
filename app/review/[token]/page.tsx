import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { ReviewForm } from "./ReviewForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leave a review · Emmanuel Rojas",
  description: "Share your experience.",
  robots: { index: false, follow: false },
};

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const db = await readDB();

  const invite = db.reviewInvites.find(
    (inv) => inv.token === token && !inv.usedAt,
  );

  if (!invite) {
    notFound();
  }

  const gallery = invite.galleryId
    ? db.galleries.find((g) => g.id === invite.galleryId)
    : undefined;

  return (
    <ReviewForm
      token={token}
      galleryTitle={gallery?.title}
    />
  );
}
