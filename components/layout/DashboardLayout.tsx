import { Suspense } from "react";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
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
