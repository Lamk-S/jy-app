"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useThemeStore } from "@/store/useThemeStore";

export default function FullScreenLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const { isDark } = useThemeStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => setIsVisible(false), 600); // Tiempo para animación completa
      }, 200); // Delay para asegurar carga completa
    };

    // Detecta cuando la página y recursos están completamente cargados
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (!isVisible) return null;

  // Determina el tema: usa light por defecto si no hidratado, sino usa isDark
  const theme = hydrated ? isDark : false;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-600 ease-in-out ${
        isLoading
          ? "opacity-100 scale-100 bg-linear-to-br from-blue-100 via-white to-blue-200 dark:from-gray-800 dark:via-gray-900 dark:to-black"
          : "opacity-0 scale-95 translate-y-4"
      }`}
      aria-live="polite"
      aria-label="Cargando página"
    >
      {/* Contenedor central con animación */}
      <div
        className={`text-center transform transition-transform duration-500 ${
          isLoading ? "scale-100" : "scale-90"
        }`}
      >
        {/* Logo con sombra y hover */}
        <div className="mb-8">
          <Image
            src="/images/placeholder.png" // Logo
            alt="J&Y Store Logo"
            width={140}
            height={140}
            className="mx-auto drop-shadow-lg hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = document.createElement("div");
              fallback.className = `w-36 h-36 ${
                theme ? "bg-blue-500" : "bg-blue-600"
              } rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto drop-shadow-lg hover:scale-105 transition-transform duration-300`;
              fallback.textContent = "J&Y";
              e.currentTarget.parentElement?.appendChild(fallback);
            }}
          />
        </div>

        {/* Spinner circular animado con colores temáticos */}
        <div
          className={`w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4 ${
            theme
              ? "border-gray-600 border-t-blue-400"
              : "border-gray-300 border-t-blue-600"
          }`}
        ></div>

        {/* Texto con animación de pulso */}
        <p
          className={`text-lg font-medium animate-pulse ${
            theme ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Cargando...
        </p>
      </div>
    </div>
  );
}