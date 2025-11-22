import ClientLayout from "@/components/ClientLayout";
import ThemeProvider from "@/components/ThemeProvider";
import FullScreenLoader from "@/components/FullScreenLoader";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <FullScreenLoader />
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}