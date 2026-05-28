"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlusSquare, Info, X } from "lucide-react";
import { CategoryPills } from "@/components/feed/CategoryPills";
import { ListingCard } from "@/components/feed/ListingCard";
import { DUMMY_LISTINGS, Category } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function HomeContent() {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("q") || "";

  const filteredListings = useMemo(() => {
    return DUMMY_LISTINGS.filter((listing) => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(listing.category);
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (a.isBoosted && !b.isBoosted) return -1;
      if (!a.isBoosted && b.isBoosted) return 1;
      return 0;
    });
  }, [selectedCategories, searchQuery]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const isSearching = searchQuery.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Welcome Header Container with Smooth Transitions */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-700 ease-in-out",
          isSearching ? "max-h-0 opacity-0 scale-95 pointer-events-none mb-0" : "max-h-[600px] opacity-100 scale-100 mb-2"
        )}
      >
        <section className="relative overflow-hidden rounded-[2.5rem] bg-primary p-8 text-primary-foreground border border-primary/10 md:p-12 min-h-[300px] flex items-center">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/banner_sanmarkiosko.webp"
              alt="San Marcos Background"
              className="h-full w-full object-cover"
              fill
              priority
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 flex w-full flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Hola, estudiante 👋
              </h1>
              <p className="max-w-md text-base font-medium opacity-90 sm:text-lg text-primary-foreground/100">
                Bienvenido al mercado oficial de San Marcos. ¿Qué necesitas hoy para tus clases?
              </p>
            </div>
            <Button
              className="cursor-pointer h-14 w-full gap-2 rounded-2xl bg-white px-8 text-lg font-black text-primary shadow-2xl transition-all hover:scale-[1.05] hover:bg-white active:scale-95 sm:w-auto"
              onClick={() => router.push("/publicar")}
            >
              <PlusSquare className="h-6 w-6" />
              Publicar Anuncio
            </Button>
          </div>
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </section>

        {/* Info Banner */}
        <div className="mt-8 flex items-center gap-3 rounded-2xl border bg-blue-50/50 p-4 text-sm text-blue-700 md:text-base transition-all">
          <Info className="h-5 w-5 shrink-0" />
          <p>
            Recuerda que los pagos se realizan directamente entre estudiantes. ¡Sé precavido!
          </p>
        </div>
      </div>

      {/* Search Focus Mode Header - Smoothly appears when searching */}
      {isSearching && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 mb-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black tracking-tight">
                Resultados para <span className="text-primary">&quot;{searchQuery}&quot;</span>
              </h1>
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                className="rounded-xl font-bold hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="mr-2 h-4 w-4" />
                Limpiar búsqueda
              </Button>
            </div>
            <div className="h-1.5 w-24 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      )}

      {/* Categories */}
      <section className="space-y-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            Filtrar por Categoría
          </h2>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="text-xs font-bold text-primary hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
        <CategoryPills
          selectedCategories={selectedCategories}
          onToggle={toggleCategory}
        />

        {/* Active Filters Display - Integrated into section for tighter spacing */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in slide-in-from-left-2 duration-300">
            {selectedCategories.map(cat => (
              <Badge
                key={cat}
                variant="secondary"
                className="group gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary border-none transition-all hover:bg-primary/20"
              >
                {cat}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(cat);
                  }}
                  className="rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </section>

      {/* Feed Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">
              {isSearching ? "Anuncios encontrados" : "Novedades para ti"}
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Mostrando {filteredListings.length} {filteredListings.length === 1 ? 'anuncio' : 'anuncios'}
            </p>
          </div>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 transition-all">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted/50 text-5xl">
              🕵️‍♂️
            </div>
            <h3 className="text-2xl font-black text-foreground">No hay resultados</h3>
            <Button
              variant="outline"
              className="mt-8 rounded-xl border-2 font-black"
              onClick={() => router.push("/")}
            >
              Restablecer todo
            </Button>
          </div>
        )}
      </section>

      <div className="h-8 md:hidden" />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-64 items-center justify-center font-bold">Cargando Sanmarkiosko...</div>}>
      <HomeContent />
    </Suspense>
  );
}
