import { ReviewForm } from "./[token]/ReviewForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leave a review · Emmanuel Rojas",
  description: "Share your experience.",
};

export default function GeneralReviewPage() {
  return <ReviewForm token="__general__" />;
}
