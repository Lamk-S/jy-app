import Header from "@/components/Header";
import CartButton from "@/components/CartButton";
// Importa componentes para mostrar productos (crea uno si no existe, e.g., ProductList)

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Main con padding para header y footer */}
      <main className="flex-1 p-6 pt-24 pb-20 bg-gray-50"> {/* Ajusta pt para header fijo */}
        {/* Aquí agrega componentes para mostrar productos, e.g., <ProductList /> */}
        <h2 className="text-3xl font-bold text-center mb-6">Nuestra Variedad de Productos</h2>
        {/* Lista de productos con precios, como en una tienda */}
        {/* Ejemplo: <ProductGrid products={products} /> */}
      </main>
      
      {/* CartButton flotante */}
      <div className="fixed bottom-16 right-4 z-30">
        <CartButton />
      </div>
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 text-center py-4 text-sm text-gray-600 border-t z-10">
        <p>&copy; 2025 J&Y Store. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}