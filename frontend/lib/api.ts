const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export type CafeProfile = {
  name: string;
  concept: string;
  location: string;
  hours: string;
  contact: string;
  average_rating: number;
};

export type Review = {
  reviewer_name: string;
  rating: number;
  comment: string;
};

export type Book = {
  title: string;
  author: string;
  genre: string;
  available: boolean;
};

export type MenuItem = {
  name: string;
  category: string;
  price: number;
  icon: string;
};

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getCafeProfile() {
  return fetchJson<CafeProfile>("/api/cafe");
}

export async function getReviews() {
  return fetchJson<Review[]>("/api/reviews");
}

export async function getBooksByGenre() {
  return fetchJson<Record<string, Book[]>>("/api/books");
}

export async function getMenuByCategory() {
  return fetchJson<Record<string, MenuItem[]>>("/api/menu");
}
