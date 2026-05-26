import { Edit, Trash2 } from "lucide-react";

export default function CatalogueGrid({ products, onEdit, onDelete }) {
  if (!products.length) {
    return (
      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          No models found
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Add a model or adjust your search and category filter.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => {
        const imageSrc = product.image_url || product.image;

        return (
          <article
            key={product.id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex gap-4 p-4">
              <img
                src={imageSrc}
                alt={product.name}
                className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Model No: {product.model_number}
                    </p>
                    <h2 className="mt-1 truncate text-base font-semibold text-slate-950">
                      {product.name}
                    </h2>
                  </div>
                  {product.featured && (
                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                      Featured
                    </span>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <Info label="Size" value={product.size || "-"} />
                  <Info label="Price" value={`Rs. ${product.price || 0}`} />
                  <Info label="Stock" value={product.stock || 0} />
                </div>
              </div>
            </div>

            <div className="flex border-t border-slate-100">
              <button
                type="button"
                onClick={() => onEdit(product.id)}
                className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                <Edit size={15} />
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(product.id)}
                className="flex flex-1 items-center justify-center gap-2 border-l border-slate-100 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-medium text-slate-800">{value}</p>
    </div>
  );
}
