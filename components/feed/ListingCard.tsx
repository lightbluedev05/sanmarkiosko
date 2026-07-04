"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Listing } from "@/lib/data";
import { CheckCircle2, Flame, MessageCircle, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomModal } from "@/components/ui/CustomModal";

interface ListingCardProps {
  listing: Listing;
  onRefresh?: () => void;
}

export function ListingCard({ listing, onRefresh }: ListingCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados para manejar el CustomModal de manera elegante
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    type: "success" | "error" | "warning" | "info" | "confirm";
    message: string;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: "",
    type: "info",
    message: "",
  });

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleContactAndBuy = () => {
    // 1. Validar si el usuario está autenticado
    if (!user) {
      setModalState({
        isOpen: true,
        title: "Inicio de Sesión Requerido",
        type: "confirm",
        message: "Debes iniciar sesión con tu cuenta institucional de San Marcos (@unmsm.edu.pe) para poder reservar un producto o servicio.",
        confirmText: "Iniciar Sesión",
        cancelText: "Seguir viendo",
        onConfirm: () => {
          closeModal();
          router.push("/login");
        },
      });
      return;
    }

    // 2. Validar que no sea su propio anuncio
    if (user.id === listing.seller_id) {
      setModalState({
        isOpen: true,
        title: "Acción no permitida",
        type: "error",
        message: "No puedes reservar o comprar un producto o servicio publicado por ti mismo.",
      });
      return;
    }

    // 3. Validar stock si es un producto
    const isProduct = listing.type === "Producto";
    const stock = listing.stock ?? 1;
    if (isProduct && stock <= 0) {
      setModalState({
        isOpen: true,
        title: "Producto Agotado",
        type: "warning",
        message: "Lo sentimos, este producto se encuentra agotado y ya no quedan unidades disponibles en stock.",
      });
      return;
    }

    // 4. Mostrar modal de confirmación
    setModalState({
      isOpen: true,
      title: "Confirmar Reserva",
      type: "confirm",
      message: `¿Deseas reservar "${listing.title}" por S/ ${Number(listing.price).toFixed(2)}?\n\nAl aceptar, se registrará en tu historial de compras. Coordina el pago e intercambio directamente con el vendedor.`,
      confirmText: "Confirmar Reserva",
      cancelText: "Cancelar",
      onConfirm: executePurchase,
    });
  };

  const executePurchase = async () => {
    closeModal();
    setLoading(true);
    try {
      const res = await api.activity.buy(listing.id);
      if (res.success) {
        setModalState({
          isOpen: true,
          title: "¡Reserva realizada con éxito!",
          type: "success",
          message: `Has reservado "${listing.title}". Se ha enviado tu solicitud al vendedor. Por favor, ponte en contacto con ${listing.sellerName || "el vendedor"} para finalizar la transacción en el campus.`,
          onConfirm: () => {
            closeModal();
            if (onRefresh) {
              onRefresh();
            } else {
              router.refresh();
              window.location.reload();
            }
          },
        });
      }
    } catch (error: any) {
      setModalState({
        isOpen: true,
        title: "Error al realizar reserva",
        type: "error",
        message: error.message || "Ocurrió un problema de red. Inténtalo más tarde.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isProduct = listing.type !== "Servicio";
  const stock = listing.stock ?? 1;

  return (
    <>
      <Card 
        className={cn(
          "group relative flex flex-col overflow-hidden border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl p-0 gap-0",
          listing.isBoosted 
            ? "border-boosted/40 bg-boosted/5 ring-4 ring-boosted/10" 
            : "border-transparent bg-card"
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-t-xl">
          <Image 
            src={
              listing.imageUrl || 
              (listing.category === "Académico" ? "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop" :
               listing.category === "Comida" ? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop" :
               listing.category === "Tecnología" ? "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop" :
               listing.category === "Vida Diaria" ? "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=800&q=80" :
               listing.category === "Otros Servicios" ? "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop" :
               "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop")
            } 
            alt={listing.title} 
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          
          {listing.isBoosted && (
            <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-boosted px-3 py-1 text-[10px] font-black uppercase tracking-wider text-boosted-foreground shadow-lg">
              <Flame className="h-3 w-3 fill-current" />
              Promocionado
            </div>
          )}
        </div>
        
        <CardHeader className="flex-1 p-5 pb-2">
          <div className="flex items-start justify-between gap-4">
            <h3 className="line-clamp-2 text-lg font-black leading-tight tracking-tight transition-colors group-hover:text-primary">
              {listing.title}
            </h3>
          </div>
        </CardHeader>
        
        <CardContent className="px-5 pb-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-2xl font-black text-primary">
              S/ {Number(listing.price).toFixed(2)}
            </span>
            <div className="flex gap-2">
              <Badge variant="secondary" className="rounded-lg bg-muted/50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-muted-foreground border-none">
                {listing.category}
              </Badge>
              {isProduct ? (
                <Badge className={cn(
                  "rounded-lg px-2 py-1 text-[10px] font-black uppercase tracking-wider border-none transition-colors",
                  stock > 0 ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"
                )}>
                  {stock > 0 ? `Stock: ${stock}` : "Agotado"}
                </Badge>
              ) : (
                <Badge className="rounded-lg bg-orange-100 text-orange-700 px-2 py-1 text-[10px] font-black uppercase tracking-wider border-none hover:bg-orange-100">
                  Servicio
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 border-t pt-4">
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary uppercase">
              {listing.sellerName ? listing.sellerName.charAt(0) : "S"}
            </div>
            <div className="flex flex-1 items-center gap-1 overflow-hidden">
              <span className="truncate text-xs font-bold text-muted-foreground">{listing.sellerName || "Vendedor"}</span>
              {listing.isPro && (
                <Badge variant="secondary" className="h-5 gap-0.5 rounded-full bg-blue-600 px-1.5 text-[9px] font-black text-white hover:bg-blue-600 border-none">
                  <CheckCircle2 className="h-2.5 w-2.5" />
                  PRO
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-5 pt-0">
          <Button 
            disabled={loading || (isProduct && stock <= 0)}
            className="w-full gap-2 rounded-xl border-2 border-primary bg-primary py-6 text-sm font-black transition-all hover:bg-transparent hover:text-primary cursor-pointer disabled:opacity-50"
            onClick={handleContactAndBuy}
          >
            <MessageCircle className="h-4 w-4" />
            {loading ? "Reservando..." : isProduct && stock <= 0 ? "Agotado" : "Reservar y Contactar"}
          </Button>
        </CardFooter>
      </Card>

      {/* Renderizado dinámico de CustomModal */}
      <CustomModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        type={modalState.type}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        onConfirm={modalState.onConfirm}
        loading={loading}
      >
        <p className="whitespace-pre-line">{modalState.message}</p>
      </CustomModal>
    </>
  );
}
