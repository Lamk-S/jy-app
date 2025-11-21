import ClientLayout from "@/components/ClientLayout";
import ThemeProvider from "@/components/ThemeProvider"; // Nuevo
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider> {/* Envuelve todo */}
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}