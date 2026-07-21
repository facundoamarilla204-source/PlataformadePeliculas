import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plataforma de Películas",
  description: "Disfruta del mejor catálogo de películas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.className} h-full antialiased dark`}>
      <body className="min-h-full bg-neutral-950 text-neutral-50 flex flex-col">
        {/* Contenedor principal a ancho completo */}
        <div className="w-full flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
