"use client";

import ProtectedClient from "@/components/ProtectedClient";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewEquipmentPage() {
  return (
    <ProtectedClient>
      <NewEquipmentInner />
    </ProtectedClient>
  );
}

function NewEquipmentInner() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    type: "",
    location: "",
    nextMaintenance: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user?.role !== "admin") {
    return (
      <div className="text-center text-red-600 font-medium p-6 bg-white border border-red-100 rounded-xl shadow-sm max-w-lg mx-auto mt-10">
        Only admins can add new equipment.
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await apiClient(token).post("/equipment", form);
      router.push("/equipment");
    } catch (e: any) {
      setErr(e.response?.data?.error || "Failed to add equipment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Plus size={20} className="text-sky-600" />
          Add New Equipment
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
              placeholder="e.g., Air Compressor"
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
              placeholder="e.g., Electrical"
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
              placeholder="e.g., Workshop 2A"
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

          <button
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Equipment"}
          </button>
        </form>
      </div>
    </div>
  );
}
