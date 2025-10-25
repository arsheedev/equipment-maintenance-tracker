"use client";

import ProtectedClient from "@/components/ProtectedClient";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";
import { Edit, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EquipmentDetailPage() {
  return (
    <ProtectedClient>
      <EquipmentDetailInner />
    </ProtectedClient>
  );
}

function EquipmentDetailInner() {
  const { token, user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    apiClient(token)
      .get(`/equipment/${id}`)
      .then((res) => setEquipment(res.data))
      .finally(() => setLoading(false));
  }, [token, id]);

  if (loading)
    return <div className="text-slate-500 text-sm p-6">Loading...</div>;
  if (!equipment)
    return (
      <div className="text-slate-500 text-sm p-6">Equipment not found.</div>
    );

  return (
    <div className="space-y-8">
      {/* Equipment Info */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {equipment.name}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {equipment.type} • {equipment.location}
            </p>
            <p className="text-sm text-slate-600 mt-2">
              Next maintenance:{" "}
              <span className="font-medium text-slate-800">
                {new Date(equipment.nextMaintenance).toLocaleDateString()}
              </span>
            </p>
          </div>

          {/* Admin actions */}
          {user?.role === "admin" && (
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/equipment/${equipment.id}/edit`)}
                className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                onClick={async () => {
                  if (
                    confirm("Are you sure you want to delete this equipment?")
                  ) {
                    await apiClient(token).delete(`/equipment/${equipment.id}`);
                    router.push("/equipment");
                  }
                }}
                className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Maintenance Logs */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Maintenance Logs
        </h2>

        {equipment.maintenanceLogs.length === 0 ? (
          <div className="text-slate-500 text-sm italic">
            No logs yet for this equipment.
          </div>
        ) : (
          <div className="space-y-4">
            {equipment.maintenanceLogs.map((log: any) => (
              <div
                key={log.id}
                className="bg-white border border-slate-100 rounded-xl shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                  <h3 className="font-semibold text-slate-800">
                    {new Date(log.date).toLocaleDateString()}
                  </h3>
                  <span className="text-sm text-slate-500">
                    By {log.performedBy?.name}
                  </span>
                </div>

                <p className="text-sm text-slate-600">{log.description}</p>

                {log.cost && (
                  <p className="text-sm text-slate-500 mt-2">
                    Cost:{" "}
                    <span className="font-medium text-slate-700">
                      ${log.cost.toFixed(2)}
                    </span>
                  </p>
                )}

                {(user?.role === "admin" || user?.id === log.performedById) && (
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={() => router.push(`/maintenance/${log.id}/edit`)}
                      className="text-sky-600 text-sm font-medium hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm("Delete this maintenance log?")) {
                          setLoading(true);
                          await apiClient(token).delete(
                            `/maintenance/${log.id}`
                          );
                          setEquipment((prev: any) => ({
                            ...prev,
                            maintenanceLogs: prev.maintenanceLogs.filter(
                              (l: any) => l.id !== log.id
                            ),
                          }));
                          setLoading(false);
                        }
                      }}
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
