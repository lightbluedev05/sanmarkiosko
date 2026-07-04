"use client";

import { useState, useEffect } from "react";
import { User, Bell, Shield, Lock, Smartphone, Globe, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { CustomModal } from "@/components/ui/CustomModal";
import { api } from "@/lib/api";

const settingsGroups = [
  {
    title: "Cuenta",
    items: [
      { id: "personal", icon: User, label: "Información Personal", description: "Gestiona tu nombre y datos básicos" },
      { id: "security", icon: Lock, label: "Seguridad y Contraseña", description: "Cambia tu clave y protege tu cuenta" },
      { id: "whatsapp", icon: Smartphone, label: "Verificación de Teléfono", description: "Vincula tu WhatsApp para contacto directo" },
    ]
  },
  {
    title: "Preferencias",
    items: [
      { id: "notifications", icon: Bell, label: "Notificaciones", description: "Configura alertas de nuevos mensajes y ventas" },
      { id: "language", icon: Globe, label: "Idioma y Región", description: "Español (Perú)" },
    ]
  },
  {
    title: "Privacidad",
    items: [
      { id: "privacy", icon: Shield, label: "Visibilidad de Perfil", description: "Quién puede ver tu facultad y carrera" },
    ]
  }
];

export default function AjustesPage() {
  const { user, logout, refreshUser } = useAuth();
  const router = useRouter();

  // Estados de control para modales interactivos
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados del formulario de contraseña
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estado del formulario de WhatsApp
  const [phone, setPhone] = useState("");

  // Estados de preferencias guardados en LocalStorage
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [salesNotifs, setSalesNotifs] = useState(true);
  const [lang, setLang] = useState("es-PE");
  const [privacyMode, setPrivacyMode] = useState("public");

  // Cargar preferencias locales al montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmailNotifs(localStorage.getItem("pref_notifs_email") !== "false");
      setSalesNotifs(localStorage.getItem("pref_notifs_sales") !== "false");
      setLang(localStorage.getItem("pref_lang") || "es-PE");
      setPrivacyMode(localStorage.getItem("pref_privacy") || "public");
    }
    if (user && user.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  // Alertas globales (CustomModal)
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    title: string;
    type: "success" | "error" | "info" | "confirm";
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    type: "info",
    message: "",
  });

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleItemClick = (itemId: string) => {
    if (itemId === "personal") {
      router.push("/perfil?edit=true");
      return;
    }

    if (!user) {
      setAlertState({
        isOpen: true,
        title: "Inicio de sesión requerido",
        type: "confirm",
        message: "Debes iniciar sesión con tu cuenta institucional para configurar estas opciones.",
        confirmText: "Iniciar Sesión",
        cancelText: "Volver",
        onConfirm: () => {
          closeAlert();
          router.push("/login");
        }
      } as any);
      return;
    }

    // Activar el modal específico
    setActiveModal(itemId);
  };

  // 1. Guardar nueva contraseña en el backend
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setAlertState({
        isOpen: true,
        title: "Contraseñas no coinciden",
        type: "error",
        message: "La nueva contraseña y su confirmación no coinciden.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.users.changePassword(currentPassword, newPassword);
      if (res.success) {
        setActiveModal(null);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setAlertState({
          isOpen: true,
          title: "Contraseña Actualizada",
          type: "success",
          message: "Tu contraseña ha sido actualizada con éxito en la base de datos de Supabase.",
        });
      }
    } catch (error: any) {
      setAlertState({
        isOpen: true,
        title: "Error al actualizar",
        type: "error",
        message: error.message || "La contraseña actual introducida es incorrecta.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Guardar teléfono/WhatsApp en el backend
  const handleSavePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.users.updateProfile({ phone });
      if (res.success) {
        await refreshUser();
        setActiveModal(null);
        setAlertState({
          isOpen: true,
          title: "WhatsApp Vinculado",
          type: "success",
          message: `El número ${phone} se ha vinculado correctamente a tu perfil para contacto directo de compras y ventas.`,
        });
      }
    } catch (error: any) {
      setAlertState({
        isOpen: true,
        title: "Error al vincular",
        type: "error",
        message: error.message || "No se pudo actualizar tu número de teléfono.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. Guardar Notificaciones en LocalStorage
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pref_notifs_email", emailNotifs ? "true" : "false");
    localStorage.setItem("pref_notifs_sales", salesNotifs ? "true" : "false");
    setActiveModal(null);
    setAlertState({
      isOpen: true,
      title: "Preferencias Guardadas",
      type: "success",
      message: "Tus preferencias de notificaciones han sido actualizadas localmente en este dispositivo.",
    });
  };

  // 4. Guardar Idioma en LocalStorage
  const handleSaveLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pref_lang", lang);
    setActiveModal(null);
    setAlertState({
      isOpen: true,
      title: "Idioma Cambiado",
      type: "success",
      message: `El idioma del sistema ha sido configurado a: ${lang === "es-PE" ? "Español (Perú)" : "English (US)"}.`,
    });
  };

  // 5. Guardar Privacidad en LocalStorage
  const handleSavePrivacy = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pref_privacy", privacyMode);
    setActiveModal(null);
    setAlertState({
      isOpen: true,
      title: "Ajustes de Privacidad",
      type: "success",
      message: `Visibilidad configurada correctamente a: ${privacyMode === "public" ? "Público para todo el campus" : "Solo alumnos de mi facultad"}.`,
    });
  };

  const handleLogoutClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setAlertState({
      isOpen: true,
      title: "Cerrar Sesión",
      type: "confirm",
      message: "¿Estás seguro de que deseas cerrar tu sesión en Sanmarkiosko?",
      confirmText: "Salir",
      cancelText: "Cancelar",
      onConfirm: () => {
        closeAlert();
        logout();
      },
    } as any);
  };

  return (
    <>
      <div className="mx-auto max-w-3xl flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full cursor-pointer">
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
                    onClick={() => handleItemClick(item.id)}
                    className={`flex w-full items-center justify-between p-6 transition-all hover:bg-primary/5 cursor-pointer ${
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
        
        <Button 
          variant={user ? "destructive" : "default"}
          onClick={handleLogoutClick}
          className="mt-4 h-14 rounded-2xl font-black shadow-xl shadow-destructive/10 cursor-pointer"
        >
          {user ? "Cerrar Sesión" : "Iniciar Sesión"}
        </Button>
      </div>

      {/* ==========================================
          MODALES DE AJUSTES INDIVIDUALES
          ========================================== */}

      {/* 1. Modal Cambio de Contraseña */}
      {activeModal === "security" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl border-2 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-foreground mb-4">Seguridad y Contraseña</h3>
            <form onSubmit={handleSavePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-muted-foreground">Contraseña Actual</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-11 rounded-xl border-2 font-bold focus:ring-4 focus:ring-primary/10"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-muted-foreground">Nueva Contraseña</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-11 rounded-xl border-2 font-bold focus:ring-4 focus:ring-primary/10"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-muted-foreground">Confirmar Nueva Contraseña</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 rounded-xl border-2 font-bold focus:ring-4 focus:ring-primary/10"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)} className="flex-1 h-12 rounded-xl font-black cursor-pointer border-2" disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl font-black cursor-pointer" disabled={loading}>
                  {loading ? "Guardando..." : "Actualizar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal Vincular WhatsApp */}
      {activeModal === "whatsapp" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl border-2 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-foreground mb-2">Verificación de Teléfono</h3>
            <p className="text-xs font-bold text-muted-foreground mb-4">
              Vincula tu número de WhatsApp para que los compradores puedan contactarte directamente en un solo clic.
            </p>
            <form onSubmit={handleSavePhone} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-muted-foreground">Número de WhatsApp (9 dígitos)</label>
                <Input
                  type="tel"
                  placeholder="Ej: 987654321"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 rounded-xl border-2 font-bold focus:ring-4 focus:ring-primary/10"
                  maxLength={15}
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)} className="flex-1 h-12 rounded-xl font-black cursor-pointer border-2" disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl font-black cursor-pointer" disabled={loading}>
                  {loading ? "Guardando..." : "Vincular"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Preferencias de Notificaciones */}
      {activeModal === "notifications" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl border-2 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-foreground mb-4">Configurar Notificaciones</h3>
            <form onSubmit={handleSaveNotifications} className="space-y-4">
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/30">
                <div>
                  <p className="text-sm font-black text-foreground">Alertas por Correo</p>
                  <p className="text-[10px] font-bold text-muted-foreground">Recibe un email cuando alguien reserve un producto</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailNotifs} 
                  onChange={(e) => setEmailNotifs(e.target.checked)} 
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/30">
                <div>
                  <p className="text-sm font-black text-foreground">Notificaciones en Navegador</p>
                  <p className="text-[10px] font-bold text-muted-foreground">Alertas inmediatas en tiempo real de compras</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={salesNotifs} 
                  onChange={(e) => setSalesNotifs(e.target.checked)} 
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)} className="flex-1 h-12 rounded-xl font-black cursor-pointer border-2">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl font-black cursor-pointer">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal Idioma */}
      {activeModal === "language" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl border-2 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-foreground mb-4">Idioma y Región</h3>
            <form onSubmit={handleSaveLanguage} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-muted-foreground">Idioma Seleccionado</label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="flex h-11 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary/10"
                >
                  <option value="es-PE">Español (Perú)</option>
                  <option value="en-US">English (United States)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)} className="flex-1 h-12 rounded-xl font-black cursor-pointer border-2">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl font-black cursor-pointer">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Modal Privacidad */}
      {activeModal === "privacy" && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl border-2 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-foreground mb-4">Visibilidad del Perfil</h3>
            <form onSubmit={handleSavePrivacy} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-muted-foreground">Quién puede ver mi carrera y facultad</label>
                <select
                  value={privacyMode}
                  onChange={(e) => setPrivacyMode(e.target.value)}
                  className="flex h-11 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus:ring-4 focus:ring-primary/10"
                >
                  <option value="public">🌍 Público (todo el campus)</option>
                  <option value="facultad">🏫 Solo estudiantes de mi facultad</option>
                  <option value="private">🔒 Privado (solo yo)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)} className="flex-1 h-12 rounded-xl font-black cursor-pointer border-2">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 h-12 rounded-xl font-black cursor-pointer">
                  Guardar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alertas globales de CustomModal */}
      <CustomModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        title={alertState.title}
        type={alertState.type}
        onConfirm={alertState.onConfirm}
        confirmText="Confirmar"
        cancelText="Volver"
      >
        <p className="whitespace-pre-line">{alertState.message}</p>
      </CustomModal>
    </>
  );
}
