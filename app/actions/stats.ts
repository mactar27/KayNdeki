"use server"

import { getPool } from "@/lib/db"

export async function getStatsAction() {
  try {
    const pool = getPool()
    // Current month and year dates
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1 // 1-12

    // Monthly stats
    const [[monthlyStats]]: any = await pool.query(
      `SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue 
       FROM orders 
       WHERE YEAR(created_at) = ? AND MONTH(created_at) = ?`,
      [currentYear, currentMonth]
    )

    // Yearly stats
    const [[yearlyStats]]: any = await pool.query(
      `SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as revenue 
       FROM orders 
       WHERE YEAR(created_at) = ?`,
      [currentYear]
    )

    // All-time Average basket (panier moyen)
    const [[avgBasket]]: any = await pool.query(
      `SELECT COALESCE(AVG(total), 0) as average FROM orders`
    )

    return {
      success: true,
      data: {
        monthlyRevenue: Number(monthlyStats.revenue),
        monthlyOrders: Number(monthlyStats.count),
        yearlyRevenue: Number(yearlyStats.revenue),
        yearlyOrders: Number(yearlyStats.count),
        averageBasket: Number(avgBasket.average),
      }
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return { 
      success: false, 
      error: "Erreur lors de la récupération des statistiques",
      data: {
        monthlyRevenue: 0,
        monthlyOrders: 0,
        yearlyRevenue: 0,
        yearlyOrders: 0,
        averageBasket: 0,
      }
    }
  }
}
