import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { fetchGlobalSettings, fetchCategories } from "@/lib/api";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchGlobalSettings();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cinaris.vercel.app";

  return {
    metadataBase: new URL(siteUrl),
    // EL TÍTULO DE LA PESTAÑA DEL NAVEGADOR ESTÁ AQUÍ:
    // Si quieres forzar un título, borra todo lo que está después de los dos puntos y pon tu texto entre comillas.
    // Ejemplo: title: "Cinaris - Películas",
    title: settings?.seo_title || settings?.platform_name || "Plataforma de Películas",

    // LA DESCRIPCIÓN ESTÁ AQUÍ:
    description: settings?.seo_description || settings?.platform_description || "Disfruta del mejor catálogo de películas.",
    keywords: settings?.seo_keywords || "cine, peliculas",
    openGraph: {
      images: settings?.seo_og_image ? [settings.seo_og_image] : [],
    },
    icons: {
      icon: settings?.favicon_url || "/icono.png",
      shortcut: "/icono.png",
      apple: "/icono.png",
    },
    robots: settings?.seo_robots || "index, follow",
    alternates: {
      canonical: settings?.seo_canonical_url || undefined,
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchGlobalSettings();
  const categories = await fetchCategories();
  const isMaintenance = settings?.maintenance_mode === true;

  return (
    <html lang={settings?.language || "es"} className={`${inter.className} h-full antialiased dark`}>
      <head>
        {settings?.google_analytics_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.google_analytics_id}');
              `}
            </Script>
          </>
        )}
        {settings?.favicon_url && <link rel="icon" href={settings.favicon_url} />}
        {settings && (
          <style dangerouslySetInnerHTML={{
            __html: `
            :root {
              --background: ${settings.color_background || '#080B12'};
              --primary: ${settings.color_primary || '#7C3AED'};
              --primary-hover: color-mix(in srgb, ${settings.color_primary || '#7C3AED'} 80%, white);
            }
          `}} />
        )}
      </head>
      <body className="min-h-full bg-background text-foreground flex flex-col">
        {isMaintenance ? (
          <div className="w-full flex-1 flex flex-col items-center justify-center min-h-screen text-center px-4 max-w-4xl mx-auto">
            {settings?.logo_url && (
              <img src={settings.logo_url} alt="Logo" className="h-16 mb-8 object-contain" />
            )}
            <h1 className="text-4xl font-bold mb-4 text-white">En Mantenimiento</h1>
            <p className="text-xl text-text-secondary max-w-2xl">
              {settings?.maintenance_message || "Estamos realizando tareas de mantenimiento. Volveremos pronto."}
            </p>
          </div>
        ) : (
          <>
            <Header logoUrl={settings?.logo_url} categories={categories} />
            <div className="w-full flex-1 flex flex-col">
              {children}
            </div>
            <Footer logoUrl={settings?.logo_url} />
          </>
        )}
      </body>
    </html>
  );
}
