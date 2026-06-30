"use client"

import Image from "next/image"
import Link from "next/link"
import { Users, Heart, MapPin, Clock } from "lucide-react"
import { useTranslation } from "@/components/providers/language-provider"

export function AboutContent() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
                <span>🥐</span> {t("about_badge")}
              </div>
              <h1 className="text-4xl font-bold text-slate-800 md:text-5xl">
                {t("about_title")}
              </h1>
              <p className="mt-6 text-lg text-slate-500 leading-relaxed">
                {t("about_p1")}
              </p>
              <p className="mt-4 text-lg text-slate-500 leading-relaxed">
                {t("about_p2")}
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/products/hero-breakfast.png"
                alt="Sandwich Kay ndeki"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-800">{t("about_values")}</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Heart, title: t("about_passion"), desc: t("about_passion_desc") },
              { icon: Clock, title: t("about_speed"), desc: t("about_speed_desc") },
              { icon: Users, title: t("about_proximity"), desc: t("about_proximity_desc") },
              { icon: MapPin, title: t("about_local"), desc: t("about_local_desc") },
            ].map((val, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-primary">
                  <val.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">{val.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1A56DB] py-16 text-white text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold">{t("about_cta_title")}</h2>
          <p className="mt-4 text-blue-100 text-lg">{t("about_cta_sub")}</p>
          <Link
            href="/menu"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-[#1A56DB] shadow-lg transition-transform hover:scale-[1.02]"
          >
            {t("about_cta_btn")}
          </Link>
        </div>
      </section>
    </main>
  )
}
