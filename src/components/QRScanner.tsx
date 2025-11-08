"use client";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function QRScanner() {
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        console.log("Código detectado:", decodedText);

        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("sku", decodedText)
          .single();

        if (error || !data) {
          alert("Producto no encontrado.");
        } else {
          alert(`Producto encontrado: ${data.name}`);
          router.push(`/product/${decodedText}`);
        }
      },
      (errorMessage) => {
        console.warn("Error de escaneo:", errorMessage);
      }
    );

    return () => {
      scanner.clear().catch((err) => console.error("Error al limpiar scanner:", err));
    };
  }, [router]);

  return <div id="reader" className="w-full max-w-sm mx-auto" />;
}