import "server-only"
import { query, hasDatabase } from "./db"
import { MENU, type MenuItem } from "./menu-data"

// Récupère le menu depuis la BDD, avec repli sur le catalogue statique.
export async function getMenu(): Promise<MenuItem[]> {
  if (!hasDatabase()) return MENU
  try {
    const rows = await query<any>(
      "SELECT id, category, name, name_wo, name_en, description, price, image, available FROM products ORDER BY name ASC",
    )
    if (!rows.length) return MENU
    return rows.map((r) => ({
      id: r.id,
      category: r.category,
      name: r.name,
      nameWo: r.name_wo,
      nameEn: r.name_en,
      description: r.description ?? "",
      price: Number(r.price),
      image: r.image ?? "/placeholder.svg",
      available: Boolean(r.available),
    }))
  } catch (error) {
    console.error("Failed to fetch menu:", error)
    return MENU
  }
}

export interface OrderRecord {
  id: string
  user_id: string | null
  customer_name: string
  phone: string
  mode: "delivery" | "collect"
  address: string | null
  note: string | null
  status: string
  subtotal: number
  delivery_fee: number
  total: number
  payment_method: string
  payment_status: string
  created_at: string
}

export interface OrderItemRecord {
  title: string
  details: string | null
  unit_price: number
  qty: number
}

export async function getOrdersForUser(userId: string): Promise<OrderRecord[]> {
  return query<OrderRecord>(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
  )
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  return query<OrderRecord>("SELECT * FROM orders ORDER BY created_at DESC LIMIT 200")
}

export async function getOrderItems(orderId: string): Promise<OrderItemRecord[]> {
  return query<OrderItemRecord>(
    "SELECT title, details, unit_price, qty FROM order_items WHERE order_id = ?",
    [orderId],
  )
}

export async function getOrder(orderId: string): Promise<OrderRecord | null> {
  const rows = await query<OrderRecord>("SELECT * FROM orders WHERE id = ? LIMIT 1", [orderId])
  return rows[0] ?? null
}
