"use client";

import { useMemo, useState } from "react";
import { Book } from "@/lib/api";
import SectionHeader from "./SectionHeader";

type BooksByGenreSectionProps = {
  booksByGenre: Record<string, Book[]>;
};

export default function BooksByGenreSection({ booksByGenre }: BooksByGenreSectionProps) {
  const genres = Object.entries(booksByGenre);
  const [activeGenre, setActiveGenre] = useState<string>("all");

  const filteredGenres = useMemo(() => {
    if (activeGenre === "all") {
      return genres;
    }
    return genres.filter(([genre]) => genre === activeGenre);
  }, [activeGenre, genres]);

  const genreIconMap: Record<string, string> = {
    Fiction: "📖",
    "Science Fiction": "🚀",
    Thriller: "🕵️",
    Classics: "🏛️",
    History: "🕰️",
    "Self-Help": "💡",
    Biography: "👤",
    Poetry: "✒️",
    Fantasy: "🐉",
  };

  return (
    <section className="card books-panel">
      <SectionHeader
        title="Books by Genre"
        subtitle="Explore the shelf by your reading mood."
        variant="books"
      />
      {genres.length === 0 ? (
        <p className="text-sm text-[--books-dark]">Book catalog will be available soon.</p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveGenre("all")}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                activeGenre === "all"
                  ? "border-[--books-dark] bg-[--books-dark] text-[--cream-soft] ring-2 ring-[--books-border] shadow-sm scale-[1.02]"
                  : "border-[--books-border] text-[--books-dark]"
              }`}
            >
              {activeGenre === "all" ? "✓ " : ""}📚 All Genres
            </button>
            {genres.map(([genre]) => (
              <button
                key={genre}
                type="button"
                onClick={() => setActiveGenre(genre)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  activeGenre === genre
                    ? "border-[--books-dark] bg-[--books-dark] text-[--cream-soft] ring-2 ring-[--books-border] shadow-sm scale-[1.02]"
                    : "border-[--books-border] text-[--books-dark]"
                }`}
              >
                {(activeGenre === genre ? "✓ " : "") + (genreIconMap[genre] || "📘") + " " + genre}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredGenres.map(([genre, books]) => (
            <div key={genre} className="rounded-xl border border-[--books-border] bg-[--books-bg] p-4">
              <h3 className="text-lg font-semibold text-[--books-dark]">{genre}</h3>
              <ul className="mt-3 space-y-2">
                {books.map((book) => (
                  <li key={`${genre}-${book.title}`} className="text-sm text-[--books-ink]">
                    <span className="font-semibold">{book.title}</span> by {book.author}{" "}
                    <span className="opacity-70">{book.available ? "(Available)" : "(Checked Out)"}</span>
                  </li>
                ))}
              </ul>
            </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
