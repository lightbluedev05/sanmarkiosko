"use client";

import { useState } from "react";
import { Camera, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { CustomModal } from "@/components/ui/CustomModal";

export default function PublicarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Estados del formulario
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Académico");
  const [type, setType] = useState<"Producto" | "Servicio">("Producto");
  const [stock, setStock] = useState("1");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const [submitting, setSubmitting] = useState(false);

  // Estados del Modal
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    type: "success" | "error" | "info";
    message: string;
    onCloseAction?: () => void;
  }>({
    isOpen: false,
    title: "",
    type: "info",
    message: "",
  });

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (modalState.onCloseAction) {
      modalState.onCloseAction();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);
    try {
      const res = await api.listings.create({
        title,
        description,
        price: parseFloat(price),
        category,
        imageUrl: imageUrl || undefined,
        type,
        stock: type === "Servicio" ? 0 : parseInt(stock, 10),
      });

      if (res.success) {
        setModalState({
          isOpen: true,
          title: "¡Anuncio Publicado!",
          type: "success",
          message: `Tu ${type.toLowerCase()} "${title}" ha sido publicado correctamente en el mercado de San Marcos. Ya se encuentra disponible para todos los estudiantes.`,
          onCloseAction: () => {
            router.push("/");
            router.refresh();
          },
        });
      }
    } catch (error: any) {
      setModalState({
        isOpen: true,
        title: "Error al publicar",
        type: "error",
        message: error.message || "Ocurrió un problema de red. Por favor inténtalo nuevamente.",
      });
    } finally {
      setSubmitting(false);
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
          Debes iniciar sesión con tu cuenta institucional para poder publicar anuncios en la plataforma.
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
    <>
      <div className="mx-auto max-w-2xl flex flex-col gap-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full cursor-pointer">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-3xl font-black tracking-tight">Publicar Anuncio</h1>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl border-2">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Campo de imagen simulado mediante URL */}
            <div className="flex flex-col items-center justify-center rounded-3xl border-4 border-dashed border-muted bg-muted/30 py-8 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 px-6">
              <Camera className="mb-3 h-10 w-10 text-muted-foreground/60" />
              <p className="font-black text-sm text-foreground">Añadir foto del producto</p>
              <p className="text-[10px] font-bold opacity-60 mb-4">Introduce una URL de imagen para tu producto</p>
              <Input 
                type="url" 
                placeholder="Ej: https://images.unsplash.com/... (opcional)" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full h-10 rounded-xl bg-white border-2 font-bold max-w-md text-xs focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-wider text-muted-foreground">Título del anuncio</label>
              <Input 
                placeholder="Ej: Vendo libros de Cálculo" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-xl border-2 font-bold focus:ring-4 focus:ring-primary/10" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-wider text-muted-foreground">Tipo de Publicación</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus-visible:outline-none focus:ring-4 focus:ring-primary/10"
                >
                  <option value="Producto">🛒 Producto (físico)</option>
                  <option value="Servicio">⚡ Servicio / Asesoría</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-wider text-muted-foreground">Categoría</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus-visible:outline-none focus:ring-4 focus:ring-primary/10"
                >
                  <option>Académico</option>
                  <option>Comida</option>
                  <option>Tecnología</option>
                  <option>Vida Diaria</option>
                  <option>Otros Servicios</option>
                  <option>Otros Productos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-black uppercase tracking-wider text-muted-foreground">Precio (S/)</label>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  placeholder="0.00" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-12 rounded-xl border-2 font-bold focus:ring-4 focus:ring-primary/10" 
                  required 
                />
              </div>
              
              {type === "Producto" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <label className="text-sm font-black uppercase tracking-wider text-muted-foreground">Stock Disponible</label>
                  <Input 
                    type="number" 
                    min="1"
                    placeholder="1" 
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="h-12 rounded-xl border-2 font-bold focus:ring-4 focus:ring-primary/10" 
                    required 
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-wider text-muted-foreground">Descripción</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex min-h-[120px] w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm font-bold shadow-sm focus-visible:outline-none focus:ring-4 focus:ring-primary/10 focus-visible:ring-ring" 
                placeholder="Describe tu producto o servicio (ej: estado del artículo, puntos de entrega en San Marcos)..." 
                required 
              />
            </div>

            <Button 
              type="submit" 
              disabled={submitting}
              className="w-full h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Publicando..." : "Publicar Ahora"}
            </Button>
          </form>
        </div>
      </div>

      <CustomModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        type={modalState.type}
      >
        <p>{modalState.message}</p>
      </CustomModal>
    </>
  );
}
