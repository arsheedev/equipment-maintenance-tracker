"use client";

import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="font-bold text-lg text-sky-700 tracking-tight hover:text-sky-800 transition"
        >
          Maintenance Tracker
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/equipment"
            className="text-slate-600 hover:text-sky-700 transition"
          >
            Equipment
          </Link>

          <Link
            href="/maintenance/new"
            className="text-slate-600 hover:text-sky-700 transition"
          >
            Add Maintenance
          </Link>

          {user?.role === "admin" && (
            <>
              <Link
                href="/equipment/new"
                className="text-slate-600 hover:text-sky-700 transition"
              >
                Add Equipment
              </Link>
              <Link
                href="/user"
                className="text-slate-600 hover:text-sky-700 transition"
              >
                Users
              </Link>
              <Link
                href="/user/new"
                className="text-slate-600 hover:text-sky-700 transition"
              >
                Add User
              </Link>
            </>
          )}
        </div>

        {/* User info (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm text-slate-700 font-medium truncate max-w-[120px]">
            {user?.name}
          </span>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-700 hover:underline transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-slate-700 hover:text-sky-700 transition"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-200 shadow-inner">
          <div className="flex flex-col px-4 py-3 space-y-2 text-sm">
            <Link
              href="/equipment"
              onClick={closeMenu}
              className="text-slate-700 hover:text-sky-700 transition"
            >
              Equipment
            </Link>

            <Link
              href="/maintenance/new"
              onClick={closeMenu}
              className="text-slate-700 hover:text-sky-700 transition"
            >
              Add Maintenance
            </Link>

            {user?.role === "admin" && (
              <>
                <Link
                  href="/equipment/new"
                  onClick={closeMenu}
                  className="text-slate-700 hover:text-sky-700 transition"
                >
                  Add Equipment
                </Link>
                <Link
                  href="/user"
                  className="text-slate-600 hover:text-sky-700 transition"
                >
                  Users
                </Link>
                <Link
                  href="/user/new"
                  onClick={closeMenu}
                  className="text-slate-700 hover:text-sky-700 transition"
                >
                  Add User
                </Link>
              </>
            )}

            {/* User info */}
            <div className="pt-3 border-t border-slate-100 mt-3">
              <span className="block text-slate-600 mb-1">{user?.name}</span>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
