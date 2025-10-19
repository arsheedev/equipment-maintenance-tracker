"use client";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: number; name: string; email: string; role: string } | null;

type AuthContextType = {
  user: User;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API = process.env.NEXT_PUBLIC_API_URL;

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ← NEW

  useEffect(() => {
    // Try to load from localStorage once
    const rawToken = localStorage.getItem("em_token");
    const rawUser = localStorage.getItem("em_user");

    if (rawToken && rawUser) {
      setToken(rawToken);
      setUser(JSON.parse(rawUser));
    }
    setLoading(false); // done hydrating
  }, []);

  async function login(email: string, password: string) {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    localStorage.setItem("em_token", t);
    localStorage.setItem("em_user", JSON.stringify(u));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("em_token");
    localStorage.removeItem("em_user");
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
