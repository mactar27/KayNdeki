"use client"

import { useState } from "react"
import { useCart } from "@/components/cart/cart-provider"
import { formatFCFA } from "@/lib/menu-data"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/components/providers/language-provider"
import Link from "next/link"
import { ArrowLeft, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react"
import Image from "next/image"
import { createOrderAction } from "@/app/actions/order"

export function CommandeClient() {
  const { items, subtotal, clear } = useCart()
  const { t } = useTranslation()
  
  // Dakar Neighborhoods definition with their respective zones and fees
  const DAKAR_NEIGHBORHOODS = [
    // Zone 1 - Centre-ville (500 FCFA)
    { id: "plateau", label: "Plateau", fee: 500, zone: "Zone 1" },
    { id: "medina", label: "Médina", fee: 500, zone: "Zone 1" },
    { id: "fann", label: "Fann", fee: 500, zone: "Zone 1" },
    { id: "point_e", label: "Point E", fee: 500, zone: "Zone 1" },
    { id: "fass", label: "Fass / Colobane", fee: 500, zone: "Zone 1" },
    
    // Zone 2 - Banlieue proche (700 FCFA)
    { id: "sacre_coeur", label: "Sacré-Cœur / Mermoz", fee: 700, zone: "Zone 2" },
    { id: "sicap", label: "Sicap (Liberté, Baobab...)", fee: 700, zone: "Zone 2" },
    { id: "grand_dakar", label: "Grand Dakar / Niary Tally", fee: 700, zone: "Zone 2" },
    { id: "ouakam", label: "Ouakam", fee: 700, zone: "Zone 2" },
    { id: "almadies", label: "Almadies / Ngor", fee: 700, zone: "Zone 2" },
    { id: "yoff", label: "Yoff", fee: 700, zone: "Zone 2" },
    { id: "grand_yoff", label: "Grand Yoff", fee: 700, zone: "Zone 2" },

    // Zone 3 - Périphérie (1000 FCFA)
    { id: "parcelles", label: "Parcelles Assainies", fee: 1000, zone: "Zone 3" },
    { id: "pikine", label: "Pikine", fee: 1000, zone: "Zone 3" },
    { id: "guediawaye", label: "Guédiawaye", fee: 1000, zone: "Zone 3" },
    { id: "keur_massar", label: "Keur Massar", fee: 1000, zone: "Zone 3" },
    { id: "rufisque", label: "Rufisque", fee: 1000, zone: "Zone 3" },
  ]
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    neighborhood: DAKAR_NEIGHBORHOODS[0].id,
    address: "",
    payment: "cash",
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [whatsappLink, setWhatsappLink] = useState("")

  // Calculate fees based on selected neighborhood
  const selectedNeighborhood = DAKAR_NEIGHBORHOODS.find(n => n.id === formData.neighborhood) || DAKAR_NEIGHBORHOODS[0]
  const deliveryFee = selectedNeighborhood.fee
  const total = subtotal + deliveryFee

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const fullAddress = `${formData.address} (${selectedNeighborhood.label} - ${selectedNeighborhood.zone})`

    // Build WhatsApp Message
    const orderItemsText = items.map(item => `${item.qty}x ${item.name} (${formatFCFA(item.price * item.qty)})`).join('%0A')
    const message = `*NOUVELLE COMMANDE - KAY NDEKI*%0A%0A*Client :* ${formData.name}%0A*Téléphone :* ${formData.phone}%0A*Adresse :* ${fullAddress}%0A*Paiement :* ${formData.payment}%0A%0A*Commande :*%0A${orderItemsText}%0A%0A*Sous-total :* ${formatFCFA(subtotal)}%0A*Livraison :* ${formatFCFA(deliveryFee)}%0A*TOTAL :* ${formatFCFA(total)}`
    
    // Save to database
    const res = await createOrderAction({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      zone: `${selectedNeighborhood.label} (${selectedNeighborhood.zone})`,
      payment: formData.payment,
      subtotal,
      deliveryFee,
      total,
      items: items.map(i => ({
        key: i.key,
        id: i.key,
        name: i.name,
        details: i.details || "",
        price: i.price,
        qty: i.qty
      }))
    })

    setIsSubmitting(false)

    if (res.success) {
      setWhatsappLink(`https://wa.me/221770000000?text=${message}`)
      setIsSuccess(true)
      clear()
    } else {
      alert("Une erreur est survenue lors de l'enregistrement de votre commande. Veuillez réessayer.")
    }
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">{t("checkout_success_title")}</h1>
          <p className="text-slate-600 mb-8">
            {t("checkout_success_desc")}
          </p>
          <div className="space-y-4">
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a] px-4 py-2 w-full rounded-full h-12 font-semibold transition"
            >
              <MessageCircle className="h-5 w-5" /> {t("checkout_whatsapp_btn")}
            </a>
            <Link href="/" className="flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 w-full rounded-full h-12 font-semibold transition">
              {t("checkout_home_btn")}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">{t("checkout_empty_title")}</h1>
          <p className="text-slate-600 mb-8">
            {t("checkout_empty_desc")}
          </p>
          <Link href="/menu" className="flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/80 px-4 py-2 w-full rounded-full h-12 font-semibold">
            {t("checkout_menu_btn")}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4">
        <Link href="/menu" className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors w-fit">
          <ArrowLeft className="h-4 w-4" /> {t("checkout_back")}
        </Link>
        <h1 className="mb-8 text-3xl font-bold text-slate-800">{t("checkout_title")}</h1>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Formulaire */}
          <div className="lg:col-span-7 space-y-6">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">{t("checkout_step1")}</h2>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("checkout_name")}</label>
                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Moussa Diop"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("checkout_phone")}</label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="77 123 45 67"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("checkout_neighborhood")}</label>
                <select
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
                >
                  {DAKAR_NEIGHBORHOODS.map(n => (
                    <option key={n.id} value={n.id}>{n.label}</option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-slate-500">
                  {/* Utilisation de replace pour insérer les valeurs dynamiques de la traduction */}
                  {t("checkout_fee_notice").replace("{fee}", formatFCFA(deliveryFee)).replace("{zone}", selectedNeighborhood.zone)}
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">{t("checkout_address")}</label>
                <input
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  type="text"
                  placeholder={t("checkout_address_ph") as string}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
                />
              </div>

              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4 pt-4">{t("checkout_step2")}</h2>
              
              <div className="grid gap-4 sm:grid-cols-1">
                {[
                  { id: "cash", label: t("checkout_cash"), color: "text-green-600" },
                ].map(pm => (
                  <label key={pm.id} className={`relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${formData.payment === pm.id ? 'border-[#1A56DB] bg-blue-50/50' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={pm.id}
                      checked={formData.payment === pm.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className={`font-bold ${pm.color}`}>{pm.label}</span>
                  </label>
                ))}
              </div>
            </form>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">{t("checkout_summary")}</h2>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.key} className="flex gap-4">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 truncate">{item.name}</h4>
                      <div className="text-sm text-slate-500">{t("checkout_qty")} {item.qty}</div>
                    </div>
                    <div className="font-semibold text-slate-800">
                      {formatFCFA(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-slate-100 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>{t("checkout_subtotal")}</span>
                  <span className="font-semibold">{formatFCFA(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t("checkout_delivery")}</span>
                  <span className="font-semibold">{formatFCFA(deliveryFee)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-bold text-slate-800">
                  <span>{t("checkout_total")}</span>
                  <span className="text-[#1A56DB]">{formatFCFA(total)}</span>
                </div>
              </div>

              <Button 
                form="checkout-form"
                type="submit" 
                disabled={isSubmitting}
                className="w-full rounded-full h-14 text-lg font-bold bg-[#1A56DB] hover:bg-blue-700"
              >
                {isSubmitting ? t("checkout_submitting") : t("checkout_submit")}
              </Button>
              <p className="text-center text-xs text-slate-500 mt-4">
                {t("checkout_notice")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
