import Header from "@/components/Header";
import ProductList from "@/components/ProductList";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 px-4 md:px-6 lg:px-8 pt-20 md:pt-24 pb-20">
        <div className="max-w-7xl mx-auto">
          <ProductList />
        </div>
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 text-center py-3 md:py-4 text-xs md:text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 z-10">
        <p>&copy; 2025 J&Y Store. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}