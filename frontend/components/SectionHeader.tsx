type SectionHeaderProps = {
  title: string;
  subtitle: string;
  variant: "neutral" | "books" | "menu";
};

export default function SectionHeader({ title, subtitle, variant }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className={`text-2xl font-bold ${variant === "books" ? "text-[--books-dark]" : variant === "menu" ? "text-[--menu-dark]" : "text-[--ink-dark]"}`}>
        {title}
      </h2>
      <p className="mt-1 text-sm text-[--ink-soft]">{subtitle}</p>
    </div>
  );
}
