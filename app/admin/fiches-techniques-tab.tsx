"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, TrendingUp, Package, Calculator, AlertTriangle } from "lucide-react"
import { formatFCFA } from "@/lib/menu-data"

// ─────────────────────────────────────────────────────────
// Données des fiches techniques
// ─────────────────────────────────────────────────────────
interface Ingredient {
  name: string
  poids: number
  unite: "kg" | "unité" | ""
  prixKg: number
  prixPortion: number
}

interface Fiche {
  id: string
  produit: string
  emoji: string
  prixVente: number
  ingredients: Ingredient[]
}

const FICHES: Fiche[] = [
  {
    id: "sandwich-viande",
    produit: "Sandwich Viande",
    emoji: "🥩",
    prixVente: 4500,
    ingredients: [
      { name: "Pain", poids: 1, unite: "unité", prixKg: 100, prixPortion: 100 },
      { name: "Viande", poids: 0.1, unite: "kg", prixKg: 3000, prixPortion: 300 },
      { name: "Tomate", poids: 0.03, unite: "kg", prixKg: 1000, prixPortion: 30 },
      { name: "Salade", poids: 0.025, unite: "kg", prixKg: 500, prixPortion: 12.5 },
      { name: "Oignons", poids: 0.025, unite: "kg", prixKg: 500, prixPortion: 12.5 },
      { name: "Mayonnaise", poids: 0.01, unite: "kg", prixKg: 1000, prixPortion: 10 },
      { name: "Ketchup", poids: 0.01, unite: "kg", prixKg: 1000, prixPortion: 10 },
      { name: "Moutarde", poids: 0.01, unite: "kg", prixKg: 1000, prixPortion: 10 },
      { name: "Packaging", poids: 1, unite: "unité", prixKg: 100, prixPortion: 100 },
    ],
  },
  {
    id: "sandwich-poulet",
    produit: "Sandwich Poulet",
    emoji: "🍗",
    prixVente: 4000,
    ingredients: [
      { name: "Pain", poids: 1, unite: "unité", prixKg: 100, prixPortion: 100 },
      { name: "Poulet", poids: 0.1, unite: "kg", prixKg: 3000, prixPortion: 300 },
      { name: "Tomate", poids: 0.03, unite: "kg", prixKg: 1000, prixPortion: 30 },
      { name: "Salade", poids: 0.025, unite: "kg", prixKg: 500, prixPortion: 12.5 },
      { name: "Mayonnaise", poids: 0.01, unite: "kg", prixKg: 1000, prixPortion: 10 },
      { name: "Piment", poids: 0.01, unite: "kg", prixKg: 600, prixPortion: 6 },
      { name: "Packaging", poids: 1, unite: "unité", prixKg: 100, prixPortion: 100 },
    ],
  },
  {
    id: "sandwich-ndambe",
    produit: "Sandwich + Ndambé",
    emoji: "🫘",
    prixVente: 2000,
    ingredients: [
      { name: "Pain", poids: 1, unite: "unité", prixKg: 100, prixPortion: 100 },
      { name: "Ndambé (haricot)", poids: 0.08, unite: "kg", prixKg: 800, prixPortion: 64 },
      { name: "Oignons", poids: 0.02, unite: "kg", prixKg: 500, prixPortion: 10 },
      { name: "Piment", poids: 0.005, unite: "kg", prixKg: 600, prixPortion: 3 },
      { name: "Huile", poids: 0.01, unite: "kg", prixKg: 1200, prixPortion: 12 },
      { name: "Packaging", poids: 1, unite: "unité", prixKg: 100, prixPortion: 100 },
    ],
  },
  {
    id: "cafe",
    produit: "Café",
    emoji: "☕",
    prixVente: 500,
    ingredients: [
      { name: "Café stick", poids: 1, unite: "unité", prixKg: 160, prixPortion: 160 },
      { name: "Eau chaude", poids: 0.2, unite: "kg", prixKg: 0, prixPortion: 0 },
      { name: "Gobelet", poids: 1, unite: "unité", prixKg: 50, prixPortion: 50 },
    ],
  },
]

