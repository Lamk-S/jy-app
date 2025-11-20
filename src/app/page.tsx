import Header from "@/components/Header";
import ProductList from "@/components/ProductList";
import CartButton from "@/components/CartButton";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 px-4 md:px-6 lg:px-8 pt-20 md:pt-24 pb-10"> {/* Padding responsivo */}
        <div className="max-w-7xl mx-auto">
          <ProductList />
        </div>
      </main>
      
      <div className="fixed bottom-16 right-4 md:right-6 z-30">
        <CartButton />
      </div>
      
      <footer className="bg-gray-100 text-center py-3 md:py-4 text-xs md:text-sm text-gray-600 border-t">
        <p>&copy; 2025 J&Y Store. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}