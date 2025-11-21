"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { createClient } from "@supabase/supabase-js";
import type { Product, Variant } from "@/types/product";
import ProductScanModal from "./ProductScanModal";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function QRScannerWithModal() {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Limpiar scanner al desmontar el componente
  useEffect(() => {
    return () => {
      if (scanner) {
        (async () => {
          try {
            // Verifica si el scanner está escaneando usando el enum
            const state = scanner.getState();
            if (state === Html5QrcodeScannerState.SCANNING) {  // Usa el enum en lugar de string
              await scanner.stop();
            }
          } catch (err) {
            // Maneja 'err' como 'unknown': usa type guard para acceder a .message
            if (err instanceof Error && !err.message.includes("not running")) {
              console.warn("Error stopping scanner:", err);
            }
            // Si no es un Error, ignora silenciosamente para no llenar la consola
          }
          try {
            await scanner.clear();
          } catch (err) {
            if (err instanceof Error && !err.message.includes("not running")) {
              console.warn("Error clearing scanner:", err);
            }
          }
        })();
      }
    };
  }, [scanner]);

  // Iniciar cámara
  const startCamera = useCallback(async () => {
    if (!scannerRef.current || isScanning) return;
    setError(null);
    setSuccess(null);
    setIsScanning(true);
    try {
      const tempScanner = new Html5Qrcode(scannerRef.current.id);
      setScanner(tempScanner);
      // Configuración del escáner: qrbox dinámico para mejor detección de QR de diferentes tamaños
      const containerWidth = scannerRef.current.offsetWidth;
      const qrboxSize = Math.max(200, Math.min(containerWidth * 0.8, 400)); // Entre 200-400px, 80% del contenedor
      await tempScanner.start(
        { facingMode: "environment" }, // Usa la cámara trasera
        { fps: 10, qrbox: qrboxSize }, // qrbox ajustado para tamaño y forma cuadrada
        async (decodedText) => {
          await handleScan(decodedText);
        },
        (err) => {
          console.warn("Error QR:", err);
          setError("Error al escanear el código QR. Inténtalo de nuevo.");
        }
      );
    } catch (err) {
      console.error("Error al iniciar la cámara:", err);
      setError("No se pudo acceder a la cámara. Verifica los permisos.");
      setIsScanning(false);
    }
  }, [isScanning]);

  // Detener cámara
  const stopCamera = useCallback(async () => {
    if (!scanner) return;

    try {
      await scanner.stop();
      await scanner.clear();
    } catch (err) {
      console.warn("Error al detener la cámara:", err);
    } finally {
      setScanner(null);
      setIsScanning(false);
    }
  }, [scanner]);

  // Escanear imagen
  const scanImage = useCallback(async (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Por favor, selecciona un archivo de imagen válido.");
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoadingProduct(true);

    const tempScanner = new Html5Qrcode(scannerRef.current!.id);
    try {
      // Cambiar showImage a false para evitar modificar el DOM del div #reader, lo que podría causar conflictos en escaneos posteriores
      const decodedText = await tempScanner.scanFile(file, false);
      await handleScan(decodedText);
    } catch (err) {
      console.warn("Error QR desde imagen:", err);
      setError("No se pudo leer el código QR de la imagen. Verifica el archivo.");
    } finally {
      try {
        await tempScanner.clear();
      } catch (err) {
        console.warn("Error limpiando scanner:", err);
      }
      setIsLoadingProduct(false);
    }
  }, []);

  // Manejar el resultado del escaneo
  const handleScan = useCallback(async (sku: string) => {
    if (!sku.trim()) {
      setError("Código QR inválido o vacío.");
      return;
    }

    setIsLoadingProduct(true);
    await fetchProductBySku(sku);
    setIsLoadingProduct(false);
    if (scanner) await stopCamera(); // Detener solo si estaba escaneando desde cámara
  }, [scanner, stopCamera]);

  // Fetch product por SKU
  const fetchProductBySku = useCallback(async (sku: string) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("sku", sku)
        .single();

      if (error || !data) {
        setError("Producto no encontrado.");
        return;
      }

      // Convertir a Product manualmente
      const productData: Product = {
        id: data.id,
        sku: data.sku,
        name: data.name,
        brand: data.brand ?? null,
        price: data.price ?? null,
        description: data.description ?? null,
        total_stock: data.total_stock,
        variants: [],
      };

      // Traer variantes
      const { data: variantsData } = await supabase
        .from("size_stock")
        .select("id, quantity, sizes(code)")
        .eq("product_id", productData.id);

      const variants: Variant[] =
        variantsData?.map((v: any) => ({
          id: v.id,
          size: v.sizes?.code ?? "N/A",
          stock: v.quantity,
        })) ?? [];

      setProduct({ ...productData, variants });
      setSuccess("Producto encontrado exitosamente.");
    } catch (err) {
      console.error("Error al buscar producto:", err);
      setError("Error al buscar el producto. Inténtalo de nuevo.");
    }
  }, []);

  return (
    <div className="flex flex-col w-full items-center justify-center gap-6 p-6 bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-xl h-full">
      {/* Header con instrucciones */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Escáner de Productos</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Escanea el código QR de un producto para ver sus detalles y gestionar el inventario.
        </p>
      </div>

      {/* Área de escaneo con marco visual */}
      <div className="relative w-full max-w-sm mx-auto">
        <div
          id="reader"
          ref={scannerRef}
          className={`w-full h-64 border-2 rounded-xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden transition-all duration-300 ${
            isScanning
              ? "border-blue-500 shadow-blue-200 animate-pulse"
              : "border-gray-300 dark:border-gray-600"
          }`}
          aria-label="Área de escaneo QR"
        />

        {/* Visor de QR con esquinas y líneas guía (solo durante escaneo) */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Esquinas superiores */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-blue-500 rounded-tl-lg animate-pulse"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-blue-500 rounded-tr-lg animate-pulse"></div>
            {/* Esquinas inferiores */}
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-blue-500 rounded-bl-lg animate-pulse"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-blue-500 rounded-br-lg animate-pulse"></div>
            {/* Líneas guía horizontales y verticales */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-0.5 bg-blue-500 opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0.5 h-3/4 bg-blue-500 opacity-50"></div>
          </div>
        )}

        {/* Placeholder cuando no está escaneando */}
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 bg-opacity-80 rounded-xl">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg
                className="w-12 h-12 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {/* Ícono de QR code simplificado */}
                <rect x="3" y="3" width="5" height="5" rx="1" />
                <rect x="16" y="3" width="5" height="5" rx="1" />
                <rect x="3" y="16" width="5" height="5" rx="1" />
                <rect x="16" y="16" width="5" height="5" rx="1" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
              <p className="text-sm">Inicia el escaneo para comenzar</p>
            </div>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={startCamera}
          disabled={isScanning}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
          aria-label="Iniciar escaneo con cámara"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {isScanning ? "Escaneando..." : "Escanear"}
        </button>

        <label className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg shadow-md cursor-pointer transition-all duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Subir Imagen</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                scanImage(e.target.files[0]);
                // Resetear el input para permitir seleccionar el mismo archivo nuevamente si es necesario
                e.target.value = '';
              }
            }}
            className="hidden"
            aria-label="Seleccionar imagen para escanear QR"
          />
        </label>

        {scanner && (
          <button
            onClick={stopCamera}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
            aria-label="Detener escaneo de cámara"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10h6m-6 4h6" />
            </svg>
            Detener Cámara
          </button>
        )}
      </div>

      {/* Indicadores de carga y mensajes */}
      {isLoadingProduct && (
        <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-4 py-2 rounded-lg shadow-sm">
          <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Buscando producto...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 px-4 py-2 rounded-lg shadow-sm animate-fade-in" role="alert">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 px-4 py-2 rounded-lg shadow-sm animate-fade-in" role="status">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </div>
      )}

      {/* Modal del producto */}
      {product && (
        <ProductScanModal
          product={product}
          onClose={() => {
            setProduct(null);
            setSuccess(null);
            setError(null);
          }}
        />
      )}
    </div>
  );
}