// ─────────────────────────────────────────────────────────
// Composant Fiche individuelle
// ─────────────────────────────────────────────────────────
function FicheCard({ fiche, portions }: { fiche: Fiche; portions: number }) {
  const [isOpen, setIsOpen] = useState(false)

  const coutPortion = fiche.ingredients.reduce((sum, i) => sum + i.prixPortion, 0)
  const margeBrute = ((fiche.prixVente - coutPortion) / fiche.prixVente) * 100
  const beneficeNet = fiche.prixVente - coutPortion
  const isBonne = margeBrute >= 60

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isOpen ? "border-[#1A56DB]" : "border-slate-200"}`}>
      {/* Header cliquable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
            {fiche.emoji}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">{fiche.produit}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{fiche.ingredients.length} ingrédients</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Marge */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-slate-400 font-medium mb-1">Marge brute</span>
            <span className={`font-bold text-lg ${isBonne ? "text-emerald-600" : "text-amber-500"}`}>
              {margeBrute.toFixed(1)}%
            </span>
          </div>
          {/* Coût */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-slate-400 font-medium mb-1">Coût portion</span>
            <span className="font-bold text-slate-700">{Math.round(coutPortion)} FCFA</span>
          </div>
          {/* Prix vente */}
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs text-slate-400 font-medium mb-1">Prix de vente</span>
            <span className="font-bold text-[#1A56DB]">{formatFCFA(fiche.prixVente)}</span>
          </div>

          {/* Badge marge mobile */}
          <span className={`sm:hidden text-sm font-bold px-3 py-1 rounded-full ${isBonne ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {margeBrute.toFixed(0)}%
          </span>

          {isOpen
            ? <ChevronUp className="size-5 text-slate-400 shrink-0" />
            : <ChevronDown className="size-5 text-slate-400 shrink-0" />
          }
        </div>
      </button>

      {/* Détail dépliable */}
      {isOpen && (
        <div className="border-t border-slate-100">
          {/* Tableau des ingrédients */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Ingrédient</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Poids / Unité</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Prix / kg</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Coût / portion</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Qté pour {portions}x</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fiche.ingredients.map((ing, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-800">{ing.name}</td>
                    <td className="px-3 py-3 text-right text-slate-500">
                      {ing.poids} {ing.unite}
                    </td>
                    <td className="px-3 py-3 text-right text-slate-500">
                      {ing.prixKg > 0 ? `${ing.prixKg} F` : "—"}
                    </td>
                    <td className="px-3 py-3 text-right font-semibold text-slate-700">
                      {ing.prixPortion > 0 ? `${ing.prixPortion} F` : "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="bg-blue-50 text-[#1A56DB] font-semibold px-2.5 py-1 rounded-lg text-xs">
                        {(ing.poids * portions).toFixed(2)} {ing.unite}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td colSpan={3} className="px-5 py-3 font-bold text-slate-700">Total coût</td>
                  <td className="px-3 py-3 text-right font-bold text-slate-800">{Math.round(coutPortion)} F</td>
                  <td className="px-5 py-3 text-right font-bold text-[#1A56DB]">
                    {Math.round(coutPortion * portions)} F
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Résumé financier */}
          <div className="grid grid-cols-3 gap-4 p-5 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100">
            <div className="flex flex-col items-center bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <Calculator className="size-5 text-slate-400 mb-2" />
              <span className="text-xs text-slate-400 font-medium">Coût 1 portion</span>
              <span className="text-xl font-bold text-slate-800 mt-1">{Math.round(coutPortion)} F</span>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
              <TrendingUp className="size-5 text-emerald-500 mb-2" />
              <span className="text-xs text-slate-400 font-medium">Bénéfice net</span>
              <span className="text-xl font-bold text-emerald-600 mt-1">{Math.round(beneficeNet)} F</span>
            </div>
            <div className={`flex flex-col items-center rounded-xl border p-4 shadow-sm ${isBonne ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
              {isBonne
                ? <TrendingUp className="size-5 text-emerald-500 mb-2" />
                : <AlertTriangle className="size-5 text-amber-500 mb-2" />
              }
              <span className="text-xs text-slate-400 font-medium">Marge brute</span>
              <span className={`text-xl font-bold mt-1 ${isBonne ? "text-emerald-600" : "text-amber-600"}`}>
                {margeBrute.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Composant principal de l'onglet
// ─────────────────────────────────────────────────────────
export function FichesTechniquesTab() {
  const [portions, setPortions] = useState(10)

  const totalCout = FICHES.reduce((sum, f) => {
    return sum + f.ingredients.reduce((s, i) => s + i.prixPortion, 0) * portions
  }, 0)

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Fiches Techniques</h2>
          <p className="text-sm text-slate-500 mt-1">Coûts de revient, marges et approvisionnements par produit.</p>
        </div>

        {/* Sélecteur de portions */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
          <Package className="size-4 text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Nombre de portions :</span>
          <input
            type="number"
            min={1}
            max={999}
            value={portions}
            onChange={(e) => setPortions(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 text-center font-bold text-[#1A56DB] border border-slate-200 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-[#1A56DB]/20"
          />
        </div>
      </div>

      {/* Fiches */}
      <div className="space-y-4">
        {FICHES.map((fiche) => (
          <FicheCard key={fiche.id} fiche={fiche} portions={portions} />
        ))}
      </div>

      {/* Résumé global */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-lg">
        <h3 className="font-bold text-lg mb-4 text-white/90">
          Estimation coût total — {portions} portions de chaque produit
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FICHES.map((f) => {
            const cout = f.ingredients.reduce((s, i) => s + i.prixPortion, 0) * portions
            return (
              <div key={f.id} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl mb-1">{f.emoji}</div>
                <div className="text-xs text-white/60 mb-1">{f.produit}</div>
                <div className="font-bold text-white">{Math.round(cout)} FCFA</div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
          <span className="text-white/70 font-medium">Coût total d'approvisionnement</span>
          <span className="text-2xl font-bold text-white">{Math.round(totalCout).toLocaleString()} FCFA</span>
        </div>
      </div>
    </div>
  )
}
