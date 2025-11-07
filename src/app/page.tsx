import QRScanner from "@/components/QRScanner";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Escanear código QR</h1>
      <QRScanner />
    </main>
  );
}