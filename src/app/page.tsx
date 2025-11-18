import QRScannerWithModal from "@/components/QRScannerWithModal";
import CartButton from "@/components/CartButton";

export default function HomePage() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">J&Y Store</h1>
      <QRScannerWithModal />
      <CartButton />
    </main>
  );
}