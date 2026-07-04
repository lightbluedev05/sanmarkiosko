"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Si estamos en la página de inicio de sesión, no mostrar los marcos del Dashboard
  if (isLoginPage) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Suspense fallback={<div className="w-72 border-r bg-card hidden md:block" />}>
        <Sidebar />
      </Suspense>
      
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile Top Navbar */}
        <Navbar />
        
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
            {children}
          </div>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
