import React, { useState } from 'react'
import { addProduct } from '../../services/catalogueService'
import { uploadImageToCloudinary } from '../../services/cloudinaryservice'

const initialFormData = {
  model_number: '',
  name: '',
  category: '',
  size: '',
  stock: 0,
  price: '',
  maxorder: '',
  featured: false,
}

export default function AddModel() {
  const [formData, setFormData] = useState(initialFormData)
  const [image, setImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!formData.model_number || !formData.name || !formData.category) {
      setError('Please fill all required fields.')
      return
    }

    if (!image) {
      setError('Please upload a product image.')
      return
    }

    setIsSubmitting(true)

    try {
      const imageUrl = await uploadImageToCloudinary(image)

      if (!imageUrl) {
        setError('Image upload failed. Please try again.')
        return
      }

      const product = {
        model_number: Number(formData.model_number),
        name: formData.name.trim(),
        category: Number(formData.category),
        size: formData.size.trim(),
        image_url: imageUrl,
        stock: Number(formData.stock || 0),
        price: Number(formData.price || 0),
        maxorder: Number(formData.maxorder || 0),
        featured: formData.featured,
      }

      const { error: supabaseError } = await addProduct(product)

      if (supabaseError) {
        setError(supabaseError.message || 'Product could not be saved.')
        return
      }

      console.log(product)
      setMessage('Product added successfully.')
      setFormData(initialFormData)
      setImage(null)
      event.target.reset()
    } catch (submitError) {
      console.error(submitError)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto w-full max-w-2xl rounded-xl bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Add Product</h1>
          <p className="mt-2 text-sm text-slate-500">
            Create a new model entry for the product catalog.
          </p>
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

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Model Number
            </span>
            <input
              type="number"
              name="model_number"
              value={formData.model_number}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Category</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">Select category</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Size</span>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="1ft, 2ft, 3ft"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Image</span>
            <input
              type="file"
              accept="image/*"
              disabled={isSubmitting}
              onChange={(event) => setImage(event.target.files[0] || null)}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Stock</span>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Price</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Max Order</span>
            <input
              type="number"
              name="maxorder"
              value={formData.maxorder}
              onChange={handleChange}
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </label>

          <label className="flex items-center gap-3 pt-7">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              disabled={isSubmitting}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">Featured</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </main>
  )
}
