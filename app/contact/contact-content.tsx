"use client"

import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react"
import { useTranslation } from "@/components/providers/language-provider"

export function ContactContent() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
            <span>👋</span> {t("contact_badge")}
          </div>
          <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">{t("contact_title")}</h1>
          <p className="mt-4 text-lg text-slate-500">
            {t("contact_sub")}
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">

            {/* Infos de contact */}
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-800">{t("contact_coords")}</h2>

              {[
                {
                  icon: MessageCircle,
                  label: t("contact_whatsapp_label"),
                  value: "+221 77 000 00 00",
                  sub: t("contact_whatsapp_sub"),
                  href: "https://wa.me/221770000000",
                  color: "bg-green-50 text-green-600",
                },
                {
                  icon: Phone,
                  label: t("contact_phone_label"),
                  value: "+221 77 000 00 00",
                  sub: t("contact_phone_sub"),
                  href: "tel:+221770000000",
                  color: "bg-blue-50 text-[#1A56DB]",
                },
                {
                  icon: Mail,
                  label: t("contact_email_label"),
                  value: "bonjour@kayndeki.sn",
                  sub: t("contact_email_sub"),
                  href: "mailto:bonjour@kayndeki.sn",
                  color: "bg-orange-50 text-orange-500",
                },
                {
                  icon: MapPin,
                  label: t("contact_address_label"),
                  value: "Dakar, Sénégal",
                  sub: t("contact_address_sub"),
                  href: null,
                  color: "bg-slate-100 text-slate-600",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="font-bold text-slate-800 hover:text-[#1A56DB] transition-colors">{item.value}</a>
                    ) : (
                      <div className="font-bold text-slate-800">{item.value}</div>
                    )}
                    <div className="text-xs text-slate-500">{item.sub}</div>
                  </div>
                </div>
              ))}

              {/* Horaires */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-5 w-5 text-[#1A56DB]" />
                  <h3 className="font-bold text-slate-800">{t("contact_hours")}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    { day: t("contact_hour_mon_fri"), hours: t("contact_hour_mon_fri_val") },
                    { day: t("contact_hour_sat"), hours: t("contact_hour_sat_val") },
                    { day: t("contact_hour_sun"), hours: t("contact_hour_sun_val") },
                  ].map((h) => (
                    <div key={h.day} className="flex justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                      <span className="text-slate-500">{h.day}</span>
                      <span className={`font-medium ${h.hours === "Fermé" ? "text-red-500" : "text-slate-800"}`}>{h.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-slate-800">{t("contact_form_title")}</h2>
              <form className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="name">
                      {t("contact_name")}
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Awa Diallo"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="phone">
                      {t("contact_phone")}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+221 77 000 00 00"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="email">
                    {t("contact_email")}
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="awa@example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="sujet">
                    {t("contact_subject")}
                  </label>
                  <select
                    id="sujet"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
                  >
                    <option value="">{t("contact_subject_placeholder")}</option>
                    <option>{t("contact_subject_1")}</option>
                    <option>{t("contact_subject_2")}</option>
                    <option>{t("contact_subject_3")}</option>
                    <option>{t("contact_subject_4")}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor="message">
                    {t("contact_message")}
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder={t("contact_message_placeholder")}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition resize-none focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#1A56DB] py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 hover:scale-[1.01]"
                >
                  {t("contact_send")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
