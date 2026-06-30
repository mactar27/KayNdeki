import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Poppins, Pacifico } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart/cart-provider"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Toaster } from "@/components/ui/sonner"
import { LanguageProvider } from "@/components/providers/language-provider"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
})

export const metadata: Metadata = {
  title: "Kay ndeki — Ton petit déjeuner sur-mesure, livré à Dakar",
  description:
    "Compose ton petit déjeuner sénégalais : sandwich, ingrédients, sauce et boisson au choix. Livraison rapide ou click & collect. Paiement Wave, Orange Money ou à la livraison.",
  generator: "v0.app",
  icons: {
    icon: "/kay-ndeki-logo.jpeg",
    apple: "/kay-ndeki-logo.jpeg",
  },
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#1f4fcf",
  width: "device-width",
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`light ${poppins.variable} ${pacifico.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <LanguageProvider>
          <CartProvider>
            <div className="flex min-h-dvh flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </CartProvider>
          <Toaster position="top-center" richColors />
          {process.env.NODE_ENV === "production" && <Analytics />}
        </LanguageProvider>
      </body>
    </html>
  )
}
