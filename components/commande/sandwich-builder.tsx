"use client"

import { useState } from "react"
import { INGREDIENTS, INGREDIENT_CATEGORIES, Ingredient } from "@/lib/ingredients"
import { useCart } from "@/components/cart/cart-provider"
import { X, Check, Plus, Minus } from "lucide-react"
import { toast } from "sonner"

interface SandwichBuilderProps {
  isOpen: boolean
  onClose: () => void
  isInline?: boolean
}

export function SandwichBuilder({ isOpen, onClose, isInline = false }: SandwichBuilderProps) {
  const { addItem } = useCart()
  
  // State for selected ingredients (array of IDs)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)

  if (!isOpen) return null

  const toggleIngredient = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // Calculate total price
  const basePrice = 200 // default base price or derived from selected base
  const ingredientsPrice = selectedIds.reduce((sum, id) => {
    const ing = INGREDIENTS.find(i => i.id === id)
    return sum + (ing?.price || 0)
  }, 0)
  
  const selectedSaucesCount = selectedIds.filter(id => {
    return INGREDIENTS.find(i => i.id === id)?.category === "sauces"
  }).length
  const extraSaucePrice = selectedSaucesCount > 2 ? (selectedSaucesCount - 2) * 100 : 0

  // Si on a sélectionné un pain (base), on ne compte pas le 200 par défaut si le prix du pain est déjà dedans,
  // ou on dit que le sandwich de base est 0 et on force à choisir un pain. Faisons ça :
  const hasBase = selectedIds.some(id => INGREDIENTS.find(i => i.id === id)?.category === "base")
  const totalPrice = (ingredientsPrice + extraSaucePrice + (hasBase ? 0 : basePrice)) * quantity

  const handleAddToCart = () => {
    const selected = selectedIds.map(id => INGREDIENTS.find(i => i.id === id)!).filter(Boolean)
    
    // Create a custom product for the cart (shaped as CartItem, not MenuItem)
    const customProduct = {
      key: `custom-${Date.now()}`,
      name: "Sandwich Sur-Mesure",
      details: selected.map(i => i.name).join(", "),
      price: totalPrice / quantity,
      image: "/products/ingredients.png",
    }

    addItem(customProduct, quantity)
    toast.success("Sandwich personnalisé ajouté au panier !")
    if (!isInline) onClose()
    
    // Reset state
    setSelectedIds([])
    setQuantity(1)
  }

  // Group ingredients by category
  const groupedIngredients = INGREDIENTS.reduce((acc, ing) => {
    if (!acc[ing.category]) acc[ing.category] = []
    acc[ing.category].push(ing)
    return acc
  }, {} as Record<string, Ingredient[]>)

  const content = (
    <div className={`flex flex-col overflow-hidden bg-white ${isInline ? 'w-full h-auto' : 'h-[90vh] w-full max-w-2xl rounded-3xl shadow-2xl'}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Compose ton sandwich</h2>
          <p className="text-sm text-slate-500">Choisis tes ingrédients préférés</p>
        </div>
        {!isInline && (
          <button 
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {Object.entries(INGREDIENT_CATEGORIES).map(([catKey, catLabel]) => {
            const items = groupedIngredients[catKey]
            if (!items?.length) return null

            return (
              <div key={catKey}>
                <h3 className="mb-4 text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                  {catLabel}
                  {catKey === "sauces" && (
                    <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                      2 gratuites, puis +100 FCFA
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {items.map((ing) => {
                    const isSelected = selectedIds.includes(ing.id)
                    const isExtraSauce = ing.category === "sauces" && !isSelected && selectedSaucesCount >= 2
                    const displayPrice = isExtraSauce ? 100 : ing.price

                    return (
                      <button
                        key={ing.id}
                        onClick={() => toggleIngredient(ing.id)}
                        className={`flex flex-col items-start justify-between rounded-xl border p-3 text-left transition-all ${
                          isSelected 
                            ? "border-primary bg-primary/5 ring-1 ring-primary" 
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex w-full items-center justify-between mb-2">
                          <span className={`font-semibold ${isSelected ? "text-primary" : "text-slate-700"}`}>
                            {ing.name}
                          </span>
                          <div className={`flex size-5 items-center justify-center rounded-full border ${isSelected ? "bg-primary border-primary text-white" : "border-slate-300"}`}>
                            {isSelected && <Check className="size-3" />}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {displayPrice === 0 ? "Gratuit" : `+ ${displayPrice} FCFA`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex items-center rounded-full border border-slate-200 bg-white p-1">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="flex size-8 items-center justify-center rounded-full hover:bg-slate-100"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="flex size-8 items-center justify-center rounded-full hover:bg-slate-100"
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <div className="flex-1 sm:hidden" />
              <div className="text-right sm:text-left">
                <p className="text-sm text-slate-500 font-medium">Total</p>
                <p className="text-xl font-bold text-primary">{totalPrice} FCFA</p>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto rounded-full bg-primary px-8 py-3.5 font-bold text-white shadow-lg shadow-primary/30 transition hover:scale-105 active:scale-95 disabled:opacity-50"
              disabled={selectedIds.length === 0}
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
  )

  if (isInline) {
    return content
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      {content}
    </div>
  )
}
