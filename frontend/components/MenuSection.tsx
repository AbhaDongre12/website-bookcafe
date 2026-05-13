"use client";

import { useMemo, useState } from "react";
import { MenuItem } from "@/lib/api";
import SectionHeader from "./SectionHeader";

type MenuSectionProps = {
  menuByCategory: Record<string, MenuItem[]>;
};

const iconMap: Record<string, string> = {
  coffee: "☕",
  cup: "🍵",
  glass: "🥤",
  sandwich: "🥪",
  cake: "🍰",
};

export default function MenuSection({ menuByCategory }: MenuSectionProps) {
  const categories = Object.entries(menuByCategory);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredCategories = useMemo(() => {
    if (activeCategory === "all") {
      return categories;
    }
    return categories.filter(([category]) => category === activeCategory);
  }, [activeCategory, categories]);

  return (
    <section className="card menu-panel">
      <SectionHeader
        title="Cafe Menu"
        subtitle="Freshly brewed and baked all day."
        variant="menu"
      />
      {categories.length === 0 ? (
        <p className="text-sm text-[--menu-dark]">Menu details will appear here shortly.</p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                activeCategory === "all"
                  ? "border-[--menu-dark] bg-[--menu-dark] text-[--cream-soft] ring-2 ring-[--menu-border] shadow-sm scale-[1.02]"
                  : "border-[--menu-border] text-[--menu-dark]"
              }`}
            >
              {activeCategory === "all" ? "✓ " : ""}🍽️ All Menu
            </button>
            {categories.map(([category, items]) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  activeCategory === category
                    ? "border-[--menu-dark] bg-[--menu-dark] text-[--cream-soft] ring-2 ring-[--menu-border] shadow-sm scale-[1.02]"
                    : "border-[--menu-border] text-[--menu-dark]"
                }`}
              >
                {(activeCategory === category ? "✓ " : "") + (iconMap[items[0]?.icon] || "🥣") + " " + category}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCategories.map(([category, items]) => (
            <div key={category} className="rounded-xl border border-[--menu-border] bg-[--menu-bg] p-4">
              <h3 className="text-lg font-semibold text-[--menu-dark]">{category}</h3>
              <ul className="mt-3 space-y-2">
                {items.map((item) => (
                  <li key={`${category}-${item.name}`} className="flex items-center justify-between gap-3 text-sm text-[--menu-ink]">
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden>{iconMap[item.icon] || "•"}</span>
                      <span className="font-semibold">{item.name}</span>
                    </span>
                    <span>Rs. {item.price.toFixed(0)}</span>
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
