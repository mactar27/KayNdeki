"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Check, Plus, Minus } from "lucide-react"
import { INGREDIENTS } from "@/lib/ingredients"
import { type MenuItem, formatFCFA } from "@/lib/menu-data"
import { useCart } from "@/components/cart/cart-provider"
import { toast } from "sonner"

interface SandwichCustomizerProps {
  item: MenuItem | null
  onClose: () => void
}

// Only show extras the client can add on top of an existing sandwich
const EXTRA_CATEGORIES = [
  {
    key: "veggies",
    label: "Crudités",
    icon: "🥗",
  },
  {
    key: "extras",
    label: "Suppléments",
    icon: "🧀",
  },
  {
    key: "sauces",
    label: "Sauces",
    icon: "🫙",
  },
]

export function SandwichCustomizer({ item, onClose }: SandwichCustomizerProps) {
  const { addItem } = useCart()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)

  if (!item) return null

  const toggle = (id: string) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )

  const extrasPrice = selectedIds.reduce((sum, id) => {
    const ing = INGREDIENTS.find((i) => i.id === id)
    return sum + (ing?.price ?? 0)
  }, 0)

  const unitPrice = item.price + extrasPrice
  const totalPrice = unitPrice * quantity

  const handleAdd = () => {
    const selected = selectedIds
      .map((id) => INGREDIENTS.find((i) => i.id === id)!)
      .filter(Boolean)

    addItem(
      {
        key: `${item.id}-${Date.now()}`,
        name: item.name,
        details:
          selected.length > 0
            ? selected.map((i) => i.name).join(", ")
            : undefined,
        price: unitPrice,
        image: item.image,
      },
      quantity
    )
    toast.success(`${item.name} ajouté au panier !`)
    onClose()
    setSelectedIds([])
    setQuantity(1)
  }

  const extraIngredients = INGREDIENTS.filter((i) =>
    ["veggies", "extras", "sauces"].includes(i.category)
  )
  const grouped = EXTRA_CATEGORIES.map((cat) => ({
    ...cat,
    ingredients: extraIngredients.filter((i) => i.category === cat.key),
  }))

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl max-h-[90vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300">

        {/* Header with sandwich info */}
        <div className="relative flex items-center gap-4 p-5 border-b border-slate-100">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-slate-800 text-lg leading-tight">{item.name}</h2>
            <p className="text-sm font-semibold text-[#1A56DB] mt-1">
              {formatFCFA(item.price)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Personnalise ton sandwich</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-slate-200 transition"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Extras list (scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {grouped.map((cat) => (
            <div key={cat.key}>
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
                <span>{cat.icon}</span> {cat.label}
              </h3>
              <div className="space-y-2">
                {cat.ingredients.map((ing) => {
                  const isSelected = selectedIds.includes(ing.id)
                  return (
                    <button
                      key={ing.id}
                      onClick={() => toggle(ing.id)}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3 border transition-all text-left ${
                        isSelected
                          ? "border-[#1A56DB] bg-blue-50 ring-1 ring-[#1A56DB]"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                            isSelected
                              ? "bg-[#1A56DB] border-[#1A56DB]"
                              : "border-slate-300"
                          }`}
                        >
                          {isSelected && <Check className="size-3 text-white stroke-[3]" />}
                        </div>
                        <span className={`font-medium text-sm ${isSelected ? "text-[#1A56DB]" : "text-slate-700"}`}>
                          {ing.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-400 shrink-0 ml-2">
                        {ing.price === 0 ? "Gratuit" : `+ ${formatFCFA(ing.price)}`}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            {/* Quantity */}
            <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex size-8 items-center justify-center rounded-full text-slate-600 hover:bg-white hover:shadow-sm transition"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center font-bold text-slate-800">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex size-8 items-center justify-center rounded-full text-slate-600 hover:bg-white hover:shadow-sm transition"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              className="flex-1 rounded-full bg-[#1A56DB] px-6 py-3 font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 hover:scale-[1.02] active:scale-95"
            >
              Ajouter · {formatFCFA(totalPrice)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
