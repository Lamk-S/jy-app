import Providers from "./providers";
import "@/app/globals.css";

export const metadata = {
  title: "J&Y Store",
  description: "Sistema interno de gestión de inventario J&Y",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white shadow p-4">
              <div className="max-w-5xl mx-auto">
                <h1 className="text-lg font-bold">J&Y - Gestión de inventario</h1>
              </div>
            </header>

            <main className="max-w-5xl mx-auto p-4">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}