import BooksByGenreSection from "@/components/BooksByGenreSection";
import CafeInfoSection from "@/components/CafeInfoSection";
import MenuSection from "@/components/MenuSection";
import { getBooksByGenre, getCafeProfile, getMenuByCategory, getReviews } from "@/lib/api";
import Link from "next/link";

export default async function Home() {
  const [cafe, reviews, booksByGenre, menuByCategory] = await Promise.all([
    getCafeProfile(),
    getReviews(),
    getBooksByGenre(),
    getMenuByCategory(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
      <header className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[--ink-soft]">Book Cafe</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[--ink-dark]">The Turning Page</h1>
            <p className="mt-2 max-w-2xl text-[--ink-soft]">
              A warm neighborhood cafe where every cup comes with a story.
            </p>
          </div>
          <Link
            href="/reservation"
            className="rounded-full border border-[--menu-dark] bg-[--menu-dark] px-5 py-2 text-sm font-semibold text-[--cream-soft] transition hover:opacity-90"
          >
            Reserve a Table
          </Link>
        </div>
      </header>
      <main className="space-y-8">
        <CafeInfoSection cafe={cafe} reviews={reviews || []} />
        <BooksByGenreSection booksByGenre={booksByGenre || {}} />
        <MenuSection menuByCategory={menuByCategory || {}} />
      </main>
    </div>
  );
}
