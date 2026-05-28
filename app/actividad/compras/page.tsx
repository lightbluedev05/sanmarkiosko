"use client";

import { ArrowLeft, History } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

const purchasesData = [
  { id: "3", title: "Ticket de Comedor - Almuerzo", price: "S/ 5.50", status: "Completado", date: "15 May" },
  { id: "4", title: "Cargador Universal Laptop", price: "S/ 45.00", status: "Completado", date: "10 May" },
  { id: "p3", title: "Cuaderno Cuadriculado A4", price: "S/ 4.00", status: "Completado", date: "05 May" },
  { id: "p4", title: "Bolígrafo Parker", price: "S/ 25.00", status: "Completado", date: "01 May" },
  { id: "p5", title: "Mouse Inalámbrico", price: "S/ 35.00", status: "Completado", date: "28 Abr" },
];

export default function ComprasPage() {
  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-8 pb-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/actividad" 
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Historial de Compras</h1>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] bg-white border-2 shadow-sm">
        {purchasesData.map((item, index) => (
          <div 
            key={item.id}
            className={`flex items-center justify-between p-6 transition-all hover:bg-primary/5 ${
              index !== purchasesData.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/30 text-muted-foreground">
                <History className="h-6 w-6" />
              </div>
              <div>
                <p className="font-black text-foreground leading-tight">{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-black text-primary">{item.price}</span>
                  <span className="text-[10px] font-bold text-muted-foreground opacity-50">•</span>
                  <span className="text-[10px] font-bold text-muted-foreground">{item.date}</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="rounded-lg px-3 py-1 text-[10px] font-black uppercase bg-muted text-muted-foreground border-none">
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
