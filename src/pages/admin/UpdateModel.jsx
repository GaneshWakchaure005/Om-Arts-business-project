import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Save } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { uploadImageToCloudinary } from "../../services/cloudinaryservice";

const initialFormData = {
  model_number: "",
  name: "",
  category: "",
  size: "",
  stock: 0,
  price: "",
  maxorder: "",
  featured: false,
};

export default function UpdateModel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    supabase
      .from("catalogue")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (!isMounted) return;

        if (fetchError || !data) {
          setError(fetchError?.message || "Model not found.");
          setLoading(false);
          return;
        }

        setFormData({
          model_number: data.model_number || "",
          name: data.name || "",
          category: data.category || "",
          size: data.size || "",
          stock: data.stock || 0,
          price: data.price || "",
          maxorder: data.maxorder || "",
          featured: Boolean(data.featured),
        });
        setCurrentImage(data.image_url || data.image || "");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    return () => {
      if (newImagePreview) {
        URL.revokeObjectURL(newImagePreview);
      }
    };
  }, [newImagePreview]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0] || null;

    setNewImage(file);
    setNewImagePreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!formData.model_number || !formData.name || !formData.category) {
      setError("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = currentImage;

      if (newImage) {
        imageUrl = await uploadImageToCloudinary(newImage);

        if (!imageUrl) {
          setError("Image upload failed. Please try again.");
          return;
        }
      }

      const updatedProduct = {
        model_number: Number(formData.model_number),
        name: formData.name.trim(),
        category: Number(formData.category),
        size: formData.size.trim(),
        image_url: imageUrl,
        stock: Number(formData.stock || 0),
        price: Number(formData.price || 0),
        maxorder: Number(formData.maxorder || 0),
        featured: formData.featured,
      };

      const { error: updateError } = await supabase
        .from("catalogue")
        .update(updatedProduct)
        .eq("id", id);

      if (updateError) {
        setError(updateError.message || "Model could not be updated.");
        return;
      }

      setCurrentImage(imageUrl);
      setNewImage(null);
      setNewImagePreview("");
      setMessage("Model updated successfully.");
      setTimeout(() => navigate("/admin/dashboard"), 700);
    } catch (submitError) {
      console.error(submitError);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-xl bg-white px-8 py-6 text-center shadow-sm">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
          <p className="text-sm font-medium text-slate-600">Loading model...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-4xl rounded-xl bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              to="/admin/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>
            <h1 className="text-2xl font-bold text-slate-950">Update Model</h1>
            <p className="mt-2 text-sm text-slate-500">
              Edit product details and replace the catalogue image.
            </p>
          </div>
        </div>

        {message && (
          <p className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <section className="rounded-xl border border-slate-200 p-4">
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Product Image
            </p>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              {newImagePreview || currentImage ? (
                <img
                  src={newImagePreview || currentImage}
                  alt={formData.name || "Product"}
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center text-slate-400">
                  <ImagePlus size={36} />
                </div>
              )}
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-700">
                Replace Image
              </span>
              <input
                type="file"
                accept="image/*"
                disabled={isSubmitting}
                onChange={handleImageChange}
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
              />
            </label>
          </section>

          <section className="grid gap-5 sm:grid-cols-2">
            <Field label="Model Number">
              <input
                type="number"
                name="model_number"
                value={formData.model_number}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={inputClass}
              />
            </Field>

            <Field label="Name">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={inputClass}
              />
            </Field>

            <Field label="Category">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={inputClass}
              >
                <option value="">Select category</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </Field>

            <Field label="Size">
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="1ft, 2ft, 3ft"
                disabled={isSubmitting}
                className={inputClass}
              />
            </Field>

            <Field label="Stock">
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                disabled={isSubmitting}
                className={inputClass}
              />
            </Field>

            <Field label="Price">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={isSubmitting}
                className={inputClass}
              />
            </Field>

            <Field label="Max Order">
              <input
                type="number"
                name="maxorder"
                value={formData.maxorder}
                onChange={handleChange}
                disabled={isSubmitting}
                className={inputClass}
              />
            </Field>

            <label className="flex items-center gap-3 pt-7">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                disabled={isSubmitting}
                className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-300"
              />
              <span className="text-sm font-medium text-slate-700">
                Featured
              </span>
            </label>
          </section>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          <Save size={16} />
          {isSubmitting ? "Updating Model..." : "Update Model"}
        </button>
      </form>
    </main>
  );
}

const inputClass =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100 disabled:bg-slate-50";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}
