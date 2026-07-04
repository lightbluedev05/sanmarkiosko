"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, PlusSquare, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: ShoppingBag, label: "Actividad", href: "/actividad" },
  { icon: PlusSquare, label: "Publicar", href: "/publicar" },
  { icon: User, label: "Perfil", href: "/perfil" },
  { icon: Settings, label: "Ajustes", href: "/ajustes" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-muted bg-white/95 pb-safe-bottom shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/80 md:hidden animate-in slide-in-from-bottom duration-300">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-200 hover:text-primary py-1 px-3 rounded-xl cursor-pointer",
                isActive 
                  ? "text-primary font-black scale-105" 
                  : "text-muted-foreground/70 font-bold"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-transform", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
              <span className="text-[9px] uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
