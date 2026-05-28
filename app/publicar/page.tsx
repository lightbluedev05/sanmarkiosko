"use client";

import { Camera, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function PublicarPage() {
  return (
    <div className="mx-auto max-w-2xl flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Publicar Anuncio</h1>
      </div>

      <div className="rounded-[2.5rem] bg-white p-8 shadow-xl border-2">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Anuncio publicado exitosamente (Demo)"); }}>
          <div className="flex flex-col items-center justify-center rounded-3xl border-4 border-dashed border-muted bg-muted/30 py-12 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5">
            <Camera className="mb-4 h-12 w-12" />
            <p className="font-black">Subir fotos del producto</p>
            <p className="text-xs font-bold opacity-60">Máximo 5 fotos (JPG, PNG)</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wider text-muted-foreground">Título del anuncio</label>
            <Input placeholder="Ej: Vendo libros de Cálculo" className="h-12 rounded-xl border-2 font-bold" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-wider text-muted-foreground">Precio (S/)</label>
              <Input type="number" placeholder="0.00" className="h-12 rounded-xl border-2 font-bold" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-wider text-muted-foreground">Categoría</label>
              <select className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option>Académico</option>
                <option>Comida</option>
                <option>Tecnología</option>
                <option>Vida Diaria</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-wider text-muted-foreground">Descripción</label>
            <textarea className="flex min-h-[120px] w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Describe tu producto o servicio..." required />
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20">
            Publicar Ahora
          </Button>
        </form>
      </div>
    </div>
  );
}
