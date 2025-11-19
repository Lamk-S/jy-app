import Header from "@/components/Header";

export default function NosotrosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-6 pt-24 pb-20 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Sobre Nosotros</h2>
          <p className="text-lg text-gray-700 mb-4">
            J&Y Store es una tienda dedicada a ofrecer productos de calidad con un enfoque en la satisfacción del cliente. 
            Nuestro equipo se esfuerza por proporcionar una experiencia de compra excepcional.
          </p>
          {/* Agrega más detalles: historia, misión, contacto, etc. */}
        </div>
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 text-center py-4 text-sm text-gray-600 border-t z-10">
        <p>&copy; 2025 J&Y Store. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}