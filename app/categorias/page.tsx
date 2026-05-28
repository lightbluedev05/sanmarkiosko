"use client";

import { Grid, Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/data";
import Link from "next/link";

export default function CategoriasPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Categorías</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <div 
            key={category}
            className="group flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-transparent bg-white p-10 shadow-sm transition-all hover:border-primary hover:shadow-2xl"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Grid className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-black text-foreground">{category}</h3>
            <p className="mt-2 text-center text-sm font-medium text-muted-foreground">
              Explora todos los anuncios de {category.toLowerCase()}
            </p>
            <Button className="mt-8 rounded-xl font-black" variant="secondary">
              Ver anuncios
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
