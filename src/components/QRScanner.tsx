"use client";
import { Html5QrcodeScanner } from "html5-qrcode";
import {  useEffect, useState  } from "react";

export default function QRScanner() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 }, false);

    const onScanSuccess = (decodedText: string) => {
      alert(`Código detectado: ${decodedText}`);
    };

    const onScanFailure = (error: any) => {
      console.warn("Error escaneando:", error);
    };

    scanner.render(onScanSuccess, onScanFailure);

    return () => {
      scanner.clear().catch((err) => console.error("Error limpiando scanner:", err));
    };
  }, []);

  return <div id="reader" className="w-full max-w-sm mx-auto" />;
}
