"use server"

import { getPool } from "@/lib/db"
import { randomUUID } from "crypto"

export interface OrderInput {
  name: string
  phone: string
  address: string
  zone: string
  payment: string
  subtotal: number
  deliveryFee: number
  total: number
  items: Array<{
    key: string
    id: string
    name: string
    details: string
    price: number
    qty: number
  }>
}

export async function createOrderAction(input: OrderInput) {
  // Graceful fallback if no database is configured (for local testing)
  if (!process.env.DATABASE_URL) {
    console.log("DATABASE_URL non configurée, la commande n'a pas été sauvegardée en base de données.")
    return { success: true, orderId: "dummy-" + randomUUID() }
  }

  const pool = getPool()
  const orderId = randomUUID()
  const now = new Date()

  try {
    // In a real app we would use a transaction
    await pool.execute(
      `INSERT INTO orders (id, customer_name, phone, address, status, subtotal, delivery_fee, total, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        input.name,
        input.phone,
        `${input.address} (${input.zone})`,
        "pending",
        input.subtotal,
        input.deliveryFee,
        input.total,
        input.payment,
      ]
    )

    for (const item of input.items) {
      await pool.execute(
        `INSERT INTO order_items (order_id, title, details, unit_price, qty)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.name, item.details || "", item.price, item.qty]
      )
    }

    return { success: true, orderId }
  } catch (error) {
    console.error("Failed to create order:", error)
    return { success: false, error: "Erreur lors de la création de la commande" }
  }
}

import { revalidatePath } from "next/cache"
import { sendSMS } from "@/lib/sms"

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    const pool = getPool()
    
    // Récupérer les infos de la commande pour le SMS
    const [rows] = await pool.execute("SELECT customer_name, phone FROM orders WHERE id = ?", [orderId])
    const order = (rows as any[])[0]

    await pool.execute("UPDATE orders SET status = ? WHERE id = ?", [status, orderId])
    
    // Envoyer le SMS si le statut change
    if (order && order.phone) {
      const firstName = order.customer_name.split(' ')[0]
      let message = ""
      if (status === "delivered") {
        message = `Bonjour ${firstName}, votre commande Kay Ndeki a été livrée ! Merci de votre confiance et bon appétit. 🥐`
      } else if (status === "cancelled") {
        message = `Bonjour ${firstName}, votre commande Kay Ndeki a malheureusement été annulée. Contactez-nous pour plus d'infos.`
      }
      
      if (message) {
        // Envoi asynchrone pour ne pas bloquer
        sendSMS(order.phone, message).catch(console.error)
      }
    }

    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Error updating order status:", error)
    return { success: false, error: "Erreur lors de la mise à jour" }
  }
}

export async function deleteAllOrdersAction() {
  const pool = getPool()
  try {
    await pool.execute('DELETE FROM order_items')
    await pool.execute('DELETE FROM orders')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error("Error deleting all orders:", error)
    return { success: false, error: "Failed to delete orders" }
  }
}

export async function getLatestOrderIdAction() {
  const pool = getPool()
  try {
    const [rows] = await pool.execute('SELECT id FROM orders ORDER BY created_at DESC LIMIT 1')
    if (rows && (rows as any[]).length > 0) {
      return (rows as any[])[0].id
    }
    return null
  } catch (error) {
    console.error("Error fetching latest order ID:", error)
    return null
  }
}
