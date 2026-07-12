import Link from "next/link";

export default function MorePage() {
  const items = [
    { href: "/why", title: "Why this exists", body: "Pitch page and market framing." },
    { href: "/dashboard", title: "Office dashboard", body: "Health, compliance, and audit signals." },
    { href: "/rules", title: "Rule builder", body: "Control levels and routing logic." },
    { href: "/portal", title: "Homeowner portal", body: "Curated visibility and approvals." },
  ];

  return (
    <section className="space-y-4">
      <div className="field-card rounded-[28px] p-5">
        <p className="text-kicker text-xs text-[var(--teal-400)]">More</p>
        <h2 className="mt-3 text-2xl font-semibold">Demo surfaces</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-2xl border border-white/8 bg-white/3 p-4">
              <div className="text-base font-semibold">{item.title}</div>
              <div className="mt-1 text-sm text-[var(--sand-200)]">{item.body}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
