"use client"

import { useState } from "react"
import { type MenuItem, type MenuCategory, CATEGORY_LABELS, CATEGORY_LABELS_WO, CATEGORY_LABELS_EN } from "@/lib/menu-data"
import { MenuCard } from "./menu-card"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "@/components/providers/language-provider"
import { MenuBanner } from "./menu-banner"

export function MenuInteractive({ items }: { items: MenuItem[] }) {
  // Group items
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)

  const categoryKeys = Object.keys(grouped) as MenuCategory[]
  const [activeCategory, setActiveCategory] = useState<MenuCategory | null>(categoryKeys.length === 1 ? categoryKeys[0] : null)
  const { t, lang } = useTranslation()

  const categoryOrder: MenuCategory[] = categoryKeys

  // View: Category List
  if (!activeCategory) {
    return (
      <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categoryOrder.map((category) => {
            const count = grouped[category]?.length || 0
            if (count === 0) return null

            // Find first image as category cover
            const coverImage = grouped[category][0]?.image || "/placeholder.svg"
            const categoryName = 
              lang === "wo" ? CATEGORY_LABELS_WO[category] : 
              lang === "en" ? CATEGORY_LABELS_EN[category] : 
              CATEGORY_LABELS[category]

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="group relative flex h-40 flex-col justify-end overflow-hidden rounded-2xl bg-secondary text-left shadow-sm transition-transform hover:scale-[1.02]"
              >
                {/* Image d'arrière-plan ou illustration */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url(${coverImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity group-hover:opacity-90" />
                
                <div className="relative z-10 flex items-center justify-between p-5">
                  <div>
                    <h3 className="text-xl font-bold text-white">{categoryName}</h3>
                    <p className="text-sm font-medium text-white/80">{count} {count > 1 ? "produits" : "produit"}</p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <ChevronRight className="size-5 text-white" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
        <MenuBanner onDiscover={() => setActiveCategory("drink")} />
      </>
    )
  }

  // View: Products in selected category
  const categoryItems = grouped[activeCategory] || []

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      {categoryKeys.length > 1 && (
        <button
          onClick={() => setActiveCategory(null)}
          className="inline-flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="size-4" />
          {t("menu_back")}
        </button>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">
          {lang === "wo" ? CATEGORY_LABELS_WO[activeCategory] : 
           lang === "en" ? CATEGORY_LABELS_EN[activeCategory] : 
           CATEGORY_LABELS[activeCategory]}
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categoryItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
