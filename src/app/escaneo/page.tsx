import Header from "@/components/Header";
import QRScannerWithModal from "@/components/QRScannerWithModal";
import CartButton from "@/components/CartButton";

export default function EscaneoPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="items-center justify-center">
        <QRScannerWithModal />
      </main>
      
      <div className="fixed bottom-16 right-4 z-30">
        <CartButton />
      </div>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 text-center py-4 text-sm text-gray-600 border-t z-20">
        <p>&copy; 2025 J&Y Store. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}