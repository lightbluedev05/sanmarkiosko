import Link from "next/link";
import { Home, Grid, PlusSquare, User } from "lucide-react";

const navItems = [
  { icon: Home, label: "Inicio", href: "/" },
  { icon: Grid, label: "Categorías", href: "/categorias" },
  { icon: PlusSquare, label: "Publicar", href: "/publicar" },
  { icon: User, label: "Perfil", href: "/perfil" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary"
          >
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
