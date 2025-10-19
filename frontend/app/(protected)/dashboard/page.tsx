"use client";

import ProtectedClient from "@/components/ProtectedClient";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";
import { useEffect, useState } from "react";

type Equipment = {
  id: number;
  name: string;
  type: string;
  location: string;
  nextMaintenance: string;
};

export default function DashboardPage() {
  return (
    <ProtectedClient>
      <DashboardInner />
    </ProtectedClient>
  );
}

function DashboardInner() {
  const { token, logout, user } = useAuth();
  const [equip, setEquip] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const client = apiClient(token);
    client
      .get("/equipment")
      .then((res) => setEquip(res.data))
      .catch((err) => {
        if (err.response?.status === 401) logout();
      })
      .finally(() => setLoading(false));
  }, [token, logout]);

  const total = equip.length;
  const upcoming = equip.filter(
    (e) => new Date(e.nextMaintenance) > new Date()
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
          <p className="text-slate-500 text-sm">
            Welcome back, <span className="font-medium">{user?.name}</span> 👋
          </p>
        </div>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5 hover:shadow-md transition">
          <h4 className="text-slate-600 text-sm font-medium mb-1">
            Total Equipment
          </h4>
          <p className="text-3xl font-bold text-sky-700">{total}</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5 hover:shadow-md transition">
          <h4 className="text-slate-600 text-sm font-medium mb-1">
            Upcoming Maintenance
          </h4>
          <p className="text-3xl font-bold text-amber-500">{upcoming}</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5 hover:shadow-md transition">
          <h4 className="text-slate-600 text-sm font-medium mb-1">
            Completed Maintenance
          </h4>
          <p className="text-3xl font-bold text-emerald-600">
            {total - upcoming}
          </p>
        </div>
      </section>

      {/* Equipment list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Equipment Overview
          </h3>
          <span className="text-sm text-slate-500">
            {loading
              ? "Loading..."
              : `${equip.length} item${equip.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {loading ? (
          <div className="text-slate-500 text-sm">Fetching data...</div>
        ) : equip.length === 0 ? (
          <div className="text-slate-400 text-sm italic">
            No equipment found. Add one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {equip.map((e) => (
              <div
                key={e.id}
                className="bg-white border border-slate-100 rounded-xl shadow-sm p-5 hover:shadow-md transition"
              >
                <h4 className="font-semibold text-slate-800">{e.name}</h4>
                <p className="text-sm text-slate-500 mt-1">
                  {e.type} • {e.location}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Next maintenance:{" "}
                  <span className="font-medium text-slate-600">
                    {new Date(e.nextMaintenance).toLocaleDateString()}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
