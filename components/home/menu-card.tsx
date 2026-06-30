"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-provider"
import { type MenuItem, formatFCFA } from "@/lib/menu-data"
import { toast } from "sonner"
import { useTranslation } from "@/components/providers/language-provider"

export function MenuCard({ item }: { item: MenuItem }) {
  const { addItem } = useCart()
  const { t, lang } = useTranslation()

  const itemName = 
    lang === "wo" && item.nameWo ? item.nameWo : 
    lang === "en" && item.nameEn ? item.nameEn : 
    item.name

  const handleAdd = () => {
    addItem({
      key: item.id,
      name: itemName,
      details: item.description,
      price: item.price,
      image: item.image,
    })
    toast.success(`${itemName} ${t("menu_add")}`)
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-video w-full bg-secondary">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={itemName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-foreground">{itemName}</h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="font-bold text-price">
            {item.price > 0 ? formatFCFA(item.price) : t("menu_free")}
          </span>
          <Button onClick={handleAdd} size="sm" className="rounded-full">
            <Plus className="mr-1 h-4 w-4" /> {t("menu_add")}
          </Button>
        </div>
      </div>
    </div>
  )
}
