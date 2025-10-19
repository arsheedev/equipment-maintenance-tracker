"use client";

import ProtectedClient from "@/components/ProtectedClient";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/api";
import { Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function UsersPage() {
  return (
    <ProtectedClient>
      <UsersInner />
    </ProtectedClient>
  );
}

function UsersInner() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    apiClient(token)
      .get("/auth/users")
      .then((res) => setUsers(res.data))
      .catch((e) => setErr(e.response?.data?.error || "Failed to fetch users"))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await apiClient(token).delete(`/auth/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e: any) {
      alert(e.response?.data?.error || "Failed to delete user");
    }
  }

  if (user?.role !== "admin") {
    return (
      <div className="p-6 text-center text-red-600">
        Only admins can access this page.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <Users size={22} className="text-sky-600" />
          User Management
        </h1>
        <span className="text-sm text-slate-500">
          Total users: {users.length}
        </span>
      </header>

      {loading && <div>Loading users...</div>}
      {err && <div className="text-red-600 mb-3">{err}</div>}

      {!loading && users.length === 0 && (
        <div className="text-slate-500 text-sm">No users found.</div>
      )}

      {!loading && users.length > 0 && (
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 border-b text-slate-700">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b hover:bg-slate-50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium">{u.name}</td>
                  <td className="py-3 px-4 text-slate-600">{u.email}</td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      u.role === "admin" ? "text-sky-700" : "text-slate-700"
                    }`}
                  >
                    {u.role}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
