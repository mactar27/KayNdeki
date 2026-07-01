"use server"

import { getPool } from "@/lib/db"
import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"

// ─── Types ───────────────────────────────────────────────────────────────────
export interface FicheIngredient {
  id: string
  fiche_id: string
  name: string
  poids: number
  unite: string
  prix_kg: number
  prix_portion: number
  position: number
}

export interface FicheTechnique {
  id: string
  produit: string
  emoji: string
  prix_vente: number
  created_at: string
  updated_at: string
  ingredients: FicheIngredient[]
}

// ─── READ ────────────────────────────────────────────────────────────────────
export async function getFichesAction(): Promise<FicheTechnique[]> {
  try {
    const pool = getPool()
    const [fiches] = await pool.execute(
      "SELECT * FROM fiches_techniques ORDER BY created_at ASC"
    ) as any[]

    const [ingredients] = await pool.execute(
      "SELECT * FROM fiche_ingredients ORDER BY position ASC"
    ) as any[]

    return fiches.map((f: any) => ({
      ...f,
      ingredients: ingredients.filter((i: any) => i.fiche_id === f.id),
    }))
  } catch {
    return []
  }
}

// ─── FICHE CRUD ──────────────────────────────────────────────────────────────
export async function createFicheAction(data: {
  produit: string
  emoji: string
  prix_vente: number
}) {
  const pool = getPool()
  const id = randomUUID()
  await pool.execute(
    "INSERT INTO fiches_techniques (id, produit, emoji, prix_vente) VALUES (?, ?, ?, ?)",
    [id, data.produit, data.emoji, data.prix_vente]
  )
  revalidatePath("/admin")
  return { success: true, id }
}

export async function updateFicheAction(
  id: string,
  data: { produit?: string; emoji?: string; prix_vente?: number }
) {
  const pool = getPool()
  const fields: string[] = []
  const values: any[] = []

  if (data.produit !== undefined) { fields.push("produit = ?"); values.push(data.produit) }
  if (data.emoji !== undefined)   { fields.push("emoji = ?");   values.push(data.emoji) }
  if (data.prix_vente !== undefined) { fields.push("prix_vente = ?"); values.push(data.prix_vente) }

  if (fields.length === 0) return { success: true }

  await pool.execute(
    `UPDATE fiches_techniques SET ${fields.join(", ")}, updated_at = NOW() WHERE id = ?`,
    [...values, id]
  )
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteFicheAction(id: string) {
  const pool = getPool()
  // Cascades to fiche_ingredients via FK
  await pool.execute("DELETE FROM fiches_techniques WHERE id = ?", [id])
  revalidatePath("/admin")
  return { success: true }
}

// ─── INGREDIENT CRUD ─────────────────────────────────────────────────────────
export async function createIngredientAction(
  ficheId: string,
  data: {
    name: string
    poids: number
    unite: string
    prix_kg: number
    prix_portion: number
    position: number
  }
) {
  const pool = getPool()
  const id = randomUUID()
  await pool.execute(
    `INSERT INTO fiche_ingredients (id, fiche_id, name, poids, unite, prix_kg, prix_portion, position)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, ficheId, data.name, data.poids, data.unite, data.prix_kg, data.prix_portion, data.position]
  )
  revalidatePath("/admin")
  return { success: true, id }
}

export async function updateIngredientAction(
  id: string,
  data: {
    name?: string
    poids?: number
    unite?: string
    prix_kg?: number
    prix_portion?: number
  }
) {
  const pool = getPool()
  const fields: string[] = []
  const values: any[] = []

  if (data.name !== undefined)         { fields.push("name = ?");         values.push(data.name) }
  if (data.poids !== undefined)        { fields.push("poids = ?");        values.push(data.poids) }
  if (data.unite !== undefined)        { fields.push("unite = ?");        values.push(data.unite) }
  if (data.prix_kg !== undefined)      { fields.push("prix_kg = ?");      values.push(data.prix_kg) }
  if (data.prix_portion !== undefined) { fields.push("prix_portion = ?"); values.push(data.prix_portion) }

  if (fields.length === 0) return { success: true }

  await pool.execute(
    `UPDATE fiche_ingredients SET ${fields.join(", ")} WHERE id = ?`,
    [...values, id]
  )
  revalidatePath("/admin")
  return { success: true }
}

export async function deleteIngredientAction(id: string) {
  const pool = getPool()
  await pool.execute("DELETE FROM fiche_ingredients WHERE id = ?", [id])
  revalidatePath("/admin")
  return { success: true }
}
