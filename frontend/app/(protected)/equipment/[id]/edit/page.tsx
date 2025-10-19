"use client";

import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";
import { Save, Wrench } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditEquipmentPage() {
  const { token, user } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
    nextMaintenance: "",
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!token) return;
    apiClient(token)
      .get(`/equipment/${id}`)
      .then((res) => {
        const e = res.data;
        setForm({
          name: e.name,
          type: e.type,
          location: e.location,
          nextMaintenance: e.nextMaintenance.split("T")[0],
        });
      })
      .finally(() => setLoading(false));
  }, [token, id]);

  if (user?.role !== "admin") {
    return (
      <div className="text-center text-red-600 font-medium p-6 bg-white border border-red-100 rounded-xl shadow-sm max-w-lg mx-auto mt-10">
        Only admins can edit equipment.
      </div>
    );
  }

  if (loading)
    return <div className="text-slate-500 text-sm p-6">Loading...</div>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      await apiClient(token).put(`/equipment/${id}`, form);
      router.push(`/equipment/${id}`);
    } catch (e: any) {
      setErr(e.response?.data?.error || "Failed to update equipment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Wrench size={20} className="text-sky-600" />
          Edit Equipment
        </h1>

        {err && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              placeholder="Equipment name"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Type
            </label>
            <input
              placeholder="Equipment type"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location
            </label>
            <input
              placeholder="Location"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Next Maintenance Date
            </label>
            <input
              type="date"
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none"
              value={form.nextMaintenance}
              onChange={(e) =>
                setForm({ ...form, nextMaintenance: e.target.value })
              }
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
