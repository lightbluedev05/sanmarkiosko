"use client";

import { useState, useEffect } from "react";
import { CreditCard, Bell, Shield, ArrowLeft, Camera, GraduationCap, Building2, Calendar, FileText, LogIn, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { api, UserStats } from "@/lib/api";
import { useRouter } from "next/navigation";
import { CustomModal } from "@/components/ui/CustomModal";

interface FacultyData {
  name: string;
  careers: string[];
}

const FACULTY_MAP: FacultyData[] = [
  {
    name: "Facultad de Ingeniería de Sistemas e Informática (FISI)",
    careers: ["Ingeniería de Sistemas", "Ingeniería de Software"]
  },
  {
    name: "Facultad de Ingeniería Industrial (FII)",
    careers: ["Ingeniería Industrial", "Ingeniería Textil y Confecciones", "Ingeniería de Seguridad y Salud en el Trabajo"]
  },
  {
    name: "Facultad de Ingeniería Electrónica y Eléctrica (FIEE)",
    careers: ["Ingeniería Electrónica", "Ingeniería Eléctrica", "Ingeniería de Telecomunicaciones", "Ingeniería Biomédica"]
  },
  {
    name: "Facultad de Derecho y Ciencia Política",
    careers: ["Derecho", "Ciencia Política"]
  },
  {
    name: "Facultad de Ciencias Administrativas (FCA)",
    careers: ["Administración", "Administración de Turismo", "Administración de Negocios Internacionales"]
  },
  {
    name: "Facultad de Ciencias Contables",
    careers: ["Contabilidad"]
  },
  {
    name: "Facultad de Ciencias Económicas",
    careers: ["Economía"]
  },
  {
    name: "Facultad de Medicina Humana (San Fernando)",
    careers: ["Medicina Humana", "Nutrición", "Enfermería", "Tecnología Médica", "Obstetricia"]
  },
  {
    name: "Facultad de Psicología",
    careers: ["Psicología"]
  },
  {
    name: "Facultad de Letras y Ciencias Humanas",
    careers: ["Comunicación Social", "Literatura"]
  },
  {
    name: "Facultad de Ciencias Sociales",
    careers: ["Historia", "Sociología", "Antropología", "Arqueología", "Trabajo Social"]
  },
  {
    name: "Facultad de Educación",
    careers: ["Educación"]
  },
  {
    name: "Facultad de Ciencias Matemáticas",
    careers: ["Matemática", "Estadística", "Investigación Operativa"]
  },
  {
    name: "Facultad de Ciencias Físicas",
    careers: ["Física"]
  },
  {
    name: "Facultad de Química e Ingeniería Química (FQIQ)",
    careers: ["Química", "Ingeniería Química", "Ingeniería Agroindustrial"]
  },
  {
    name: "Facultad de Ciencias Biológicas",
    careers: ["Ciencias Biológicas", "Genética y Biotecnología", "Microbiología y Parasitología"]
  },
  {
    name: "Facultad de Farmacia y Bioquímica",
    careers: ["Farmacia y Bioquímica"]
  },
  {
    name: "Facultad de Odontología",
    careers: ["Odontología"]
  },
  {
    name: "Facultad de Medicina Veterinaria",
    careers: ["Medicina Veterinaria"]
  },
  {
    name: "Facultad de Ingeniería Geológica, Minera, Metalúrgica y Geográfica (FIGMMG)",
    careers: ["Ingeniería Geológica", "Ingeniería de Minas", "Ingeniería Metalúrgica", "Ingeniería Geográfica", "Ingeniería Civil"]
  }
];

const YEARS = Array.from({ length: 15 }, (_, i) => (2026 - i).toString());

export default function PerfilPage() {
  const { user, loading, refreshUser } = useAuth();
  const router = useRouter();

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    type: "success" | "error" | "info";
    message: string;
  }>({
    isOpen: false,
    title: "",
    type: "info",
    message: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    faculty: "",
    career: "",
    year: "",
    bio: "",
    phone: ""
  });

  const [stats, setStats] = useState<UserStats>({
    activeListings: 0,
    totalSales: 0,
    rating: 5.0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Handlers para relacionar dinámicamente Facultad y Carrera
  const handleFacultyChange = (newFaculty: string) => {
    let updatedCareer = profileForm.career;
    if (newFaculty) {
      const matchedFac = FACULTY_MAP.find(f => f.name === newFaculty);
      if (matchedFac && !matchedFac.careers.includes(profileForm.career)) {
        updatedCareer = ""; // Resetear carrera si no corresponde a la nueva facultad
      }
    }
    setProfileForm(prev => ({
      ...prev,
      faculty: newFaculty,
      career: updatedCareer
    }));
  };

  const handleCareerChange = (newCareer: string) => {
    let updatedFaculty = profileForm.faculty;
    if (newCareer) {
      const matchedFac = FACULTY_MAP.find(f => f.careers.includes(newCareer));
      if (matchedFac) {
        updatedFaculty = matchedFac.name; // Auto-detectar facultad
      }
    }
    setProfileForm(prev => ({
      ...prev,
      faculty: updatedFaculty,
      career: newCareer
    }));
  };

  const getAvailableCareers = () => {
    if (profileForm.faculty) {
      const matchedFac = FACULTY_MAP.find(f => f.name === profileForm.faculty);
      return matchedFac ? matchedFac.careers : [];
    }
    // Si no hay facultad seleccionada, mostrar todas las carreras posibles
    const allCareers = FACULTY_MAP.reduce<string[]>((acc, f) => [...acc, ...f.careers], []);
    return Array.from(new Set(allCareers)).sort();
  };

  // Cargar datos del usuario en el formulario y obtener estadísticas
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        faculty: user.faculty || "",
        career: user.career || "",
        year: user.year || "",
        bio: user.bio || "",
        phone: user.phone || ""
      });

      const fetchStats = async () => {
        try {
          const res = await api.users.getStats();
          if (res.success) {
            setStats(res.data);
          }
        } catch (error) {
          console.error("Error al obtener estadísticas del perfil:", error);
        } finally {
          setLoadingStats(false);
        }
      };

      fetchStats();
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const res = await api.users.updateProfile(profileForm);
      if (res.success) {
        setIsEditing(false);
        await refreshUser(); // Actualizar contexto global
        setModalState({
          isOpen: true,
          title: "¡Perfil Actualizado!",
          type: "success",
          message: "Los cambios en tu información de estudiante han sido guardados correctamente en la base de datos.",
        });
      }
    } catch (error: any) {
      setModalState({
        isOpen: true,
        title: "Error al guardar",
        type: "error",
        message: error.message || "Ocurrió un problema de conexión al guardar tu perfil.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center font-bold text-primary animate-pulse">
        Cargando Sanmarkiosko...
      </div>
    );
  }

  // Si no está autenticado, invitar a iniciar sesión
  if (!user) {
    return (
      <div className="mx-auto max-w-md flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-300">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-5xl">
          🔒
        </div>
        <h2 className="text-2xl font-black text-foreground">Acceso Restringido</h2>
        <p className="mt-2 text-sm font-bold text-muted-foreground max-w-xs">
          Debes iniciar sesión con tu cuenta institucional para ver y editar tu perfil de estudiante.
        </p>
        <Link href="/login" className="mt-6 w-full">
          <Button className="w-full h-12 rounded-xl font-black gap-2 cursor-pointer">
            <LogIn className="h-5 w-5" />
            Iniciar Sesión ahora
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full cursor-pointer">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Mi Perfil</h1>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl border-2">
        <div className="h-32 bg-primary university-gradient relative">
          <button className="absolute right-6 bottom-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors backdrop-blur-md cursor-pointer">
            <Camera className="h-5 w-5" />
          </button>
        </div>
        <div className="px-8 pb-10">
          <div className="relative -mt-16 mb-8 flex items-end justify-between">
            <div className="relative">
              <div className="h-32 w-32 rounded-3xl border-4 border-white bg-white p-1 shadow-lg overflow-hidden">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-primary/10 text-4xl font-black text-primary uppercase">
                  {user.avatar_url || user.name.substring(0, 2).toUpperCase()}
                </div>
              </div>
              {user.is_pro && (
                <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-black text-white shadow-lg border-2 border-white">
                  PRO
                </div>
              )}
            </div>
            <Button 
              className={cn("rounded-xl font-black transition-all cursor-pointer", isEditing ? "bg-green-600 hover:bg-green-700 text-white" : "")} 
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
                <Input 
                  value={profileForm.name} 
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} 
                  className="h-11 rounded-xl font-bold border-2" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Facultad</label>
                <select 
                  value={profileForm.faculty} 
                  onChange={(e) => handleFacultyChange(e.target.value)} 
                  className="flex h-11 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Selecciona tu Facultad</option>
                  {FACULTY_MAP.map(fac => (
                    <option key={fac.name} value={fac.name}>{fac.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Carrera</label>
                <select 
                  value={profileForm.career} 
                  onChange={(e) => handleCareerChange(e.target.value)} 
                  className="flex h-11 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Selecciona tu Carrera</option>
                  {getAvailableCareers().map(car => (
                    <option key={car} value={car}>{car}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Año de Ingreso</label>
                <select 
                  value={profileForm.year} 
                  onChange={(e) => setProfileForm({...profileForm, year: e.target.value})} 
                  className="flex h-11 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Selecciona tu Año de Ingreso</option>
                  {YEARS.map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Sobre mí (Bio)</label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
                  value={profileForm.bio} 
                  onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Número de WhatsApp (Venta Directa)</label>
                <Input 
                  value={profileForm.phone} 
                  onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} 
                  className="h-11 rounded-xl font-bold border-2" 
                  placeholder="Ej: 987654321"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black tracking-tight text-foreground">{user.name}</h2>
                <p className="font-bold text-muted-foreground">{user.email}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-4 transition-all hover:bg-primary/5">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/60 leading-none mb-1">Facultad</span>
                    <span className="text-sm font-bold">{user.faculty || "No definida"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-4 transition-all hover:bg-primary/5">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/60 leading-none mb-1">Carrera</span>
                    <span className="text-sm font-bold">{user.career || "No definida"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-4 transition-all hover:bg-primary/5">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground/60 leading-none mb-1">Ingreso</span>
                    <span className="text-sm font-bold">{user.year || "No definido"}</span>
                  </div>
                </div>
              </div>

              {user.bio && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">Descripción</h3>
                  </div>
                  <p className="text-base font-medium leading-relaxed text-muted-foreground/90 bg-muted/20 p-5 rounded-2xl italic border-l-4 border-primary">
                    &quot;{user.bio}&quot;
                  </p>
                </div>
              )}

              {user.phone && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">WhatsApp de Contacto</h3>
                  </div>
                  <p className="text-sm font-black text-foreground bg-green-50 px-5 py-3 rounded-2xl border-l-4 border-green-600 inline-block">
                    💬 {user.phone}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-3">
                {loadingStats ? (
                  <div className="col-span-3 text-center py-4 font-bold text-muted-foreground animate-pulse">
                    Cargando métricas...
                  </div>
                ) : (
                  [
                    { label: "Anuncios Activos", value: `${stats.activeListings}`, icon: Bell },
                    { label: "Calificación", value: `${stats.rating.toFixed(1)}`, icon: Shield },
                    { label: "Ventas", value: `S/ ${stats.totalSales.toFixed(2)}`, icon: CreditCard },
                  ].map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center justify-center rounded-3xl bg-muted/30 p-6 text-center transition-all hover:shadow-lg hover:shadow-primary/5">
                      <stat.icon className="mb-2 h-6 w-6 text-primary" />
                      <p className="text-2xl font-black text-foreground">{stat.value}</p>
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">{stat.label}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <CustomModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        type={modalState.type}
      >
        <p>{modalState.message}</p>
      </CustomModal>
    </div>
  );
}
