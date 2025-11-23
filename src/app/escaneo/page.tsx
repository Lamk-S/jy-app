import Header from "@/components/Header";
import QRScannerWithModal from "@/components/QRScannerWithModal";
import CartButton from "@/components/CartButton";

export default function EscaneoPage() {
  return (
    <div className="h-screen flex flex-col bg-blue-50 dark:bg-gray-900 overflow-hidden"> {/* Cambiado a h-screen y overflow-hidden para no scroll */}
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 md:px-6 lg:px-8 pb-20 pt-6">
        <QRScannerWithModal />
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 text-center py-3 md:py-4 text-xs md:text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 z-20">
        <p>&copy; 2025 J&Y Store. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}