import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { WishlistProvider } from "@/context/wishlist"
import { CartProvider } from "@/context/cart"
import { AuthProvider } from "@/context/auth"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Beautify — Cosmetics Store",
  description: "Minimal yet sophisticated cosmetics store",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>        
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              {children}
              <Footer />
              <Toaster richColors />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
