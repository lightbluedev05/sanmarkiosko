"use client";

import { ArrowLeft, Package } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

const salesData = [
  { id: "1", title: "Resúmenes de Derecho Mercantil", price: "S/ 15.00", status: "Activo", date: "Hoy" },
  { id: "2", title: "Calculadora Casio FX-991LAX", price: "S/ 85.00", status: "Activo", date: "Ayer" },
  { id: "s3", title: "Libro Álgebra Lineal", price: "S/ 30.00", status: "Vendido", date: "12 May" },
  { id: "s4", title: "Zapatillas Deportivas Talle 42", price: "S/ 120.00", status: "Vendido", date: "10 May" },
  { id: "s5", title: "Mochila Porta Laptop", price: "S/ 60.00", status: "Vendido", date: "05 May" },
];

export default function VentasPage() {
  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-8 pb-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/actividad" 
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Todas mis Ventas</h1>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] bg-white border-2 shadow-sm">
        {salesData.map((item, index) => (
          <div 
            key={item.id}
            className={`flex items-center justify-between p-6 transition-all hover:bg-primary/5 ${
              index !== salesData.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Package className="h-6 w-6" />
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
            <Badge 
              variant="secondary" 
              className={cn(
                "rounded-lg px-3 py-1 text-[10px] font-black uppercase border-none",
                item.status === "Activo" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
              )}
            >
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
