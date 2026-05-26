import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import CatalogueGrid from "../../components/admin/CatalogueGrid";
import DashboardActions from "../../components/admin/DashboardActions";
import DashboardNavbar from "../../components/admin/DashboardNavbar";
import StatsCards from "../../components/admin/StatsCards";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [adminEmail, setAdminEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      supabase.auth.getUser(),
      supabase.from("catalogue").select("*").order("model_number", {
        ascending: true,
      }),
    ]).then(([adminResult, catalogueResult]) => {
      if (!isMounted) return;

      const {
        data: { user },
      } = adminResult;

      if (catalogueResult.error) {
        setAdminEmail(user?.email || "");
        setError(catalogueResult.error.message);
        setModels([]);
        setLoading(false);
        return;
      }

      setAdminEmail(user?.email || "");
      setModels(catalogueResult.data || []);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Delete this model from catalogue?");

    if (!shouldDelete) return;

    const { error: deleteError } = await supabase
      .from("catalogue")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setModels((current) => current.filter((model) => model.id !== id));
  };

  const categories = useMemo(() => {
    return [...new Set(models.map((model) => model.category))]
      .filter((category) => category !== null && category !== undefined)
      .sort((a, b) => Number(a) - Number(b));
  }, [models]);

  const filteredModels = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return models.filter((model) => {
      const matchesSearch =
        !search ||
        String(model.name || "")
          .toLowerCase()
          .includes(search) ||
        String(model.model_number || "").includes(search);

      const matchesCategory =
        categoryFilter === "all" ||
        String(model.category) === String(categoryFilter);

      return matchesSearch && matchesCategory;
    });
  }, [models, searchTerm, categoryFilter]);

  const stats = useMemo(() => {
    return {
      totalModels: models.length,
      featuredModels: models.filter((model) => model.featured).length,
      totalStock: models.reduce(
        (total, model) => total + Number(model.stock || 0),
        0
      ),
      categories: categories.length,
    };
  }, [models, categories]);

  return (
    <main className="min-h-screen bg-slate-100">
      <DashboardNavbar adminEmail={adminEmail} onLogout={handleLogout} />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 lg:px-8">
        <StatsCards stats={stats} />

        <DashboardActions
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
          onAddModel={() => navigate("/admin/add-model")}
        />

        {error && (
          <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        {loading ? (
          <section className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
            <p className="text-sm font-medium text-slate-600">
              Loading catalogue...
            </p>
          </section>
        ) : (
          <CatalogueGrid
            products={filteredModels}
            onEdit={(id) => navigate(`/admin/update-model/${id}`)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </main>
  );
}
