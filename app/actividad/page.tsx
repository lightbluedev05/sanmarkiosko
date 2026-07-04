"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Package, History, Heart, Trash2, Power, RefreshCw, Calendar, User, Mail, GraduationCap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import { api } from "@/lib/api";
import { Listing } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomModal } from "@/components/ui/CustomModal";

export default function ActividadPage() {
  const { user, loading } = useAuth();
  
  const [sales, setSales] = useState<Listing[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Estados de control para Reservas de Anuncio Seleccionado
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [updatingListing, setUpdatingListing] = useState(false);
  const [localStock, setLocalStock] = useState("1");
  const [showReservationsModal, setShowReservationsModal] = useState(false);

  // Estados para alertas personalizadas (CustomModal)
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

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [salesRes, purchasesRes, favoritesRes] = await Promise.all([
        api.activity.getSales(),
        api.activity.getPurchases(),
        api.favorites.getAll()
      ]);

      if (salesRes.success) setSales(salesRes.data);
      if (purchasesRes.success) setPurchases(purchasesRes.data);
      if (favoritesRes.success) setFavorites(favoritesRes.data);
    } catch (error) {
      console.error("Error al cargar la actividad del usuario:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Al hacer clic en un anuncio del panel de ventas (vendedor)
  const handleListingClick = async (listing: Listing) => {
    setSelectedListing(listing);
    setLocalStock((listing.stock ?? 0).toString());
    setShowReservationsModal(true);
    setLoadingReservations(true);
    try {
      const res = await api.activity.getListingReservations(listing.id);
      if (res.success) {
        setReservations(res.data);
      }
    } catch (error) {
      console.error("Error al cargar reservas:", error);
    } finally {
      setLoadingReservations(false);
    }
  };

  // Guardar cambios en el stock (Reactivar si stock > 0 y estaba Agotado)
  const handleUpdateStock = async () => {
    if (!selectedListing) return;
    setUpdatingListing(true);
    try {
      const newStock = parseInt(localStock, 10);
      if (isNaN(newStock) || newStock < 0) {
        setAlertState({
          isOpen: true,
          title: "Valor Inválido",
          type: "error",
          message: "El stock debe ser un número entero mayor o igual a 0.",
        });
        setUpdatingListing(false);
        return;
      }

      // Si el anuncio estaba "Vendido" (agotado) y subimos el stock, se reactiva automáticamente
      const updatedStatus = newStock > 0 && selectedListing.status === "Vendido" ? "Activo" : selectedListing.status;

      const res = await api.listings.update(selectedListing.id, {
        stock: newStock,
        status: updatedStatus
      });

      if (res.success) {
        // Actualizar la lista local
        setSales(prev => prev.map(s => s.id === selectedListing.id ? res.data : s));
        setSelectedListing(res.data);
        
        setAlertState({
          isOpen: true,
          title: "¡Stock Actualizado!",
          type: "success",
          message: `El stock se ha actualizado a ${newStock} unidades de forma exitosa en el servidor.`,
        });
      }
    } catch (error: any) {
      setAlertState({
        isOpen: true,
        title: "Error al actualizar",
        type: "error",
        message: error.message || "No se pudo actualizar el stock en la base de datos.",
      });
    } finally {
      setUpdatingListing(false);
    }
  };

  // Alternar entre Activo e Inactivo
  const handleToggleStatus = async () => {
    if (!selectedListing) return;
    setUpdatingListing(true);
    try {
      const newStatus = selectedListing.status === "Activo" ? "Inactivo" : "Activo";
      const res = await api.listings.update(selectedListing.id, {
        status: newStatus
      });

      if (res.success) {
        setSales(prev => prev.map(s => s.id === selectedListing.id ? res.data : s));
        setSelectedListing(res.data);

        setAlertState({
          isOpen: true,
          title: "Estado Modificado",
          type: "success",
          message: `La publicación se ha marcado como "${newStatus}" correctamente.`,
        });
      }
    } catch (error: any) {
      setAlertState({
        isOpen: true,
        title: "Error de estado",
        type: "error",
        message: error.message || "No se pudo cambiar el estado de la publicación.",
      });
    } finally {
      setUpdatingListing(false);
    }
  };

  // Confirmar y eliminar publicación
  const handleDeleteClick = () => {
    if (!selectedListing) return;
    setAlertState({
      isOpen: true,
      title: "Eliminar Publicación",
      type: "confirm",
      message: `¿Estás seguro de que deseas eliminar permanentemente la publicación "${selectedListing.title}"?\n\nEsta acción es irreversible y borrará el anuncio de la base de datos.`,
      onConfirm: executeDelete,
    });
  };

  const executeDelete = async () => {
    if (!selectedListing) return;
    closeAlert();
    setUpdatingListing(true);
    try {
      const res = await api.listings.delete(selectedListing.id);
      if (res.success) {
        setSales(prev => prev.filter(s => s.id !== selectedListing.id));
        setShowReservationsModal(false);
        setSelectedListing(null);

        setAlertState({
          isOpen: true,
          title: "Publicación Eliminada",
          type: "success",
          message: "El anuncio ha sido removido exitosamente del mercado estudiantil.",
        });
      }
    } catch (error: any) {
      setAlertState({
        isOpen: true,
        title: "Error al eliminar",
        type: "error",
        message: error.message || "No se pudo eliminar el anuncio.",
      });
    } finally {
      setUpdatingListing(false);
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
          Debes iniciar sesión con tu cuenta institucional para ver tu panel de ventas, compras y favoritos.
        </p>
        <Link href="/login" className="mt-6 w-full">
          <Button className="w-full h-12 rounded-xl font-black gap-2 cursor-pointer">
            <User className="h-5 w-5" />
            Iniciar Sesión ahora
          </Button>
        </Link>
      </div>
    );
  }

  const activeSalesCount = sales.filter(item => item.status === "Activo").length;
  const recentSales = sales; // Mostrar todas las ventas del vendedor en su dashboard
  const recentPurchases = purchases; // Mostrar todas las compras del estudiante en su historial

  return (
    <>
      <div className="mx-auto max-w-4xl flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full cursor-pointer")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-black tracking-tight">Mi Actividad</h1>
        </div>

        {/* Módulos de estadísticas */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Ventas Activas", value: `${loadingData ? "..." : activeSalesCount}`, icon: Package },
            { label: "Compras Realizadas", value: `${loadingData ? "..." : purchases.length}`, icon: History },
            { label: "Favoritos Guardados", value: `${loadingData ? "..." : favorites.length}`, icon: Heart },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center rounded-3xl bg-white border-2 p-6 text-center transition-all hover:shadow-lg hover:shadow-primary/5">
              <stat.icon className="mb-2 h-6 w-6 text-primary" />
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">{stat.label}</p>
            </div>
          ))}
        </div>

        {loadingData ? (
          <div className="flex h-64 items-center justify-center font-bold text-muted-foreground animate-pulse">
            Cargando detalles de actividad...
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Sección Ventas */}
            <div className="space-y-4">
              <div className="px-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                  Mis Publicaciones y Ventas (Haz clic para ver reservas)
                </h2>
              </div>
              <div className="overflow-hidden rounded-[2.5rem] bg-white border-2 shadow-sm">
                {sales.length > 0 ? (
                  sales.map((item, index) => {
                    const isProd = item.type !== "Servicio";
                    return (
                      <div 
                        key={item.id}
                        onClick={() => handleListingClick(item)}
                        className={`flex items-center justify-between p-6 transition-all hover:bg-primary/5 cursor-pointer ${
                          index !== sales.length - 1 ? "border-b" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Package className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-black text-foreground leading-tight">{item.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-black text-primary">S/ {Number(item.price).toFixed(2)}</span>
                              <span className="text-[10px] font-bold text-muted-foreground opacity-50">•</span>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.category}</span>
                              <span className="text-[10px] font-bold text-muted-foreground opacity-50">•</span>
                              <span className="text-xs font-bold text-muted-foreground">
                                {isProd ? `Stock: ${item.stock ?? 1}` : "⚡ Servicio"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "rounded-lg px-3 py-1 text-[10px] font-black uppercase border-none",
                            item.status === "Activo" 
                              ? "bg-green-100 text-green-700" 
                              : item.status === "Vendido" 
                                ? "bg-red-100 text-red-700"
                                : "bg-muted text-muted-foreground"
                          )}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center text-sm font-bold text-muted-foreground">
                    Aún no has publicado ningún anuncio para vender.
                  </div>
                )}
              </div>
            </div>

            {/* Sección Compras */}
            <div className="space-y-4">
              <div className="px-4">
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                  Compras Recientes
                </h2>
              </div>
              <div className="overflow-hidden rounded-[2.5rem] bg-white border-2 shadow-sm">
                {recentPurchases.length > 0 ? (
                  recentPurchases.map((item, index) => (
                    <div 
                      key={item.transactionId}
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
                            <span className="text-sm font-black text-primary">S/ {parseFloat(item.price).toFixed(2)}</span>
                            <span className="text-[10px] font-bold text-muted-foreground opacity-50">•</span>
                            <span className="text-[10px] font-bold text-muted-foreground">Vendedor: {item.sellerName}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="rounded-lg px-3 py-1 text-[10px] font-black uppercase bg-muted text-muted-foreground border-none">
                        {item.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-sm font-bold text-muted-foreground">
                    No has reservado ningún producto o servicio todavía.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL DETALLE DE PUBLICACIÓN Y LISTADO DE COMPRADORES (Vendedor Roster)
          ========================================================================= */}
      {showReservationsModal && selectedListing && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-[2.5rem] bg-white p-8 shadow-2xl border-2 animate-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col overflow-hidden">
            {/* Header del Modal */}
            <div className="flex items-start justify-between border-b pb-4 shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">
                  {selectedListing.type} • {selectedListing.category}
                </span>
                <h3 className="text-xl font-black text-foreground leading-tight pr-8">{selectedListing.title}</h3>
                <p className="text-lg font-black text-primary mt-1">S/ {Number(selectedListing.price).toFixed(2)}</p>
              </div>
              <button 
                onClick={() => setShowReservationsModal(false)}
                className="rounded-full p-1.5 hover:bg-muted text-muted-foreground cursor-pointer transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content: Panel de Configuración y Roster de Estudiantes */}
            <div className="flex-1 overflow-y-auto py-6 space-y-8 pr-2">
              {/* Sección Controles del Vendedor */}
              <div className="rounded-2xl border-2 bg-muted/20 p-5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  ⚙️ Panel de Control del Anuncio
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedListing.type === "Producto" && (
                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted-foreground uppercase">Actualizar Stock</label>
                      <div className="flex gap-2">
                        <Input 
                          type="number" 
                          min="0"
                          value={localStock} 
                          onChange={(e) => setLocalStock(e.target.value)} 
                          className="h-10 border-2 rounded-xl font-bold bg-white focus:ring-4 focus:ring-primary/10" 
                          disabled={updatingListing}
                        />
                        <Button 
                          onClick={handleUpdateStock} 
                          disabled={updatingListing}
                          className="h-10 px-4 rounded-xl font-black flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className={cn("h-4 w-4", updatingListing ? "animate-spin" : "")} />
                          Guardar
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col justify-end gap-2">
                    <label className="text-xs font-black text-muted-foreground uppercase">Visibilidad / Acciones</label>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedListing.status === "Activo" ? "outline" : "default"}
                        onClick={handleToggleStatus}
                        disabled={updatingListing}
                        className="h-10 px-4 rounded-xl font-black flex items-center gap-1.5 cursor-pointer border-2"
                      >
                        <Power className="h-4 w-4" />
                        {selectedListing.status === "Activo" ? "Desactivar" : "Activar"}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteClick}
                        disabled={updatingListing}
                        className="h-10 px-4 rounded-xl font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Roster de Reservaciones */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Estudiantes que han reservado ({reservations.length})
                </h4>

                {loadingReservations ? (
                  <div className="text-center py-8 font-bold text-muted-foreground animate-pulse">
                    Buscando reservas en la base de datos...
                  </div>
                ) : reservations.length > 0 ? (
                  <div className="space-y-3">
                    {reservations.map((res: any) => (
                      <div key={res.transactionId} className="rounded-2xl border bg-white p-4 shadow-sm space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary text-sm uppercase">
                              {res.buyerName.substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-black text-foreground text-sm">{res.buyerName}</p>
                              <p className="text-[10px] font-bold text-muted-foreground">{res.buyerFaculty} • ciclo {res.buyerYear}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-green-50 text-green-700 border-none text-[9px] font-black rounded-lg">
                            RESERVADO
                          </Badge>
                        </div>
                        
                        <div className="flex flex-col gap-1 border-t pt-3 text-xs font-bold text-muted-foreground md:flex-row md:items-center md:justify-between md:gap-4">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-primary/60" />
                            <span>{res.buyerEmail}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 md:mt-0">
                            <Calendar className="h-3.5 w-3.5 text-primary/60" />
                            <span>Reservado: {new Date(res.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed p-8 text-center text-sm font-bold text-muted-foreground">
                    Aún ningún estudiante ha reservado esta publicación.
                  </div>
                )}
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="border-t pt-4 text-right shrink-0 mt-4">
              <Button onClick={() => setShowReservationsModal(false)} className="rounded-xl h-11 px-6 font-black cursor-pointer">
                Cerrar Panel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CustomModal global para notificaciones de alerta y confirmaciones */}
      <CustomModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        title={alertState.title}
        type={alertState.type}
        onConfirm={alertState.onConfirm}
        confirmText="Aceptar"
        cancelText="Cancelar"
      >
        <p className="whitespace-pre-line">{alertState.message}</p>
      </CustomModal>
    </>
  );
}
