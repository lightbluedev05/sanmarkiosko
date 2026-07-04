"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, UserPlus, LogIn, GraduationCap, AlertCircle } from "lucide-react";

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

export default function LoginPage() {
  const { user, login, register, loading } = useAuth();
  const router = useRouter();

  // Estados del formulario
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [faculty, setFaculty] = useState("");
  const [career, setCareer] = useState("");
  const [year, setYear] = useState("");
  const [bio, setBio] = useState("");

  // Handlers para relacionar dinámicamente Facultad y Carrera en registro
  const handleFacultyChange = (newFaculty: string) => {
    let updatedCareer = career;
    if (newFaculty) {
      const matchedFac = FACULTY_MAP.find(f => f.name === newFaculty);
      if (matchedFac && !matchedFac.careers.includes(career)) {
        updatedCareer = ""; // Limpiar si la carrera no pertenece a la nueva facultad
      }
    }
    setFaculty(newFaculty);
    setCareer(updatedCareer);
  };

  const handleCareerChange = (newCareer: string) => {
    let updatedFaculty = faculty;
    if (newCareer) {
      const matchedFac = FACULTY_MAP.find(f => f.careers.includes(newCareer));
      if (matchedFac) {
        updatedFaculty = matchedFac.name; // Autodetectar facultad
      }
    }
    setFaculty(updatedFaculty);
    setCareer(newCareer);
  };

  const getAvailableCareers = () => {
    if (faculty) {
      const matchedFac = FACULTY_MAP.find(f => f.name === faculty);
      return matchedFac ? matchedFac.careers : [];
    }
    const allCareers = FACULTY_MAP.reduce<string[]>((acc, f) => [...acc, ...f.careers], []);
    return Array.from(new Set(allCareers)).sort();
  };

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirigir al inicio si ya está autenticado
  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // Validar correo institucional
    if (!email.endsWith("@unmsm.edu.pe")) {
      setError("Debes utilizar un correo institucional de San Marcos (@unmsm.edu.pe).");
      setSubmitting(false);
      return;
    }

    try {
      if (isRegistering) {
        if (!name || !career || !year) {
          setError("Por favor completa los campos de nombre, carrera y año de ingreso.");
          setSubmitting(false);
          return;
        }
        await register({
          name,
          email,
          password,
          faculty,
          career,
          year,
          bio,
        });
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center font-bold text-primary">
        Cargando Sanmarkiosko...
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-3 mb-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/25">
          <span className="text-3xl font-black">S</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-primary">Sanmarkiosko</h1>
        <p className="text-sm font-bold text-muted-foreground max-w-xs">
          El mercado oficial de compra, venta e intercambio para la comunidad sanmarquina 🎓
        </p>
      </div>

      {/* Auth Card */}
      <div className="rounded-[2.5rem] bg-white p-8 shadow-2xl border-2">
        <h2 className="text-2xl font-black tracking-tight text-foreground mb-6 flex items-center gap-2">
          {isRegistering ? <UserPlus className="h-6 w-6 text-primary" /> : <LogIn className="h-6 w-6 text-primary" />}
          {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
        </h2>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border bg-destructive/10 p-4 text-sm text-destructive font-bold">
            <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Nombre Completo</label>
              <Input
                placeholder="Ej: Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-xl border-2 font-bold focus:ring-4 focus:ring-primary/10"
                required
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Correo Institucional</label>
            <Input
              type="email"
              placeholder="usuario@unmsm.edu.pe"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl border-2 font-bold focus:ring-4 focus:ring-primary/10"
              required
            />
            <span className="text-[10px] font-bold text-muted-foreground block px-1">
              * Debe terminar en @unmsm.edu.pe
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Contraseña</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl border-2 font-bold focus:ring-4 focus:ring-primary/10"
              required
            />
          </div>

          {isRegistering && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Año Ingreso</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary/10 focus-visible:outline-none"
                    required
                  >
                    <option value="">Año</option>
                    {YEARS.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Facultad</label>
                  <select
                    value={faculty}
                    onChange={(e) => handleFacultyChange(e.target.value)}
                    className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary/10 focus-visible:outline-none"
                    required
                  >
                    <option value="">Selecciona Facultad</option>
                    {FACULTY_MAP.map(fac => (
                      <option key={fac.name} value={fac.name}>{fac.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Escuela / Carrera</label>
                <select
                  value={career}
                  onChange={(e) => handleCareerChange(e.target.value)}
                  className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary/10 focus-visible:outline-none"
                  required
                >
                  <option value="">Selecciona tu Escuela / Carrera</option>
                  {getAvailableCareers().map(car => (
                    <option key={car} value={car}>{car}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">Biografía (Sobre mí)</label>
                <textarea
                  placeholder="Cuéntanos qué vendes o qué estudias..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="flex min-h-[80px] w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary/10 focus-visible:outline-none"
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 mt-4 cursor-pointer"
          >
            {submitting ? "Procesando..." : isRegistering ? "Registrarse" : "Ingresar"}
          </Button>
        </form>

        <div className="mt-6 border-t pt-4 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(null);
            }}
            className="text-sm font-black text-primary hover:underline"
          >
            {isRegistering ? "¿Ya tienes una cuenta? Inicia sesión" : "¿Eres nuevo? Regístrate aquí"}
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-green-500" />
        <span>Tus datos de inicio de sesión se encriptan de forma segura</span>
      </div>
    </div>
  );
}
