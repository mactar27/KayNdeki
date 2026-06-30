"use client"

import { formatFCFA } from "@/lib/menu-data"
import { Package, Clock, CheckCircle2, XCircle, Trash2 } from "lucide-react"
import { updateOrderStatusAction, deleteAllOrdersAction } from "@/app/actions/order"
import { useTransition } from "react"

export function OrdersTab({ orders }: { orders: any[] }) {
  const [isPending, startTransition] = useTransition()

  const handleDeleteAll = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer TOUTES les commandes ? Cette action est irréversible.")) {
      startTransition(async () => {
        await deleteAllOrdersAction()
      })
    }
  }

  return (
    <div className="grid gap-6">
      {orders.length > 0 && (
        <div className="flex justify-end">
          <button 
            onClick={handleDeleteAll}
            disabled={isPending}
            className="bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium transition disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Purger toutes les commandes
          </button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800">Aucune commande</h3>
          <p className="text-slate-500 mt-1">Les nouvelles commandes apparaîtront ici.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* En-tête commande */}
            <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-slate-800 text-lg">{order.customer_name}</span>
                  {order.status === "pending" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                      <Clock className="h-3.5 w-3.5" /> En attente
                    </span>
                  )}
                  {order.status === "delivered" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Livrée
                    </span>
                  )}
                  {order.status === "cancelled" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      <XCircle className="h-3.5 w-3.5" /> Annulée
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                  <span>{new Date(order.created_at).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-medium text-slate-700">{order.phone}</span>
                  <span className="text-slate-300">•</span>
                  <span>{order.address}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[#1A56DB]">{formatFCFA(order.total)}</div>
                <div className="text-xs text-slate-500">Paiement: {order.payment_method === 'cash' ? 'À la livraison' : order.payment_method}</div>
              </div>
            </div>

            {/* Détails commande */}
            <div className="p-4 sm:px-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Contenu du panier</h4>
                  <ul className="space-y-3">
                    {order.items.map((item: any) => (
                      <li key={item.id} className="flex flex-col text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-700">
                            <span className="font-medium text-slate-900">{item.qty}x</span> {item.title}
                          </span>
                          <span className="text-slate-500">{formatFCFA(item.unit_price * item.qty)}</span>
                        </div>
                        {item.details && (
                          <span className="text-xs text-slate-500 mt-0.5 ml-6">
                            {item.details}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-slate-100 text-sm">
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>Sous-total</span>
                      <span>{formatFCFA(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Frais de livraison</span>
                      <span>{formatFCFA(order.delivery_fee)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-end gap-3 sm:border-l sm:border-slate-100 sm:pl-6">
                  {order.status === "pending" ? (
                    <>
                      <button 
                        onClick={() => startTransition(() => updateOrderStatusAction(order.id, "delivered"))}
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 px-4 text-sm font-semibold transition disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Marquer comme livrée
                      </button>
                      <button 
                        onClick={() => startTransition(() => updateOrderStatusAction(order.id, "cancelled"))}
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 rounded-xl py-2.5 px-4 text-sm font-semibold transition disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" /> Annuler la commande
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-4 bg-slate-50 rounded-xl text-sm text-slate-500">
                      Cette commande a été traitée.
                    </div>
                  )}
                  
                  <a 
                    href={`https://wa.me/221${order.phone.replace(/\s+/g, '')}?text=Bonjour ${order.customer_name}, concernant votre commande Kay Ndeki...`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl py-2.5 px-4 text-sm font-semibold transition"
                  >
                    Contacter sur WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
