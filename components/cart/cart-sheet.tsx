"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { useCart } from "./cart-provider"
import { formatFCFA } from "@/lib/menu-data"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function CartButton() {
  const { count, subtotal } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={`${buttonVariants({ variant: "outline" })} gap-2 rounded-full border-primary/20 bg-card font-semibold text-primary shadow-sm`}
        aria-label={`Voir le panier, ${count} article${count > 1 ? "s" : ""}`}
      >
          <span className="relative">
            <ShoppingCart className="size-4" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-price text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </span>
          <span className="hidden sm:inline">{formatFCFA(subtotal)}</span>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-primary">Ton panier</SheetTitle>
        </SheetHeader>
        <CartContents onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

function CartContents({ onClose }: { onClose: () => void }) {
  const { items, subtotal, removeItem, setQty } = useCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
          <ShoppingCart className="size-7 text-primary" />
        </div>
        <p className="font-medium text-foreground">Ton panier est vide</p>
        <p className="text-sm text-muted-foreground">
          Compose ton petit déjeuner et ajoute tes produits préférés.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 space-y-3 overflow-y-auto px-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate font-semibold text-foreground">{item.name}</p>
                <button
                  onClick={() => removeItem(item.key)}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                  aria-label={`Retirer ${item.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              {item.details && (
                <p className="line-clamp-2 text-xs text-muted-foreground">{item.details}</p>
              )}
              <div className="mt-auto flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 rounded-full border border-border">
                  <button
                    onClick={() => setQty(item.key, item.qty - 1)}
                    className="flex size-7 items-center justify-center rounded-full text-foreground hover:bg-secondary"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.key, item.qty + 1)}
                    className="flex size-7 items-center justify-center rounded-full text-foreground hover:bg-secondary"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <span className="font-bold text-price">{formatFCFA(item.price * item.qty)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-muted-foreground">Sous-total</span>
          <span className="text-lg font-bold text-foreground">{formatFCFA(subtotal)}</span>
        </div>
        <Link 
          href="/commande" 
          onClick={onClose}
          className={`${buttonVariants({ variant: "default" })} h-12 w-full rounded-full text-base font-semibold flex items-center justify-center`}
        >
          Valider ma commande
        </Link>
      </div>
    </>
  )
}
