"use client";

import Link from "next/link";
import { Home, ShoppingBag, PlusSquare, User, Search, Settings, HelpCircle, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: ShoppingBag, label: "Mi Actividad", href: "/actividad" },
  { icon: PlusSquare, label: "Publicar", href: "/publicar" },
  { icon: User, label: "Perfil", href: "/perfil" },
];

const secondaryItems = [
  { icon: Settings, label: "Configuración", href: "/ajustes" },
  { icon: HelpCircle, label: "Ayuda", href: "/ayuda" },
];

function SidebarSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setSearchValue(searchParams.get("q") || "");
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    router.replace(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="¿Qué buscas hoy?"
        value={searchValue}
        onChange={handleChange}
        className="h-11 w-full rounded-2xl border-2 bg-background pl-10 text-sm font-bold transition-all focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden h-full w-72 shrink-0 flex-col border-r bg-card md:flex sidebar-gradient">
      <div className="flex h-20 items-center px-8 shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
            <span className="text-xl font-black">S</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary">
            Sanmarkiosko
          </span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-6 scrollbar-hide">
        <div className="mb-6">
          <Suspense>
            <SidebarSearch />
          </Suspense>
          
          <nav className="space-y-1">
            <p className="mb-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Menú Principal
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl px-4 py-3 text-sm font-black transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]" 
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "stroke-[3px]" : "stroke-2")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div>
          <p className="mb-3 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Soporte & Ajustes
          </p>
          <nav className="space-y-1">
            {secondaryItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl px-4 py-2.5 text-sm font-bold transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" 
                      : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="p-4 shrink-0 border-t">
        {user ? (
          <div className="group relative flex items-center gap-3 rounded-[1.5rem] bg-white p-2.5 shadow-sm border-2 transition-all hover:shadow-md animate-in fade-in duration-300">
            <Link href="/perfil" className="flex flex-1 items-center gap-3 overflow-hidden">
              <div className="relative h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-base">
                {user.avatar_url || user.name.substring(0, 2).toUpperCase()}
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500 z-10" />
              </div>
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-xs font-black text-foreground truncate">{user.name}</p>
                <p className="text-[9px] font-bold text-muted-foreground truncate">{user.faculty || "Estudiante"}</p>
              </div>
            </Link>
            
            <button 
              onClick={logout}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-all"
              title="Cerrar sesión"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        ) : (
          <Link href="/login">
            <Button className="w-full h-11 rounded-2xl font-black gap-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer">
              <LogIn className="h-4.5 w-4.5" />
              Iniciar Sesión
            </Button>
          </Link>
        )}
      </div>
    </aside>
  );
}
