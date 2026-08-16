"use client";

export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

export default function RequestPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    categoryId: "",
    notification: "",
    model: "",
    serialNumber: "",
    symptom: "",
    actions: "",
    changedParts: "",
    sender: "",
    requestBy: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!formData.categoryId || !formData.notification || !formData.symptom || !formData.actions || !formData.sender || !formData.requestBy) {
      setError("Please fill in all required fields");
      return;
    }

    if (!window.confirm("Kirim Request ke TC?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit request");
      }

      alert("Request submitted successfully!");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to Jobs
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Submit Job Request</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Kategori *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                No LR (Nomer Laporan Reparasi) *
              </label>
              <input
                type="text"
                name="notification"
                value={formData.notification}
                onChange={handleChange}
                placeholder="Nomer Laporan Reparasi"
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Model Unit
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Model"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nomer Seri
              </label>
              <input
                type="text"
                name="serialNumber"
                value={formData.serialNumber}
                onChange={handleChange}
                placeholder="SN"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Deskripsi (Keluhan/Kerusakan) *
              </label>
              <textarea
                name="symptom"
                value={formData.symptom}
                onChange={handleChange}
                placeholder="Tuliskan detail keluhan / kerusakan"
                required
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Tindakan *
              </label>
              <textarea
                name="actions"
                value={formData.actions}
                onChange={handleChange}
                placeholder="Tuliskan tindakan apa yang sudah dilakukan"
                required
                rows={4}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Part yang di ganti
              </label>
              <textarea
                name="changedParts"
                value={formData.changedParts}
                onChange={handleChange}
                placeholder="Part apa saja yang sudah di ganti (Jika ada)"
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Cabang/SDSS/SSR/SASS *
              </label>
              <input
                type="text"
                name="sender"
                value={formData.sender}
                onChange={handleChange}
                placeholder="Nama Cabang, SDSS, SSR, atau SASS"
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nama *
              </label>
              <input
                type="text"
                name="requestBy"
                value={formData.requestBy}
                onChange={handleChange}
                placeholder="Nama Anda"
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Kirim Request"}
              </button>
              <Link href="/" className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
