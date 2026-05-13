export const MAX_CAFE_CAPACITY = 30;
export const MAX_SLOT_HOURS = 4;
export const MIN_SLOT_HOURS = 1;
export const STORAGE_KEY = "bookcafe_reservations";

/** Cafe operating window for bookings (24h). Last seated slot must end by closeHour. */
export const OPEN_HOUR = 8;
export const CLOSE_HOUR = 21;

export type StoredReservation = {
  reservationId: string;
  fullName: string;
  phone: string;
  email: string;
  date: string;
  startTime: string;
  durationHours: number;
  guests: number;
  occasion: string;
  notes: string;
  startMs: number;
  endMs: number;
};

export type BookingInterval = {
  startMs: number;
  endMs: number;
  guests: number;
};

export function parseBookingBounds(
  dateStr: string,
  timeStr: string,
  durationHours: number
): { startMs: number; endMs: number } | null {
  if (!dateStr || !timeStr || durationHours < MIN_SLOT_HOURS || durationHours > MAX_SLOT_HOURS) {
    return null;
  }
  const start = new Date(`${dateStr}T${timeStr}:00`);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  return { startMs: start.getTime(), endMs: end.getTime() };
}

/** Start time must be on the hour (slots increment per hour). */
export function isStartOnFullHour(timeStr: string): boolean {
  const parts = timeStr.split(":");
  if (parts.length < 2) return false;
  const minutes = Number(parts[1]);
  return Number.isInteger(minutes) && minutes === 0;
}

/** Booking must fit fully within OPEN_HOUR..CLOSE_HOUR on `dateStr` (local). */
export function fitsOperatingHours(dateStr: string, startMs: number, endMs: number): boolean {
  const dayStart = new Date(`${dateStr}T${String(OPEN_HOUR).padStart(2, "0")}:00:00`);
  const dayEnd = new Date(`${dateStr}T${String(CLOSE_HOUR).padStart(2, "0")}:00:00`);
  return startMs >= dayStart.getTime() && endMs <= dayEnd.getTime();
}

export function maxConcurrentGuests(intervals: BookingInterval[]): number {
  if (intervals.length === 0) return 0;
  const points = new Set<number>();
  for (const b of intervals) {
    points.add(b.startMs);
    points.add(b.endMs);
  }
  const sorted = [...points].sort((a, b) => a - b);
  let max = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    const segStart = sorted[i];
    const segEnd = sorted[i + 1];
    if (segEnd <= segStart) continue;
    const mid = segStart + (segEnd - segStart) / 2;
    let sum = 0;
    for (const b of intervals) {
      if (b.startMs <= mid && mid < b.endMs) sum += b.guests;
    }
    max = Math.max(max, sum);
  }
  return max;
}

export function peakOccupancyWithNewBooking(
  existing: StoredReservation[],
  proposed: BookingInterval
): number {
  const intervals: BookingInterval[] = existing.map((r) => ({
    startMs: r.startMs,
    endMs: r.endMs,
    guests: r.guests,
  }));
  intervals.push(proposed);
  return maxConcurrentGuests(intervals);
}

export function loadReservations(): StoredReservation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredReservation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReservations(list: StoredReservation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function validatePhone(phone: string): boolean {
  const trimmed = phone.trim();
  // India mobile: optional +91, optional separator, 10 digits starting 6–9
  const india = /^(\+91[\s-]?)?[6-9]\d{9}$/;
  // Fallback: reasonable international E.164-style length
  const generic = /^\+?[1-9]\d{7,14}$/;
  return india.test(trimmed.replace(/\s+/g, "")) || generic.test(trimmed.replace(/\s+/g, ""));
}

export function validateEmail(email: string): boolean {
  const trimmed = email.trim();
  if (trimmed.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(trimmed);
}
