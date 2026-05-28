"use client";

import { useState } from "react";
import { CreditCard, Bell, Shield, ArrowLeft, Camera, GraduationCap, Building2, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PerfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Juan Estudiante",
    email: "juan@unmsm.edu.pe",
    faculty: "Ciencias Contables",
    career: "Contabilidad",
    year: "2021",
    bio: "Estudiante de 5to ciclo apasionado por las finanzas y el mercado de pulgas del campus. Vendo mis resúmenes y libros que ya no uso."
  });

  const handleSave = () => {
    setIsEditing(false);
    alert("Perfil actualizado correctamente");
  };

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Mi Perfil</h1>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl border-2">
        <div className="h-32 bg-primary university-gradient relative">
           <button className="absolute right-6 bottom-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors backdrop-blur-md">
            <Camera className="h-5 w-5" />
          </button>
        </div>
        <div className="px-8 pb-10">
          <div className="relative -mt-16 mb-8 flex items-end justify-between">
            <div className="relative">
              <div className="h-32 w-32 rounded-3xl border-4 border-white bg-white p-1 shadow-lg overflow-hidden">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-primary/10 text-4xl font-black text-primary">
                  JD
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black text-white shadow-lg border-2 border-white">
                PRO
              </div>
            </div>
            <Button 
              className={cn("rounded-xl font-black transition-all", isEditing ? "bg-green-600 hover:bg-green-700" : "")} 
              variant={isEditing ? "default" : "outline"}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? "Guardar Cambios" : "Editar Perfil"}
            </Button>
          </div>

          {isEditing ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Nombre Completo</label>
                <Input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="h-11 rounded-xl font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Facultad</label>
                <Input value={profile.faculty} onChange={(e) => setProfile({...profile, faculty: e.target.value})} className="h-11 rounded-xl font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Carrera</label>
                <Input value={profile.career} onChange={(e) => setProfile({...profile, career: e.target.value})} className="h-11 rounded-xl font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Año de Ingreso</label>
                <Input value={profile.year} onChange={(e) => setProfile({...profile, year: e.target.value})} className="h-11 rounded-xl font-bold" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Sobre mí (Bio)</label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                  value={profile.bio} 
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black tracking-tight text-foreground">{profile.name}</h2>
                <p className="font-bold text-muted-foreground">{profile.email}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-4 transition-all hover:bg-primary/5">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/60 leading-none mb-1">Facultad</span>
                    <span className="text-sm font-bold">{profile.faculty}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-4 transition-all hover:bg-primary/5">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/60 leading-none mb-1">Carrera</span>
                    <span className="text-sm font-bold">{profile.career}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-4 transition-all hover:bg-primary/5">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/60 leading-none mb-1">Ingreso</span>
                    <span className="text-sm font-bold">{profile.year}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">Descripción</h3>
                </div>
                <p className="text-base font-medium leading-relaxed text-muted-foreground/90 bg-muted/20 p-5 rounded-2xl italic border-l-4 border-primary">
                  &quot;{profile.bio}&quot;
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-3">
                {[
                  { label: "Mis Anuncios", value: "12", icon: Bell },
                  { label: "Calificación", value: "4.9", icon: Shield },
                  { label: "Ventas", value: "S/ 450", icon: CreditCard },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center justify-center rounded-3xl bg-muted/30 p-6 text-center transition-all hover:shadow-lg hover:shadow-primary/5">
                    <stat.icon className="mb-2 h-6 w-6 text-primary" />
                    <p className="text-2xl font-black text-foreground">{stat.value}</p>
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
