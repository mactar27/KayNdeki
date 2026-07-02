"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet"
import { CartButton } from "@/components/cart/cart-sheet"
import { useTranslation } from "@/components/providers/language-provider"

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { lang, setLang, t } = useTranslation()

  if (pathname === '/qr') return null

  const NAV = [
    { href: "/", label: t("nav_home") },
    { href: "/menu", label: t("nav_menu") },
    { href: "/a-propos", label: t("nav_about") },
    { href: "/livraison", label: t("nav_delivery") },
    { href: "/contact", label: t("nav_contact") },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/kay-ndeki-logo.jpeg"
            alt="Kay ndeki"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
            priority
          />
          <span className="font-script text-2xl leading-none text-primary">Kay ndeki</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === item.href ? "text-primary" : "text-foreground/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Language dropdown / toggle */}
          <div className="hidden md:flex items-center bg-secondary/50 rounded-full border border-border p-1">
            <button
              onClick={() => setLang("fr")}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors ${lang === "fr" ? "bg-white text-primary shadow-sm" : "text-foreground/50 hover:text-foreground/70"}`}
            >
              FR
            </button>
            <button
              onClick={() => setLang("wo")}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors ${lang === "wo" ? "bg-white text-primary shadow-sm" : "text-foreground/50 hover:text-foreground/70"}`}
            >
              WO
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors ${lang === "en" ? "bg-white text-primary shadow-sm" : "text-foreground/50 hover:text-foreground/70"}`}
            >
              EN
            </button>
          </div>



          <CartButton />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className={`${buttonVariants({ variant: "ghost", size: "icon" })} md:hidden`} aria-label="Ouvrir le menu">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-script text-2xl text-primary">Kay ndeki</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1" aria-label="Navigation mobile">
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/90 hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                {/* Language toggle mobile */}
                <div className="flex items-center gap-2 rounded-lg px-3 py-2">
                  <span className="text-sm text-muted-foreground">Langue :</span>
                  <div className="flex gap-1 bg-secondary/50 p-1 rounded-lg">
                    <button
                      onClick={() => setLang("fr")}
                      className={`rounded px-2 py-1 text-sm font-bold transition-colors ${lang === "fr" ? "bg-primary text-white" : "text-foreground/50 hover:text-foreground"}`}
                    >
                      FR
                    </button>
                    <button
                      onClick={() => setLang("wo")}
                      className={`rounded px-2 py-1 text-sm font-bold transition-colors ${lang === "wo" ? "bg-primary text-white" : "text-foreground/50 hover:text-foreground"}`}
                    >
                      WO
                    </button>
                    <button
                      onClick={() => setLang("en")}
                      className={`rounded px-2 py-1 text-sm font-bold transition-colors ${lang === "en" ? "bg-primary text-white" : "text-foreground/50 hover:text-foreground"}`}
                    >
                      EN
                    </button>
                  </div>
                </div>
                <div className="my-2 h-px bg-border" />

              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
