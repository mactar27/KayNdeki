"use client"

import { useState } from "react"
import { LayoutDashboard, ShoppingBag, ListOrdered, FlaskConical } from "lucide-react"
import { OverviewTab } from "./overview-tab"
import { OrdersTab } from "./orders-tab"
import { ProductsTab } from "./products-tab"
import { FichesTechniquesTab } from "./fiches-techniques-tab"

type Tab = "overview" | "orders" | "products" | "fiches"

export function AdminTabs({ 
  initialOrders, 
  initialProducts, 
  stats 
}: { 
  initialOrders: any[]
  initialProducts: any[]
  stats: any 
}) {
  const [activeTab, setActiveTab] = useState<Tab>("overview")

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Vue d'ensemble", icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: "orders", label: "Commandes", icon: <ListOrdered className="h-4 w-4" /> },
    { key: "products", label: "Produits", icon: <ShoppingBag className="h-4 w-4" /> },
    { key: "fiches", label: "Fiches Techniques", icon: <FlaskConical className="h-4 w-4" /> },
  ]

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 py-4 px-5 font-medium text-sm transition-colors relative whitespace-nowrap ${
              activeTab === tab.key ? "text-[#1A56DB]" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A56DB] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === "overview" && <OverviewTab stats={stats} />}
        {activeTab === "orders" && <OrdersTab orders={initialOrders} />}
        {activeTab === "products" && <ProductsTab products={initialProducts} />}
        {activeTab === "fiches" && <FichesTechniquesTab />}
      </div>
    </div>
  )
}
