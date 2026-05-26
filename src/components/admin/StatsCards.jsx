const statsConfig = [
  { key: "totalModels", label: "Total Models" },
  { key: "featuredModels", label: "Featured Models" },
  { key: "totalStock", label: "Total Stock" },
  { key: "categories", label: "Categories" },
];

export default function StatsCards({ stats }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((item) => (
        <div
          key={item.key}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            {stats[item.key]}
          </p>
        </div>
      ))}
    </section>
  );
}
