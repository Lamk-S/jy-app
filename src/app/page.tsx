import QRScannerWithModal from "@/components/QRScannerWithModal";
import CartButton from "@/components/CartButton";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header fijo en la parte superior */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-20 p-4">
        <h1 className="text-xl font-bold">J&Y Store</h1>
      </header>

      {/* Main con padding para no solaparse con header y footer */}
      <main className="flex-1 p-4 pt-20 pb-20"> {/* pt-20 para header, pb-20 para footer */}
        <QRScannerWithModal />
      </main>

      {/* CartButton flotante encima del footer */}
      <div className="fixed bottom-16 right-4 z-30"> {/* Ajusta la posición según necesites */}
        <CartButton />
      </div>

      {/* Footer fijo en la parte inferior */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 text-center py-4 text-sm text-gray-600 border-t z-10">
        <p>&copy; 2025 J&Y Store. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}