"use client";

import { ShieldCheck, HelpCircle as HelpIcon, MessageCircle, ArrowLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
  {
    q: "¿Cómo realizo una compra segura?",
    a: "Siempre reúnete con el vendedor en lugares concurridos dentro del campus, como la biblioteca o las facultades, y verifica el producto antes de pagar."
  },
  {
    q: "¿Tengo que pagar por publicar?",
    a: "No, las publicaciones básicas son gratuitas. Solo pagas si deseas destacar tu anuncio (Boost) o si eres un Vendedor Pro."
  },
  {
    q: "¿Qué hago si tengo un problema con un vendedor?",
    a: "Puedes reportar al usuario desde su perfil o contactar directamente a soporte con las pruebas necesarias."
  }
];

export default function AyudaPage() {
  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-10 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Centro de Ayuda</h1>
      </div>

      {/* Safety Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-amber-500 p-8 text-white shadow-xl md:p-12 university-gradient !from-amber-500 !to-orange-600">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-md">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">Guía de Seguridad</h2>
            <p className="max-w-md font-bold opacity-90 text-white/80">
              Tu seguridad es nuestra prioridad. Lee nuestros consejos para transacciones en el campus.
            </p>
          </div>
          <Button className="ml-auto rounded-xl bg-white font-black text-orange-600 hover:bg-white/90">
            Leer Guía
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <h2 className="px-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">
          Preguntas Frecuentes
        </h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-[2rem] border-2 bg-white p-6 shadow-sm transition-all hover:border-primary/50">
              <p className="mb-2 text-lg font-black text-foreground leading-tight">{faq.q}</p>
              <p className="font-medium text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Support Section */}
      <section className="rounded-[2.5rem] bg-primary/5 border-2 border-dashed border-primary/30 p-8 text-center">
        <HelpIcon className="mx-auto mb-4 h-12 w-12 text-primary opacity-50" />
        <h2 className="text-2xl font-black text-foreground">¿Aún necesitas ayuda?</h2>
        <p className="mx-auto mt-2 max-w-xs font-bold text-muted-foreground">
          Nuestro equipo de soporte está disponible para ayudarte con cualquier problema.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button className="rounded-xl h-12 px-8 font-black gap-2">
            <MessageCircle className="h-5 w-5" />
            Chat con Soporte
          </Button>
          <Button variant="outline" className="rounded-xl h-12 px-8 font-black gap-2 border-2">
            <AlertTriangle className="h-5 w-5" />
            Reportar Incidente
          </Button>
        </div>
      </section>
    </div>
  );
}
