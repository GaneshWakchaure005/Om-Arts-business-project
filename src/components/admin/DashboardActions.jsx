import { Plus, Search } from "lucide-react";

export default function DashboardActions({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  categories,
  onAddModel,
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
        <div className="flex items-center rounded-lg border border-slate-300 px-3 focus-within:border-slate-500 focus-within:ring-2 focus-within:ring-slate-100">
          <Search size={18} className="text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name or model number"
            className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              Category {category}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={onAddModel}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
        >
          <Plus size={16} />
          Add Model
        </button>
      </div>
    </section>
  );
}
