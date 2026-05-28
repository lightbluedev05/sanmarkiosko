"use client";

import { User, Bell, Shield, Lock, Smartphone, Globe, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const settingsGroups = [
  {
    title: "Cuenta",
    items: [
      { icon: User, label: "Información Personal", description: "Gestiona tu nombre y datos básicos" },
      { icon: Lock, label: "Seguridad y Contraseña", description: "Cambia tu clave y protege tu cuenta" },
      { icon: Smartphone, label: "Verificación de Teléfono", description: "Vincula tu WhatsApp para contacto directo" },
    ]
  },
  {
    title: "Preferencias",
    items: [
      { icon: Bell, label: "Notificaciones", description: "Configura alertas de nuevos mensajes y ventas" },
      { icon: Globe, label: "Idioma y Región", description: "Español (Perú)" },
    ]
  },
  {
    title: "Privacidad",
    items: [
      { icon: Shield, label: "Visibilidad de Perfil", description: "Quién puede ver tu facultad y carrera" },
    ]
  }
];

export default function AjustesPage() {
  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Configuración</h1>
      </div>

      <div className="flex flex-col gap-8">
        {settingsGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h2 className="px-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              {group.title}
            </h2>
            <div className="overflow-hidden rounded-[2rem] bg-white border-2 shadow-sm">
              {group.items.map((item, index) => (
                <button 
                  key={item.label}
                  className={`flex w-full items-center justify-between p-6 transition-all hover:bg-primary/5 ${
                    index !== group.items.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-foreground leading-tight">{item.label}</p>
                      <p className="text-xs font-bold text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/40" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <Button variant="destructive" className="mt-4 h-14 rounded-2xl font-black shadow-xl shadow-destructive/10">
        Cerrar Sesión
      </Button>
    </div>
  );
}
