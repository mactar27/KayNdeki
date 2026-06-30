"use client"

import { formatFCFA } from "@/lib/menu-data"
import { TrendingUp, ShoppingCart, Calendar, DollarSign, Activity } from "lucide-react"

export function OverviewTab({ stats }: { stats: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CA Mensuel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Revenus du mois</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatFCFA(stats.monthlyRevenue)}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Commandes du mois */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Commandes du mois</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.monthlyOrders}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Panier moyen */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Panier moyen</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatFCFA(stats.averageBasket)}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Activity className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* CA Annuel */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Revenus annuels</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatFCFA(stats.yearlyRevenue)}</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
