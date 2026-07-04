"use client";

import React from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Button } from "./button";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: "success" | "error" | "warning" | "info" | "confirm";
  children: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function CustomModal({
  isOpen,
  onClose,
  title,
  type = "info",
  children,
  onConfirm,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  loading = false,
}: CustomModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "error":
        return <AlertCircle className="h-12 w-12 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
      case "confirm":
        return <Info className="h-12 w-12 text-primary" />;
      default:
        return <Info className="h-12 w-12 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl border-2 animate-in zoom-in-95 duration-200">
        {/* Botón de cerrar X */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-6 top-6 rounded-full p-1.5 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Contenido */}
        <div className="flex flex-col items-center text-center gap-4 mt-2">
          {getIcon()}
          <h3 className="text-xl font-black text-foreground">{title}</h3>
          <div className="text-sm font-bold text-muted-foreground leading-relaxed w-full">
            {children}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3 mt-8">
          {type === "confirm" ? (
            <>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 h-12 rounded-xl font-black cursor-pointer border-2"
              >
                {cancelText}
              </Button>
              <Button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 h-12 rounded-xl font-black cursor-pointer"
              >
                {loading ? "Procesando..." : confirmText}
              </Button>
            </>
          ) : (
            <Button
              onClick={onClose}
              className="w-full h-12 rounded-xl font-black cursor-pointer"
            >
              Cerrar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
