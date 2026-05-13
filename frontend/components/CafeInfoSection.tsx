import { CafeProfile, Review } from "@/lib/api";
import SectionHeader from "./SectionHeader";

type CafeInfoSectionProps = {
  cafe: CafeProfile | null;
  reviews: Review[];
};

export default function CafeInfoSection({ cafe, reviews }: CafeInfoSectionProps) {
  const info = cafe || {
    name: "The Turning Page Cafe",
    concept: "A cozy corner where books, coffee, and conversations blend together.",
    location: "Maple Street, Pune",
    hours: "8:00 AM - 9:00 PM",
    contact: "+91 98765 43210",
    average_rating: 4.7,
  };

  return (
    <section className="card">
      <SectionHeader
        title="Welcome to The Book Cafe"
        subtitle="Read, relax, and sip in a quiet cream-toned space."
        variant="neutral"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-semibold text-[--ink-dark]">{info.name}</h3>
          <p className="mt-2 text-[--ink-soft]">{info.concept}</p>
          <ul className="mt-4 space-y-1 text-sm text-[--ink-dark]">
            <li>
              <strong>Location:</strong> {info.location}
            </li>
            <li>
              <strong>Hours:</strong> {info.hours}
            </li>
            <li>
              <strong>Contact:</strong> {info.contact}
            </li>
            <li>
              <strong>Rating:</strong> {info.average_rating.toFixed(1)} / 5
            </li>
          </ul>
        </div>
        <div className="rounded-xl border border-[--border-soft] bg-[--cream-soft] p-4">
          <h4 className="font-semibold text-[--ink-dark]">Recent Reviews</h4>
          <div className="mt-3 space-y-3">
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div key={`${review.reviewer_name}-${idx}`} className="text-sm">
                  <p className="font-semibold text-[--ink-dark]">
                    {review.reviewer_name} - {review.rating.toFixed(1)}/5
                  </p>
                  <p className="text-[--ink-soft]">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-[--ink-soft]">Reviews will appear here shortly.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
