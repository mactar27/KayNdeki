import { cookies } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { getPool, query } from "@/lib/db"
import { logoutAdminAction } from "@/app/actions/auth"
import { getProductsAction } from "@/app/actions/products"
import { getStatsAction } from "@/app/actions/stats"
import { getFichesAction } from "@/app/actions/fiches"
import { Package, LogOut } from "lucide-react"
import { AdminTabs } from "./admin-tabs"

export default async function AdminDashboard() {
  // 1. Protection de la route : si pas de cookie, on affiche une fausse erreur 404
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")
  if (session?.value !== "authenticated") {
    notFound()
  }

  // 2. Récupération des données depuis TiDB
  const orders = await query(`
    SELECT * FROM orders 
    ORDER BY created_at DESC 
    LIMIT 100
  `)

  // Récupération de tous les items de ces commandes
  const orderIds = orders.map((o: any) => o.id)
  let allItems: any[] = []
  if (orderIds.length > 0) {
    const placeholders = orderIds.map(() => "?").join(",")
    allItems = await query(`
      SELECT * FROM order_items 
      WHERE order_id IN (${placeholders})
    `, orderIds)
  }

  // Grouper les items par commande
  const ordersWithItems = orders.map((order: any) => ({
    ...order,
    items: allItems.filter((item: any) => item.order_id === order.id)
  }))

  const products = await getProductsAction()
  const statsResponse = await getStatsAction()
  const stats = statsResponse.data
  const fiches = await getFichesAction()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Admin */}
      <header className="bg-slate-800 text-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-blue-400" />
              <span className="font-bold text-lg tracking-tight">Kayndeki Boss</span>
            </div>
            <form action={async () => {
              "use server"
              await logoutAdminAction()
              redirect("/")
            }}>
              <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition bg-slate-700/50 hover:bg-slate-700 px-3 py-1.5 rounded-full">
                <LogOut className="h-4 w-4" /> Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminTabs initialOrders={ordersWithItems} initialProducts={products} stats={stats} initialFiches={fiches} />
      </main>
    </div>
  )
}
