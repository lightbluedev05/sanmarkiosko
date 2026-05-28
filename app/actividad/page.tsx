"use client";

import { ShoppingBag, ArrowLeft, Package, History, Heart, ChevronRight, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

const salesData = [
  { id: "1", title: "Resúmenes de Derecho Mercantil", price: "S/ 15.00", status: "Activo", date: "Hoy" },
  { id: "2", title: "Calculadora Casio FX-991LAX", price: "S/ 85.00", status: "Activo", date: "Ayer" },
  { id: "s3", title: "Libro Álgebra Lineal", price: "S/ 30.00", status: "Vendido", date: "12 May" },
];

const purchasesData = [
  { id: "3", title: "Ticket de Comedor - Almuerzo", price: "S/ 5.50", status: "Completado", date: "15 May" },
  { id: "4", title: "Cargador Universal Laptop", price: "S/ 45.00", status: "Completado", date: "10 May" },
  { id: "p3", title: "Cuaderno Cuadriculado A4", price: "S/ 4.00", status: "Completado", date: "05 May" },
];

export default function ActividadPage() {
  const recentSales = salesData.slice(0, 2);
  const recentPurchases = purchasesData.slice(0, 2);

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-8 pb-12">
      <div className="flex items-center gap-4">
        <Link 
          href="/" 
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Mi Actividad</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Ventas Activas", value: "2", icon: Package },
          { label: "Compras", value: "14", icon: History },
          { label: "Favoritos", value: "8", icon: Heart },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col items-center justify-center rounded-3xl bg-white border-2 p-6 text-center transition-all hover:shadow-lg hover:shadow-primary/5">
            <stat.icon className="mb-2 h-6 w-6 text-primary" />
            <p className="text-2xl font-black text-foreground">{stat.value}</p>
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-10">
        {/* Sección Ventas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Mis Ventas Recientes
            </h2>
            <Link 
              href="/actividad/ventas" 
              className={cn(buttonVariants({ variant: "link" }), "text-xs font-black text-primary p-0 h-auto gap-1 whitespace-nowrap flex items-center")}
            >
              Ver todas mis ventas <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-[2.5rem] bg-white border-2 shadow-sm">
            {recentSales.map((item, index) => (
              <div 
                key={item.id}
                className={`flex items-center justify-between p-6 transition-all hover:bg-primary/5 ${
                  index !== recentSales.length - 1 ? "border-b" : ""
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
                <Badge variant="secondary" className="rounded-lg px-3 py-1 text-[10px] font-black uppercase bg-green-100 text-green-700 border-none">
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Sección Compras */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Compras Recientes
            </h2>
            <Link 
              href="/actividad/compras" 
              className={cn(buttonVariants({ variant: "link" }), "text-xs font-black text-primary p-0 h-auto gap-1 whitespace-nowrap flex items-center")}
            >
              Ver historial completo <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-[2.5rem] bg-white border-2 shadow-sm">
            {recentPurchases.map((item, index) => (
              <div 
                key={item.id}
                className={`flex items-center justify-between p-6 transition-all hover:bg-primary/5 ${
                  index !== recentPurchases.length - 1 ? "border-b" : ""
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
      </div>
    </div>
  );
}
