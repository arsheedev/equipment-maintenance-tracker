"use client";

import Navbar from "@/components/Navbar";
import ProtectedClient from "@/components/ProtectedClient";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedClient>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-800">
        {/* Sticky navbar on top */}
        <header className="sticky top-0 z-40">
          <Navbar />
        </header>

        {/* Main content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 lg:p-8 min-h-[70vh]">
            {children}
          </div>
        </main>
      </div>
    </ProtectedClient>
  );
}
