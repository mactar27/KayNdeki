"use server"

import { getPool } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getProductsAction() {
  try {
    const pool = getPool()
    const [rows] = await pool.query("SELECT * FROM products ORDER BY created_at DESC")
    return rows as any[]
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function createProductAction(data: {
  id: string
  category: string
  name: string
  name_wo?: string
  name_en?: string
  description?: string
  price: number
  image: string
  available: boolean
}) {
  try {
    const pool = getPool()
    await pool.query(
      `INSERT INTO products (id, category, name, name_wo, name_en, description, price, image, available) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.id,
        data.category,
        data.name,
        data.name_wo || "",
        data.name_en || "",
        data.description || "",
        data.price,
        data.image,
        data.available,
      ]
    )
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error creating product:", error)
    return { success: false, error: "Erreur lors de la création du produit" }
  }
}

export async function updateProductAction(
  id: string,
  data: {
    category: string
    name: string
    name_wo?: string
    name_en?: string
    description?: string
    price: number
    image: string
    available: boolean
  }
) {
  try {
    const pool = getPool()
    await pool.query(
      `UPDATE products SET category = ?, name = ?, name_wo = ?, name_en = ?, description = ?, price = ?, image = ?, available = ? WHERE id = ?`,
      [
        data.category,
        data.name,
        data.name_wo || "",
        data.name_en || "",
        data.description || "",
        data.price,
        data.image,
        data.available,
        id,
      ]
    )
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error updating product:", error)
    return { success: false, error: "Erreur lors de la modification du produit" }
  }
}

export async function deleteProductAction(id: string) {
  try {
    const pool = getPool()
    await pool.query("DELETE FROM products WHERE id = ?", [id])
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: "Erreur lors de la suppression du produit" }
  }
}

export async function toggleProductAvailabilityAction(id: string, available: boolean) {
  try {
    const pool = getPool()
    await pool.query("UPDATE products SET available = ? WHERE id = ?", [available, id])
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error toggling product availability:", error)
    return { success: false, error: "Erreur lors du changement de disponibilité" }
  }
}
