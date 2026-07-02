"use client"

import { useState } from "react"
import { type MenuItem } from "@/lib/menu-data"
import { MenuCard } from "./menu-card"
import { Sandwich, CupSoda, ChefHat, Package } from "lucide-react"
import { SandwichBuilder } from "@/components/commande/sandwich-builder"

export function MenuSectionClient({ items }: { items: MenuItem[] }) {
  const [activeTab, setActiveTab] = useState<"box" | "sandwichs" | "boissons" | "surmesure">("box")
  
  const boxes = items.filter(i => i.category === "box")
  const sandwiches = items.filter(i => i.category === "sandwich")
  const drinks = items.filter(i => i.category === "drink")

  return (
    <section id="menu" className="pt-8 pb-16 md:pt-12 md:pb-24 bg-transparent">
      <div className="mx-auto max-w-6xl px-4">

        <div className="text-center mb-8 px-2">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-script text-[#1A56DB] mb-3">
            Choisis ton petit déjeuner idéal
          </h2>
          <p className="text-slate-500 text-base sm:text-lg">
            pour bien commencer ta journée !
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap justify-center rounded-3xl sm:rounded-full bg-slate-100 p-1.5 shadow-inner gap-1 sm:gap-0">
            <button
              onClick={() => setActiveTab("box")}
              className={`flex items-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all ${
                activeTab === "box"
                  ? "bg-[#1A56DB] text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Package className="size-4 sm:size-5" />
              La Box
            </button>
            <button
              onClick={() => setActiveTab("sandwichs")}
              className={`flex items-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all ${
                activeTab === "sandwichs"
                  ? "bg-[#1A56DB] text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Sandwich className="size-4 sm:size-5" />
              Nos Sandwichs
            </button>
            <button
              onClick={() => setActiveTab("boissons")}
              className={`flex items-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all ${
                activeTab === "boissons"
                  ? "bg-[#1A56DB] text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <CupSoda className="size-4 sm:size-5" />
              Nos Boissons
            </button>
            <button
              onClick={() => setActiveTab("surmesure")}
              className={`flex items-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all ${
                activeTab === "surmesure"
                  ? "bg-[#1A56DB] text-white shadow-md"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <ChefHat className="size-4 sm:size-5" />
              Sur Mesure
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="animate-in fade-in duration-500">
          
          {/* Tab: Sandwichs */}
          {activeTab === "sandwichs" && (
            <div className="flex flex-col gap-6 bg-sky-50 p-6 rounded-3xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sandwiches.map((item) => (
                  <MenuCard key={item.id} item={item} allItems={items} />
                ))}
              </div>
            </div>
          )}

          {/* Tab: La Box */}
          {activeTab === "box" && (
            <div className="flex flex-col gap-6 bg-sky-50 p-6 rounded-3xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {boxes.map((item) => (
                  <MenuCard key={item.id} item={item} allItems={items} />
                ))}
              </div>
            </div>
          )}

          {/* Tab: Boissons */}
          {activeTab === "boissons" && (
            <div className="flex flex-col gap-6 bg-sky-50 p-6 rounded-3xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {drinks.map((item) => (
                  <MenuCard key={item.id} item={item} allItems={items} isDrink={true} />
                ))}
              </div>
            </div>
          )}

          {/* Tab: Sur Mesure */}
          {activeTab === "surmesure" && (
            <div className="flex justify-center">
              <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <SandwichBuilder isOpen={true} onClose={() => setActiveTab("sandwichs")} isInline={true} />
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}
