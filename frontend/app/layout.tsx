import AuthProvider from "@/context/AuthContext";
import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Equipment Maintenance Tracker",
  description: "Manage equipment and maintenance",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 text-slate-800 antialiased font-sans">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>

            <footer className="border-t bg-white/50 backdrop-blur py-4 text-center text-sm text-slate-500">
              © {new Date().getFullYear()} Equipment Maintenance Tracker.
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
