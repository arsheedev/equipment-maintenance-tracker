"use client";

import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";
import { FileEdit } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditMaintenancePage() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState({ description: "", cost: "" });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    apiClient(token)
      .get(`/maintenance/${id}`)
      .then((res) => {
        setForm({
          description: res.data.description,
          cost: res.data.cost ? String(res.data.cost) : "",
        });
      })
      .finally(() => setLoading(false));
  }, [token, id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      await apiClient(token).put(`/maintenance/${id}`, {
        ...form,
        cost: form.cost ? parseFloat(form.cost) : undefined,
      });
      router.back();
    } catch (e: any) {
      setErr(e.response?.data?.error || "Failed to update log");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <div className="text-slate-500 text-sm p-6">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <FileEdit size={20} className="text-sky-600" />
          Edit Maintenance Log
        </h1>

        {err && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Describe the maintenance performed..."
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Cost (optional)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g., 250.00"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
            />
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
