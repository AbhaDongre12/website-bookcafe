"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CLOSE_HOUR,
  OPEN_HOUR,
  StoredReservation,
  fitsOperatingHours,
  isStartOnFullHour,
  loadReservations,
  maxConcurrentGuests,
  parseBookingBounds,
  peakOccupancyWithNewBooking,
  saveReservations,
  validateEmail,
  validatePhone,
  MAX_CAFE_CAPACITY,
  MAX_SLOT_HOURS,
  MIN_SLOT_HOURS,
} from "@/lib/reservations";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  durationHours: string;
  guests: string;
  occasion: string;
  notes: string;
};

const initialForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  date: "",
  time: "",
  durationHours: "2",
  guests: "2",
  occasion: "Casual Visit",
  notes: "",
};

function formatEndTimeLabel(dateStr: string, timeStr: string, durationHours: number): string {
  const bounds = parseBookingBounds(dateStr, timeStr, durationHours);
  if (!bounds) return "";
  const end = new Date(bounds.endMs);
  return end.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

export default function ReservationPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [stored, setStored] = useState<StoredReservation[]>([]);
  const [confirmation, setConfirmation] = useState<StoredReservation | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ phone?: string; email?: string }>({});
  const [capacityError, setCapacityError] = useState<string | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => setStored(loadReservations()));
  }, []);

  const peakCurrent = useMemo(() => {
    return maxConcurrentGuests(
      stored.map((r) => ({ startMs: r.startMs, endMs: r.endMs, guests: r.guests }))
    );
  }, [stored]);

  const handleDelete = (id: string) => {
    const next = stored.filter((r) => r.reservationId !== id);
    saveReservations(next);
    setStored(next);
    setDeleteTargetId(null);
    if (confirmation?.reservationId === id) {
      setConfirmation(null);
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCapacityError(null);
    setScheduleError(null);

    const phoneOk = validatePhone(form.phone);
    const emailOk = validateEmail(form.email);
    setFieldErrors({
      ...(phoneOk ? {} : { phone: "Enter a valid phone (e.g. 9876543210 or +91 9876543210)." }),
      ...(emailOk ? {} : { email: "Enter a valid email address." }),
    });
    if (!phoneOk || !emailOk) return;

    const durationHours = Number(form.durationHours);
    if (
      !Number.isInteger(durationHours) ||
      durationHours < MIN_SLOT_HOURS ||
      durationHours > MAX_SLOT_HOURS
    ) {
      setScheduleError(`Choose a duration between ${MIN_SLOT_HOURS} and ${MAX_SLOT_HOURS} hours.`);
      return;
    }

    if (!isStartOnFullHour(form.time)) {
      setScheduleError("Start time must be on the hour (slots are hourly).");
      return;
    }

    const bounds = parseBookingBounds(form.date, form.time, durationHours);
    if (!bounds) {
      setScheduleError("Invalid date or time.");
      return;
    }

    if (!fitsOperatingHours(form.date, bounds.startMs, bounds.endMs)) {
      setScheduleError(
        `Reservations must fall within ${OPEN_HOUR}:00 and ${CLOSE_HOUR}:00 on the selected date (max ${MAX_SLOT_HOURS} hours).`
      );
      return;
    }

    const guests = Number(form.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > MAX_CAFE_CAPACITY) {
      setScheduleError(`Guests must be between 1 and ${MAX_CAFE_CAPACITY}.`);
      return;
    }

    const proposed = {
      startMs: bounds.startMs,
      endMs: bounds.endMs,
      guests,
    };

    const peak = peakOccupancyWithNewBooking(stored, proposed);
    if (peak > MAX_CAFE_CAPACITY) {
      setCapacityError(
        `We are truly sorry — the cafe is at full capacity (${MAX_CAFE_CAPACITY} guests) during your requested time. Please choose another slot or fewer guests.`
      );
      return;
    }

    const reservationId = `TPC-${Date.now().toString().slice(-6)}`;
    const record: StoredReservation = {
      reservationId,
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      date: form.date,
      startTime: form.time,
      durationHours,
      guests,
      occasion: form.occasion,
      notes: form.notes.trim(),
      startMs: bounds.startMs,
      endMs: bounds.endMs,
    };

    const next = [...stored, record];
    saveReservations(next);
    setStored(next);
    setConfirmation(record);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[--ink-soft]">Book Cafe</p>
          <h1 className="mt-2 text-3xl font-bold text-[--ink-dark]">Table Reservation</h1>
          <p className="mt-1 text-sm text-[--ink-soft]">
            Max {MAX_CAFE_CAPACITY} guests in the cafe. Slots start each hour; stay up to {MAX_SLOT_HOURS}{" "}
            hours (hourly).
          </p>
        </div>
        <Link href="/" className="text-sm font-semibold text-[--menu-dark] underline underline-offset-4">
          Back to Home
        </Link>
      </header>

      {capacityError && (
        <div
          className="mb-4 rounded-lg border border-[--menu-border] bg-[--menu-bg] px-4 py-3 text-sm text-[--menu-dark]"
          role="alert"
        >
          {capacityError}
        </div>
      )}
      {scheduleError && (
        <div
          className="mb-4 rounded-lg border border-[--books-border] bg-[--books-bg] px-4 py-3 text-sm text-[--books-dark]"
          role="alert"
        >
          {scheduleError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="card space-y-4">
          <h2 className="text-xl font-semibold text-[--ink-dark]">Customer Details</h2>

          <label className="block text-sm text-[--ink-soft]">
            Full Name
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[--border-soft] bg-white px-3 py-2 text-[--ink-dark]"
            />
          </label>

          <label className="block text-sm text-[--ink-soft]">
            Phone
            <input
              required
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => {
                setForm({ ...form, phone: e.target.value });
                if (fieldErrors.phone) setFieldErrors((f) => ({ ...f, phone: undefined }));
              }}
              className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-[--ink-dark] ${
                fieldErrors.phone ? "border-red-600" : "border-[--border-soft]"
              }`}
              placeholder="9876543210 or +91 9876543210"
            />
            {fieldErrors.phone && (
              <span className="mt-1 block text-xs text-red-700">{fieldErrors.phone}</span>
            )}
          </label>

          <label className="block text-sm text-[--ink-soft]">
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
              }}
              className={`mt-1 w-full rounded-lg border bg-white px-3 py-2 text-[--ink-dark] ${
                fieldErrors.email ? "border-red-600" : "border-[--border-soft]"
              }`}
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <span className="mt-1 block text-xs text-red-700">{fieldErrors.email}</span>
            )}
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-[--ink-soft]">
              Date
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[--border-soft] bg-white px-3 py-2 text-[--ink-dark]"
              />
            </label>

            <label className="block text-sm text-[--ink-soft]">
              Start time (hourly)
              <input
                required
                type="time"
                step={3600}
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[--border-soft] bg-white px-3 py-2 text-[--ink-dark]"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-[--ink-soft]">
              Duration (hours)
              <select
                value={form.durationHours}
                onChange={(e) => setForm({ ...form, durationHours: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[--border-soft] bg-white px-3 py-2 text-[--ink-dark]"
              >
                {[1, 2, 3, 4].map((h) => (
                  <option key={h} value={String(h)}>
                    {h} hour{h > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-[--ink-soft]">
              Guests
              <select
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[--border-soft] bg-white px-3 py-2 text-[--ink-dark]"
              >
                {Array.from({ length: MAX_CAFE_CAPACITY }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={String(n)}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-[--ink-soft]">
              Occasion
              <select
                value={form.occasion}
                onChange={(e) => setForm({ ...form, occasion: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[--border-soft] bg-white px-3 py-2 text-[--ink-dark]"
              >
                <option>Casual Visit</option>
                <option>Birthday</option>
                <option>Study Group</option>
                <option>Date</option>
              </select>
            </label>
          </div>

          <label className="block text-sm text-[--ink-soft]">
            Notes
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[--border-soft] bg-white px-3 py-2 text-[--ink-dark]"
              placeholder="Any seating preference or special request"
            />
          </label>

          <button
            type="submit"
            className="rounded-full border border-[--menu-dark] bg-[--menu-dark] px-5 py-2 text-sm font-semibold text-[--cream-soft] transition hover:opacity-90"
          >
            Confirm Reservation
          </button>
        </form>

        <div className="space-y-6">
          <section className="card">
            <h2 className="text-xl font-semibold text-[--ink-dark]">Reservation Details</h2>
            {!confirmation ? (
              <p className="mt-3 text-sm text-[--ink-soft]">
                Fill the form and click Confirm Reservation to see your booking details here.
              </p>
            ) : (
              <div className="mt-4 space-y-2 text-sm text-[--ink-dark]">
                <p className="rounded-lg bg-[--cream-soft] p-3 font-semibold text-[--menu-dark]">
                  Reservation Confirmed — ID: {confirmation.reservationId}
                </p>
                <p>
                  <strong>Name:</strong> {confirmation.fullName}
                </p>
                <p>
                  <strong>Phone:</strong> {confirmation.phone}
                </p>
                <p>
                  <strong>Email:</strong> {confirmation.email}
                </p>
                <p>
                  <strong>Date:</strong> {confirmation.date}
                </p>
                <p>
                  <strong>Time:</strong> {confirmation.startTime} –{" "}
                  {formatEndTimeLabel(
                    confirmation.date,
                    confirmation.startTime,
                    confirmation.durationHours
                  )}{" "}
                  ({confirmation.durationHours} hour{confirmation.durationHours > 1 ? "s" : ""})
                </p>
                <p>
                  <strong>Guests:</strong> {confirmation.guests}
                </p>
                <p>
                  <strong>Occasion:</strong> {confirmation.occasion}
                </p>
                <p>
                  <strong>Notes:</strong> {confirmation.notes || "None"}
                </p>
                <button
                  type="button"
                  onClick={() => setDeleteTargetId(confirmation.reservationId)}
                  className="mt-3 rounded-full border border-red-800 bg-white px-4 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-50"
                >
                  Cancel this reservation
                </button>
              </div>
            )}
          </section>

          <section className="card">
            <h2 className="text-xl font-semibold text-[--ink-dark]">Saved reservations</h2>
            <p className="mt-1 text-xs text-[--ink-soft]">
              Stored on this device. Peak overlap load across saved bookings: {peakCurrent} /{" "}
              {MAX_CAFE_CAPACITY} guests.
            </p>
            {stored.length === 0 ? (
              <p className="mt-3 text-sm text-[--ink-soft]">No reservations yet.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {stored.map((r) => (
                  <li
                    key={r.reservationId}
                    className="rounded-lg border border-[--border-soft] bg-[--cream-soft] p-3 text-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[--ink-dark]">{r.fullName}</p>
                        <p className="text-[--ink-soft]">
                          {r.date} · {r.startTime} ({r.durationHours}h) · {r.guests} guests ·{" "}
                          {r.reservationId}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(r.reservationId)}
                        className="shrink-0 rounded-full border border-red-800 px-3 py-1 text-xs font-semibold text-red-800 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      {deleteTargetId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="max-w-md rounded-xl border border-[--border-soft] bg-white p-6 shadow-lg">
            <h3 id="delete-dialog-title" className="text-lg font-semibold text-[--ink-dark]">
              Cancel reservation?
            </h3>
            <p className="mt-2 text-sm text-[--ink-soft]">
              This removes reservation <strong>{deleteTargetId}</strong> from this browser. This cannot be
              undone here.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="rounded-full border border-[--border-soft] px-4 py-2 text-sm font-semibold text-[--ink-dark]"
              >
                Keep reservation
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteTargetId)}
                className="rounded-full border border-red-800 bg-red-800 px-4 py-2 text-sm font-semibold text-white"
              >
                Yes, cancel it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
