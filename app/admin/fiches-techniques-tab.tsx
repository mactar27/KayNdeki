"use client"

import { useState, useTransition, useEffect } from "react"
import {
  ChevronDown, ChevronUp, TrendingUp, Package, Calculator,
  AlertTriangle, Pencil, Trash2, Plus, Check, X, Save
} from "lucide-react"
import { formatFCFA } from "@/lib/menu-data"
import type { FicheTechnique, FicheIngredient } from "@/app/actions/fiches"
import {
  createFicheAction,
  updateFicheAction,
  deleteFicheAction,
  createIngredientAction,
  updateIngredientAction,
  deleteIngredientAction,
} from "@/app/actions/fiches"

// ─── Ingredient Row (editable) ────────────────────────────────────────────────
function IngredientRow({
  ing,
  portions,
  onDelete,
  onSave,
}: {
  ing: FicheIngredient
  portions: number
  onDelete: (id: string) => void
  onSave: (id: string, data: Partial<FicheIngredient>) => void
}) {
  const [editing, setEditing] = useState(false)
  const [name, setName]           = useState(ing.name)
  const [poids, setPoids]         = useState(String(ing.poids))
  const [unite, setUnite]         = useState(ing.unite)
  const [prixKg, setPrixKg]       = useState(String(ing.prix_kg))
  const [isPending, startTransition] = useTransition()

  const prixPortion = unite === "unité"
    ? Number(prixKg) * Number(poids)
    : Number(prixKg) * Number(poids)

  const handleSave = () => {
    startTransition(async () => {
      await onSave(ing.id, {
        name,
        poids: Number(poids),
        unite,
        prix_kg: Number(prixKg),
        prix_portion: prixPortion,
      })
      setEditing(false)
    })
  }

  if (editing) {
    return (
      <tr className="bg-blue-50/50">
        <td className="px-5 py-2">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-blue-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </td>
        <td className="px-3 py-2">
          <div className="flex justify-end gap-1">
            <input
              value={poids}
              onChange={e => setPoids(e.target.value)}
              className="w-20 border border-blue-300 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="number"
              step="0.01"
            />
            <select
              value={unite}
              onChange={e => setUnite(e.target.value)}
              className="border border-blue-300 rounded-lg px-1 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="kg">kg</option>
              <option value="unité">unité</option>
              <option value="">—</option>
            </select>
          </div>
        </td>
        <td className="px-3 py-2">
          <div className="flex justify-end">
            <input
              value={prixKg}
              onChange={e => setPrixKg(e.target.value)}
              className="w-24 border border-blue-300 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="number"
            />
          </div>
        </td>
        <td className="px-3 py-2 text-right text-sm font-semibold text-slate-700">
          {Math.round(prixPortion)} F
        </td>
        <td className="px-5 py-2 text-right text-sm">
          <span className="bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-lg text-xs">
            {(Number(poids) * portions).toFixed(2)} {unite}
          </span>
        </td>
        <td className="px-3 py-2 text-right">
          <div className="flex justify-end gap-1">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition"
            >
              <Check className="size-3.5" />
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="hover:bg-slate-50/50 group transition-colors">
      <td className="px-5 py-3 font-medium text-slate-800">{ing.name}</td>
      <td className="px-3 py-3 text-right text-slate-500">{ing.poids} {ing.unite}</td>
      <td className="px-3 py-3 text-right text-slate-500">{ing.prix_kg > 0 ? `${ing.prix_kg} F` : "—"}</td>
      <td className="px-3 py-3 text-right font-semibold text-slate-700">{ing.prix_portion > 0 ? `${Math.round(ing.prix_portion)} F` : "—"}</td>
      <td className="px-5 py-3 text-right">
        <span className="bg-blue-50 text-[#1A56DB] font-semibold px-2.5 py-1 rounded-lg text-xs">
          {(ing.poids * portions).toFixed(2)} {ing.unite}
        </span>
      </td>
      <td className="px-3 py-3 text-right">
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 transition"
          >
            <Pencil className="size-3.5" />
          </button>
          <button
            onClick={() => onDelete(ing.id)}
            className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── New Ingredient Form ───────────────────────────────────────────────────────
function NewIngredientForm({ ficheId, position, onDone }: { ficheId: string; position: number; onDone: () => void }) {
  const [name, setName]     = useState("")
  const [poids, setPoids]   = useState("0")
  const [unite, setUnite]   = useState("kg")
  const [prixKg, setPrixKg] = useState("0")
  const [isPending, startTransition] = useTransition()

  const prixPortion = Number(prixKg) * Number(poids)

  const handleAdd = () => {
    if (!name.trim()) return
    startTransition(async () => {
      await createIngredientAction(ficheId, {
        name,
        poids: Number(poids),
        unite,
        prix_kg: Number(prixKg),
        prix_portion: prixPortion,
        position,
      })
      onDone()
    })
  }

  return (
    <tr className="bg-emerald-50/50 border-t border-emerald-100">
      <td className="px-5 py-2">
        <input
          placeholder="Nom de l'ingrédient"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-emerald-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          autoFocus
        />
      </td>
        <td className="px-3 py-2">
          <div className="flex justify-end gap-1">
            <input
              value={poids}
              onChange={e => setPoids(e.target.value)}
              type="number" step="0.01"
              className="w-20 border border-emerald-300 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <select
              value={unite}
              onChange={e => setUnite(e.target.value)}
              className="border border-emerald-300 rounded-lg px-1 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="kg">kg</option>
              <option value="unité">unité</option>
              <option value="">—</option>
            </select>
          </div>
        </td>
        <td className="px-3 py-2">
          <div className="flex justify-end">
            <input
              value={prixKg}
              onChange={e => setPrixKg(e.target.value)}
              type="number"
              className="w-24 border border-emerald-300 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </td>
      <td className="px-3 py-2 text-right text-sm font-semibold text-slate-600">{Math.round(prixPortion)} F</td>
      <td className="px-5 py-2 text-right text-xs text-slate-400">—</td>
      <td className="px-3 py-2 text-right">
        <div className="flex justify-end gap-1">
          <button
            onClick={handleAdd}
            disabled={isPending || !name.trim()}
            className="flex size-7 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 transition"
          >
            <Check className="size-3.5" />
          </button>
          <button
            onClick={onDone}
            className="flex size-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Fiche Card ───────────────────────────────────────────────────────────────
function FicheCard({
  fiche,
  portions,
  onDeleted,
  onUpdated,
}: {
  fiche: FicheTechnique
  portions: number
  onDeleted: (id: string) => void
  onUpdated: (id: string, data: Partial<FicheTechnique>) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [editingHeader, setEditingHeader] = useState(false)
  const [produit, setProduit]     = useState(fiche.produit)
  const [emoji, setEmoji]         = useState(fiche.emoji)
  const [prixVente, setPrixVente] = useState(String(fiche.prix_vente))
  const [showNewIng, setShowNewIng] = useState(false)
  const [ingredients, setIngredients] = useState<FicheIngredient[]>(fiche.ingredients)
  const [isPending, startTransition] = useTransition()

  const coutPortion = ingredients.reduce((sum, i) => sum + Number(i.prix_portion), 0)
  const margeBrute  = fiche.prix_vente > 0 ? ((fiche.prix_vente - coutPortion) / fiche.prix_vente) * 100 : 0
  const beneficeNet = fiche.prix_vente - coutPortion
  const isBonne     = margeBrute >= 60

  const handleSaveFiche = () => {
    startTransition(async () => {
      await updateFicheAction(fiche.id, {
        produit,
        emoji,
        prix_vente: Number(prixVente),
      })
      onUpdated(fiche.id, { produit, emoji, prix_vente: Number(prixVente) })
      setEditingHeader(false)
    })
  }

  const handleDeleteFiche = () => {
    if (!window.confirm(`Supprimer la fiche "${fiche.produit}" ? Cette action est irréversible.`)) return
    startTransition(async () => {
      await deleteFicheAction(fiche.id)
      onDeleted(fiche.id)
    })
  }

  const handleDeleteIngredient = (id: string) => {
    startTransition(async () => {
      await deleteIngredientAction(id)
      setIngredients(prev => prev.filter(i => i.id !== id))
    })
  }

  const handleSaveIngredient = async (id: string, data: Partial<FicheIngredient>) => {
    await updateIngredientAction(id, data)
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, ...data } : i))
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isOpen ? "border-[#1A56DB]" : "border-slate-200"}`}>
      {/* Header */}
      {editingHeader ? (
        <div className="flex flex-wrap items-center gap-3 p-5 bg-slate-50 border-b border-slate-100">
          <input
            value={emoji}
            onChange={e => setEmoji(e.target.value)}
            className="w-12 text-center text-2xl border border-slate-300 rounded-xl px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            maxLength={2}
          />
          <input
            value={produit}
            onChange={e => setProduit(e.target.value)}
            className="flex-1 border border-slate-300 rounded-xl px-3 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nom du produit"
          />
          <div className="flex items-center gap-2 border border-slate-300 rounded-xl px-3 py-2">
            <span className="text-sm text-slate-500">Prix vente</span>
            <input
              value={prixVente}
              onChange={e => setPrixVente(e.target.value)}
              type="number"
              className="w-20 font-bold text-[#1A56DB] focus:outline-none"
            />
            <span className="text-sm text-slate-400">FCFA</span>
          </div>
          <button
            onClick={handleSaveFiche}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-xl bg-[#1A56DB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save className="size-4" /> Enregistrer
          </button>
          <button onClick={() => setEditingHeader(false)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-500 hover:bg-slate-200 transition">
            Annuler
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl w-12 h-12 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100">
              {fiche.emoji}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">{fiche.produit}</h3>
              <p className="text-sm text-slate-500 mt-0.5">{ingredients.length} ingrédients</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-slate-400 mb-1">Marge brute</span>
              <span className={`font-bold text-lg ${isBonne ? "text-emerald-600" : "text-amber-500"}`}>{margeBrute.toFixed(1)}%</span>
            </div>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-slate-400 mb-1">Coût portion</span>
              <span className="font-bold text-slate-700">{Math.round(coutPortion)} FCFA</span>
            </div>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-slate-400 mb-1">Prix de vente</span>
              <span className="font-bold text-[#1A56DB]">{formatFCFA(fiche.prix_vente)}</span>
            </div>
            <div className="flex items-center gap-2 ml-2" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => setEditingHeader(true)}
                className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 transition"
              >
                <Pencil className="size-4" />
              </button>
              <button
                onClick={handleDeleteFiche}
                className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-600 transition"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            {isOpen ? <ChevronUp className="size-5 text-slate-400 shrink-0" /> : <ChevronDown className="size-5 text-slate-400 shrink-0" />}
          </div>
        </div>
      )}

      {/* Détail */}
      {isOpen && (
        <div className="border-t border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Ingrédient</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Poids</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Prix / kg</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Coût / portion</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Qté pour {portions}x</th>
                  <th className="px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ingredients.map(ing => (
                  <IngredientRow
                    key={ing.id}
                    ing={ing}
                    portions={portions}
                    onDelete={handleDeleteIngredient}
                    onSave={handleSaveIngredient}
                  />
                ))}
                {showNewIng && (
                  <NewIngredientForm
                    ficheId={fiche.id}
                    position={ingredients.length}
                    onDone={() => setShowNewIng(false)}
                  />
                )}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-slate-200">
                  <td colSpan={3} className="px-5 py-3 font-bold text-slate-700">Total coût</td>
                  <td className="px-3 py-3 text-right font-bold text-slate-800">{Math.round(coutPortion)} F</td>
                  <td className="px-5 py-3 text-right font-bold text-[#1A56DB]">{Math.round(coutPortion * portions)} F</td>
                  <td className="px-3 py-3 text-right">
                    <button
                      onClick={() => setShowNewIng(true)}
                      className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition"
                    >
                      <Plus className="size-3.5" /> Ingrédient
                    </button>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* KPIs */}
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

// ─── New Fiche Form ───────────────────────────────────────────────────────────
function NewFicheForm({ onDone }: { onDone: (fiche: FicheTechnique) => void }) {
  const [produit, setProduit]     = useState("")
  const [emoji, setEmoji]         = useState("🥪")
  const [prixVente, setPrixVente] = useState("0")
  const [isPending, startTransition] = useTransition()

  const handleCreate = () => {
    if (!produit.trim()) return
    startTransition(async () => {
      const res = await createFicheAction({
        produit,
        emoji,
        prix_vente: Number(prixVente),
      })
      if (res.success) {
        onDone({
          id: res.id!,
          produit,
          emoji,
          prix_vente: Number(prixVente),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ingredients: [],
        })
      }
    })
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-dashed border-emerald-300 p-5 flex flex-wrap items-center gap-3">
      <input
        value={emoji}
        onChange={e => setEmoji(e.target.value)}
        className="w-12 text-center text-2xl border border-slate-300 rounded-xl px-1 py-1 focus:outline-none"
        maxLength={2}
      />
      <input
        placeholder="Nom du produit (ex: Sandwich Thon)"
        value={produit}
        onChange={e => setProduit(e.target.value)}
        className="flex-1 min-w-[200px] border border-slate-300 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400"
        autoFocus
      />
      <div className="flex items-center gap-2 border border-slate-300 rounded-xl px-3 py-2">
        <span className="text-sm text-slate-500">Prix de vente</span>
        <input
          value={prixVente}
          onChange={e => setPrixVente(e.target.value)}
          type="number"
          className="w-20 font-bold text-[#1A56DB] focus:outline-none"
        />
        <span className="text-sm text-slate-400">FCFA</span>
      </div>
      <button
        onClick={handleCreate}
        disabled={isPending || !produit.trim()}
        className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50 transition"
      >
        <Check className="size-4" /> Créer
      </button>
    </div>
  )
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────
export function FichesTechniquesTab({ initialFiches }: { initialFiches: FicheTechnique[] }) {
  const [portions, setPortions]     = useState(10)
  const [fiches, setFiches]         = useState<FicheTechnique[]>(initialFiches)
  const [showNewFiche, setShowNewFiche] = useState(false)

  // Sync state if server data changes
  useEffect(() => {
    setFiches(initialFiches)
  }, [initialFiches])

  const totalCout = fiches.reduce((sum, f) => {
    const cout = f.ingredients.reduce((s, i) => s + Number(i.prix_portion), 0)
    return sum + cout * portions
  }, 0)

  const handleFicheDeleted = (id: string) => {
    setFiches(prev => prev.filter(f => f.id !== id))
  }

  const handleFicheCreated = (fiche: FicheTechnique) => {
    setFiches(prev => [...prev, fiche])
    setShowNewFiche(false)
  }

  const handleFicheUpdated = (id: string, data: Partial<FicheTechnique>) => {
    setFiches(prev => prev.map(f => f.id === id ? { ...f, ...data } : f))
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Fiches Techniques</h2>
          <p className="text-sm text-slate-500 mt-1">Coûts de revient, marges et approvisionnements. Cliquez sur ✏️ pour modifier.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Sélecteur de portions */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
            <Package className="size-4 text-slate-400 shrink-0" />
            <span className="text-sm font-medium text-slate-600">Portions :</span>
            <input
              type="number"
              min={1}
              max={999}
              value={portions}
              onChange={e => setPortions(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-14 text-center font-bold text-[#1A56DB] border border-slate-200 rounded-lg py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            onClick={() => setShowNewFiche(!showNewFiche)}
            className="flex items-center gap-2 bg-[#1A56DB] text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-blue-700 transition"
          >
            <Plus className="size-4" /> Nouvelle Fiche
          </button>
        </div>
      </div>

      {/* Formulaire nouvelle fiche */}
      {showNewFiche && <NewFicheForm onDone={handleFicheCreated} />}

      {/* Fiches */}
      {fiches.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-400 font-medium">Aucune fiche technique. Cliquez sur "Nouvelle Fiche" pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fiches.map(f => (
            <FicheCard
              key={f.id}
              fiche={f}
              portions={portions}
              onDeleted={handleFicheDeleted}
              onUpdated={handleFicheUpdated}
            />
          ))}
        </div>
      )}

      {/* Récapitulatif global */}
      {fiches.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4 text-white/90">Estimation coût total — {portions} portions de chaque</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {fiches.map(f => {
              const cout = f.ingredients.reduce((s, i) => s + Number(i.prix_portion), 0) * portions
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
      )}
    </div>
  )
}
