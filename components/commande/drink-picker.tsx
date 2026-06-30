"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Check, ChevronLeft } from "lucide-react"
import { type MenuItem, formatFCFA } from "@/lib/menu-data"
import { useCart } from "@/components/cart/cart-provider"
import { toast } from "sonner"

interface DrinkPickerProps {
  drinks: MenuItem[]
  onClose: () => void
}

// Sub-options for certain drinks
const DRINK_SUBOPTIONS: Record<string, { label: string; icon: string }[]> = {
  "drink-soda": [
    { label: "Coca-Cola", icon: "🥤" },
    { label: "Sprite", icon: "🟢" },
    { label: "Fanta Orange", icon: "🟠" },
    { label: "Fanta Citron", icon: "🟡" },
    { label: "Schweppes", icon: "🫧" },
    { label: "Vimto", icon: "🍇" },
  ],
  "drink-cafe": [
    { label: "Avec sucre", icon: "🍬" },
    { label: "Sans sucre", icon: "☕" },
    { label: "Avec lait", icon: "🥛" },
    { label: "Avec lait + sucre", icon: "🍮" },
  ],
  "drink-the": [
    { label: "Avec sucre", icon: "🍬" },
    { label: "Sans sucre", icon: "🫖" },
  ],
}

type Step = "pick-drink" | "pick-suboption"

export function DrinkPicker({ drinks, onClose }: DrinkPickerProps) {
  const { addItem } = useCart()
  const [step, setStep] = useState<Step>("pick-drink")
  const [selectedDrink, setSelectedDrink] = useState<MenuItem | null>(null)
  const [selectedSuboption, setSelectedSuboption] = useState<string | null>(null)

  const suboptions = selectedDrink ? DRINK_SUBOPTIONS[selectedDrink.id] : null

  const handleSelectDrink = (drink: MenuItem) => {
    setSelectedDrink(drink)
    setSelectedSuboption(null)
    // If this drink has sub-options, go to step 2
    if (DRINK_SUBOPTIONS[drink.id]) {
      setStep("pick-suboption")
    }
  }

  const handleAdd = () => {
    if (!selectedDrink) return

    const detail = selectedSuboption ?? undefined
    addItem({
      key: `${selectedDrink.id}-${Date.now()}`,
      name: selectedDrink.name,
      details: detail,
      price: selectedDrink.price,
      image: selectedDrink.image,
    })
    toast.success(
      `${selectedDrink.name}${detail ? ` (${detail})` : ""} ajouté au panier !`
    )
    onClose()
  }

  const canAdd =
    selectedDrink &&
    (suboptions === null || selectedSuboption !== null || step === "pick-drink")

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl max-h-[90vh] animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300">

        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-slate-100">
          {step === "pick-suboption" && (
            <button
              onClick={() => { setStep("pick-drink"); setSelectedSuboption(null) }}
              className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition shrink-0"
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            {step === "pick-drink" ? (
              <>
                <h2 className="text-lg font-bold text-slate-800">Choisis ta boisson 🥤</h2>
                <p className="text-sm text-slate-400">Ajoute une boisson à ton repas</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-slate-800">{selectedDrink?.name}</h2>
                <p className="text-sm text-slate-400">Comment tu le veux ?</p>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-slate-200 transition shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* Step 1 — Pick a drink */}
          {step === "pick-drink" && (
            <div className="grid grid-cols-2 gap-3">
              {drinks.map(drink => {
                const isSelected = selectedDrink?.id === drink.id
                const hasSuboptions = !!DRINK_SUBOPTIONS[drink.id]
                return (
                  <button
                    key={drink.id}
                    onClick={() => handleSelectDrink(drink)}
                    className={`flex flex-col overflow-hidden rounded-2xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-[#1A56DB] shadow-md shadow-blue-100"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="relative aspect-square w-full bg-slate-50">
                      <Image
                        src={drink.image || "/placeholder.svg"}
                        alt={drink.name}
                        fill
                        className="object-cover"
                      />
                      {isSelected && !hasSuboptions && (
                        <div className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-[#1A56DB]">
                          <Check className="size-3.5 text-white stroke-[3]" />
                        </div>
                      )}
                      {hasSuboptions && (
                        <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                          Choisir →
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className={`font-semibold text-sm leading-tight ${isSelected ? "text-[#1A56DB]" : "text-slate-800"}`}>
                        {drink.name}
                      </p>
                      <p className="font-bold text-sm mt-1 text-[#1A56DB]">
                        {formatFCFA(drink.price)}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Step 2 — Pick a sub-option */}
          {step === "pick-suboption" && suboptions && (
            <div className="space-y-3">
              {/* Show selected drink at top */}
              {selectedDrink && (
                <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-3 mb-5">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-white">
                    <Image
                      src={selectedDrink.image || "/placeholder.svg"}
                      alt={selectedDrink.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{selectedDrink.name}</p>
                    <p className="text-xs text-slate-500">Personnalise ta commande</p>
                  </div>
                  <span className="ml-auto font-bold text-[#1A56DB]">{formatFCFA(selectedDrink.price)}</span>
                </div>
              )}

              {suboptions.map(opt => {
                const isSelected = selectedSuboption === opt.label
                return (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedSuboption(opt.label)}
                    className={`w-full flex items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left transition-all ${
                      isSelected
                        ? "border-[#1A56DB] bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className={`font-semibold text-base ${isSelected ? "text-[#1A56DB]" : "text-slate-700"}`}>
                      {opt.label}
                    </span>
                    <div className={`ml-auto flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      isSelected ? "bg-[#1A56DB] border-[#1A56DB]" : "border-slate-300"
                    }`}>
                      {isSelected && <Check className="size-3.5 text-white stroke-[3]" />}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 p-5">
          <button
            onClick={handleAdd}
            disabled={!selectedDrink || (step === "pick-suboption" && !selectedSuboption)}
            className="w-full rounded-full bg-[#1A56DB] py-3.5 font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {!selectedDrink
              ? "Sélectionne une boisson"
              : step === "pick-suboption" && !selectedSuboption
              ? "Choisis une option"
              : `Ajouter · ${formatFCFA(selectedDrink.price)}`}
          </button>
        </div>

      </div>
    </div>
  )
}
