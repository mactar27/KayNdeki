"use client"

import { Bike, MapPin, Clock, AlertCircle, CheckCircle } from "lucide-react"
import { useTranslation } from "@/components/providers/language-provider"
import Link from "next/link"

export function LivraisonContent() {
  const { t } = useTranslation()

  const ZONES = [
    { zone: t("delivery_zone_1"), quartiers: t("delivery_zone_1_quartiers").split(", "), frais: t("delivery_zone_1_frais"), delai: t("delivery_zone_1_delai") },
    { zone: t("delivery_zone_2"), quartiers: t("delivery_zone_2_quartiers").split(", "), frais: t("delivery_zone_2_frais"), delai: t("delivery_zone_2_delai") },
    { zone: t("delivery_zone_3"), quartiers: t("delivery_zone_3_quartiers").split(", "), frais: t("delivery_zone_3_frais"), delai: t("delivery_zone_3_delai") },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-[#1A56DB] py-16 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <Bike className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold md:text-5xl">{t("delivery_title")}</h1>
          <p className="mt-4 text-xl text-blue-100">
            {t("delivery_sub")}
          </p>
        </div>
      </section>

      {/* Infos rapides */}
      <section className="border-b border-slate-100 bg-white py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: Clock, label: t("delivery_hours_label"), value: t("delivery_hours_value"), sub: t("delivery_hours_sub") },
              { icon: Bike, label: t("delivery_delay_label"), value: t("delivery_delay_value"), sub: t("delivery_delay_sub") },
              { icon: MapPin, label: t("delivery_zone_label"), value: t("delivery_zone_value"), sub: t("delivery_zone_sub") },
            ].map((info, i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#1A56DB]">
                  <info.icon className="h-6 w-6" />
                </span>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{info.label}</div>
                  <div className="font-bold text-slate-800">{info.value}</div>
                  <div className="text-xs text-slate-500">{info.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zones */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-slate-800">{t("delivery_zones_title")}</h2>
          <div className="space-y-4">
            {ZONES.map((z, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4 bg-slate-50 px-6 py-4">
                  <h3 className="font-bold text-slate-800">{z.zone}</h3>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">{t("delivery_fee_label")}</div>
                      <div className="font-bold text-[#1A56DB]">{z.frais}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">{t("delivery_time_label")}</div>
                      <div className="font-bold text-slate-700">{z.delai}</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 px-6 py-4">
                  {z.quartiers.map((q) => (
                    <span key={q} className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                      <CheckCircle className="h-3.5 w-3.5" /> {q}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500">
                    {t("delivery_other_quartiers")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-5">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
            <p className="text-sm text-orange-700">
              <strong>{t("delivery_note_bold_1")}</strong>{t("delivery_note_text")}<strong>{t("delivery_note_bold_2")}</strong>{t("delivery_note_text_2")}
            </p>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-800">{t("delivery_how")}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { num: t("delivery_step1_num"), title: t("delivery_step1_title"), desc: t("delivery_step1_desc") },
              { num: t("delivery_step2_num"), title: t("delivery_step2_title"), desc: t("delivery_step2_desc") },
              { num: t("delivery_step3_num"), title: t("delivery_step3_title"), desc: t("delivery_step3_desc") },
            ].map((step, i) => (
              <div key={i} className="relative rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 text-5xl font-black text-slate-100">{step.num}</div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-3xl font-bold text-slate-800">{t("delivery_cta_title")}</h2>
          <p className="mt-4 text-slate-500">{t("delivery_cta_sub")}</p>
          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1A56DB] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform hover:scale-[1.02]"
          >
            {t("delivery_cta_btn")}
          </Link>
        </div>
      </section>
    </main>
  )
}
