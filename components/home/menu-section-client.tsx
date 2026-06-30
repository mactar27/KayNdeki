"use client"

import { useState } from "react"
import { type MenuItem } from "@/lib/menu-data"
import { MenuCard } from "./menu-card"
import { MenuBanner } from "./menu-banner"
import { ArrowRight } from "lucide-react"
import { DrinkPicker } from "@/components/commande/drink-picker"

export function MenuSectionClient({ items }: { items: MenuItem[] }) {
  const sandwiches = items.filter(i => i.category === "sandwich")
  const drinks = items.filter(i => i.category === "drink")
  const [isDrinkPickerOpen, setIsDrinkPickerOpen] = useState(false)

  return (
    <section id="menu" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Nos Sandwichs</h2>
          <button className="text-sm font-semibold text-[#1A56DB] flex items-center gap-1 hover:underline">
            Voir tous les produits <ArrowRight className="size-4" />
          </button>
        </div>

        {/* Grid: sandwiches + banner card */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sandwiches.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
          {/* Banner opens the DrinkPicker */}
          <MenuBanner onDiscover={() => setIsDrinkPickerOpen(true)} />
        </div>

      </div>

      {/* Drink picker popup */}
      {isDrinkPickerOpen && (
        <DrinkPicker
          drinks={drinks}
          onClose={() => setIsDrinkPickerOpen(false)}
        />
      )}
    </section>
  )
}
