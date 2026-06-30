"use client"

import { useState } from "react"
import { LayoutDashboard, ShoppingBag, ListOrdered } from "lucide-react"
import { OverviewTab } from "./overview-tab"
import { OrdersTab } from "./orders-tab"
import { ProductsTab } from "./products-tab"

type Tab = "overview" | "orders" | "products"

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

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 py-4 px-6 font-medium text-sm transition-colors relative ${
            activeTab === "overview" ? "text-[#1A56DB]" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          Vue d'ensemble
          {activeTab === "overview" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A56DB] rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 py-4 px-6 font-medium text-sm transition-colors relative ${
            activeTab === "orders" ? "text-[#1A56DB]" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <ListOrdered className="h-4 w-4" />
          Commandes
          {activeTab === "orders" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A56DB] rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 py-4 px-6 font-medium text-sm transition-colors relative ${
            activeTab === "products" ? "text-[#1A56DB]" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          Produits
          {activeTab === "products" && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A56DB] rounded-t-full" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === "overview" && <OverviewTab stats={stats} />}
        {activeTab === "orders" && <OrdersTab orders={initialOrders} />}
        {activeTab === "products" && <ProductsTab products={initialProducts} />}
      </div>
    </div>
  )
}
