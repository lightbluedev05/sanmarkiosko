"use client";

import Link from "next/link";
import { Search, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/AuthContext";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function Navbar() {
  const { user } = useAuth();
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container flex h-14 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-black tracking-tight text-primary">
            Sanmarkiosko
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="relative w-full max-w-[160px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              value={searchValue}
              onChange={handleChange}
              className="h-9 w-full rounded-full bg-muted pl-8 text-xs font-bold"
            />
          </div>
          {user ? (
            <Link href="/perfil" className="shrink-0">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-black">
                  {user.avatar_url || user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link href="/login" className="shrink-0">
              <Avatar className="h-8 w-8 border-2 border-muted hover:border-primary/50 transition-all">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
