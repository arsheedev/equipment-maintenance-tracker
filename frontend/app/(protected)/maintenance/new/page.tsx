"use client";

import ProtectedClient from "@/components/ProtectedClient";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";
import { ClipboardPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewMaintenancePage() {
  return (
    <ProtectedClient>
      <NewMaintenanceInner />
    </ProtectedClient>
  );
}

function NewMaintenanceInner() {
  const { token } = useAuth();
  const router = useRouter();
  const [equipments, setEquipments] = useState<any[]>([]);
  const [form, setForm] = useState({
    equipmentId: "",
    description: "",
    cost: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiClient(token)
      .get("/equipment")
      .then((r) => setEquipments(r.data));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await apiClient(token).post("/maintenance", {
        ...form,
        cost: form.cost ? parseFloat(form.cost) : undefined,
      });
      router.push(`/equipment/${form.equipmentId}`);
    } catch (e: any) {
      setErr(e.response?.data?.error || "Failed to add maintenance log");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 mt-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ClipboardPlus size={20} className="text-sky-600" />
          Add Maintenance Log
        </h1>

        {err && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Equipment Select */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Equipment
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none"
              value={form.equipmentId}
              onChange={(e) =>
                setForm({ ...form, equipmentId: e.target.value })
              }
              required
            >
              <option value="">Select equipment</option>
              {equipments.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

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

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Add Maintenance Log"}
          </button>
        </form>
      </div>
    </div>
  );
}
