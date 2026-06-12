import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { isInvitationAvailable } from "@/lib/galleries/invitation";
import { InvitationView } from "./InvitationView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Gallery Is Ready · Emmanuel Rojas",
  description: "Your private gallery is ready to download.",
  robots: { index: false, follow: false },
};

export default async function GalleryInvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = await readDB();

  const invitation = db.externalInvitations.find((inv) => inv.slug === slug);

  // Unknown slug → 404. Existing-but-unavailable → friendly notice via `available`.
  if (!invitation) {
    notFound();
  }

  return (
    <InvitationView
      slug={invitation.slug}
      clientName={invitation.clientName}
      title={invitation.title}
      customMessage={invitation.customMessage}
      coverImageUrl={invitation.coverImageUrl}
      available={isInvitationAvailable(invitation)}
    />
  );
}
