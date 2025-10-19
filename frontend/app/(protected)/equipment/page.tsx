"use client";

import ProtectedClient from "@/components/ProtectedClient";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EquipmentListPage() {
  return (
    <ProtectedClient>
      <EquipmentInner />
    </ProtectedClient>
  );
}

function EquipmentInner() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiClient(token)
      .get("/equipment")
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-slate-800">Equipment</h1>

        {user?.role === "admin" && (
          <Link
            href="/equipment/new"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <Plus size={16} />
            Add Equipment
          </Link>
        )}
      </div>

      {/* Equipment list */}
      {loading ? (
        <div className="text-slate-500 text-sm">Loading equipment...</div>
      ) : items.length === 0 ? (
        <div className="text-slate-400 italic text-sm">
          No equipment found.{" "}
          {user?.role === "admin" && "Add one to get started."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <Link
              key={it.id}
              href={`/equipment/${it.id}`}
              className="block bg-white border border-slate-100 rounded-xl shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition"
            >
              <h2 className="text-lg font-semibold text-slate-800">
                {it.name}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {it.type} • {it.location}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Next maintenance:{" "}
                <span className="font-medium text-slate-600">
                  {new Date(it.nextMaintenance).toLocaleDateString()}
                </span>
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
