"use client"

import { useState } from "react"
import { useCart } from "@/components/cart/cart-provider"
import { X, Check } from "lucide-react"
import { toast } from "sonner"
import type { MenuItem } from "@/lib/menu-data"
import { getItemsByCategory } from "@/lib/menu-data"
import { Button } from "@/components/ui/button"

export function BoxCustomizer({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  const { addItem } = useCart()
  const [selectedSandwich, setSelectedSandwich] = useState<string>("")
  const [selectedDrink, setSelectedDrink] = useState<string>("")
  
  const sandwiches = getItemsByCategory("sandwich")
  const drinks = getItemsByCategory("drink")

  const handleAddToCart = () => {
    if (!selectedSandwich || !selectedDrink) {
      toast.error("Veuillez choisir un sandwich et une boisson")
      return
    }

    const sandwich = sandwiches.find(s => s.id === selectedSandwich)
    const drink = drinks.find(d => d.id === selectedDrink)

    addItem(
      {
        key: `box-${Date.now()}`,
        name: "La Box Kay Ndeki",
        details: `Avec ${sandwich?.name} et ${drink?.name}`,
        price: item.price,
        image: item.image,
      },
      1
    )
    toast.success("Box ajoutée au panier !")
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between border-b border-slate-100 p-4 shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Personnaliser ta Box</h2>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 mb-3">1. Quel sandwich ?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sandwiches.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSandwich(s.id)}
                  className={`flex flex-col items-start p-3 border rounded-xl transition-all ${selectedSandwich === s.id ? 'border-[#1A56DB] bg-blue-50/50 ring-1 ring-[#1A56DB]' : 'border-slate-200 hover:border-blue-300'}`}
                >
                  <span className="font-semibold text-sm">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-3">2. Quelle boisson ?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {drinks.map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDrink(d.id)}
                  className={`flex flex-col items-start p-3 border rounded-xl transition-all ${selectedDrink === d.id ? 'border-[#1A56DB] bg-blue-50/50 ring-1 ring-[#1A56DB]' : 'border-slate-200 hover:border-blue-300'}`}
                >
                  <span className="font-semibold text-sm">{d.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 p-4 shrink-0 bg-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-500">Total Box</span>
            <span className="text-lg font-bold text-[#1A56DB]">{item.price} FCFA</span>
          </div>
          <Button 
            onClick={handleAddToCart} 
            className="rounded-full px-6"
            disabled={!selectedSandwich || !selectedDrink}
          >
            <Check className="mr-2 size-4" /> Ajouter
          </Button>
        </div>
      </div>
    </div>
  )
}
