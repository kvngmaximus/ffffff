"use client"
import Link from "next/link"
import { Heart, ShoppingCart, Search, User, Menu } from "lucide-react"
import { useWishlist } from "@/context/wishlist"
import { useCart } from "@/context/cart"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/auth"

export default function Header() {
  const { count: wishlistCount } = useWishlist()
  const { count: cartCount } = useCart()
  const { user, profile } = useAuth()
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger className="md:hidden" aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 grid gap-3 text-sm">
                <Link href="/shop">Shop</Link>
                <Link href="/new">New</Link>
                <Link href="/best">Best</Link>
                <Link href="/deals">Top Deals</Link>
                <Link href="/brands">Brands</Link>
                <Link href="/categories">Categories</Link>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="font-semibold text-xl text-neutral-900">Beautify.</Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-neutral-700">
            <Link href="/new" className="hover:text-neutral-900">New</Link>
            <Link href="/best" className="hover:text-neutral-900">Best</Link>
            <Link href="/deals" className="hover:text-neutral-900">Top Deals</Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm hover:text-neutral-900">Categories</DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild><Link href="/shop?category=cleanser">Cleanser</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/shop?category=moisturizer">Moisturizer</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/shop?category=serum">Serum</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/shop?category=sunscreen">Sunscreen</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/brands" className="hover:text-neutral-900">Brands</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-[#1C1C1C]">
          <button aria-label="Search"><Search className="h-5 w-5" /></button>
          <Link href="/wishlist" className="relative inline-flex items-center" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            <span suppressHydrationWarning className="absolute -top-2 -right-2 text-xs bg-black text-white rounded-full px-1">{wishlistCount}</span>
          </Link>
          <Link href="/cart" className="relative inline-flex items-center" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            <span suppressHydrationWarning className="absolute -top-2 -right-2 text-xs bg-emerald-600 text-white rounded-full px-1">{cartCount}</span>
          </Link>
          {profile?.user_type === "admin" ? (
            <Link href="/admin" aria-label="Admin"><User className="h-5 w-5" /></Link>
          ) : (
            <Link href={user ? "/profile" : "/auth"} aria-label="Account"><User className="h-5 w-5" /></Link>
          )}
        </div>
      </div>
    </header>
  )
}