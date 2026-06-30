"use client"

import Image from "next/image"
import { Bike, ShieldCheck, ArrowRight } from "lucide-react"
import { useTranslation } from "@/components/providers/language-provider"

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden bg-background pt-8 pb-12">
      <div className="mx-auto max-w-6xl px-4">
        {/* Main Hero Card */}
        <div className="grid items-center gap-8 md:grid-cols-2 rounded-[2rem] bg-slate-50/50 p-8 shadow-sm ring-1 ring-slate-100">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600">
              <span>🥐</span> {t("hero_badge")}
            </div>
            <h1 className="font-script text-6xl leading-none text-primary md:text-7xl">Kay ndeki</h1>
            <p className="mt-3 text-3xl font-bold text-slate-800 text-balance">
              {t("hero_sub")}
            </p>
            <p className="mt-4 max-w-md text-slate-500 text-pretty leading-relaxed">
              {t("hero_desc")}
            </p>

            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
              {[
                { icon: Bike, title: t("feat_delivery"), sub: t("feat_delivery_sub") },
                { icon: ShieldCheck, title: t("feat_payment"), sub: t("feat_payment_sub") },
              ].map((p) => (
                <div key={p.title} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-primary">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div className="leading-tight">
                    <dt className="text-sm font-bold text-slate-800">{p.title}</dt>
                    <dd className="text-xs text-slate-500">{p.sub}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <a
              href="/menu"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#1A56DB] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-transform hover:scale-[1.02]"
            >
              {t("hero_cta")}
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem]">
            <Image
              src="/products/hero-breakfast.png"
              alt="Petit déjeuner Kay ndeki : sandwich, café et ndambé"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Features Bar */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4 border-r border-slate-100 last:border-0 pr-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
              <Bike className="h-6 w-6" />
            </span>
            <div>
              <div className="font-bold text-slate-800">{t("feat_delivery")}</div>
              <div className="text-sm text-slate-500">{t("feat_delivery_sub")}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 border-r border-slate-100 last:border-0 pr-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <div className="font-bold text-slate-800">{t("feat_payment")}</div>
              <div className="text-sm text-slate-500">{t("feat_payment_sub")}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 border-r border-slate-100 last:border-0 pr-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </span>
            <div>
              <div className="font-bold text-slate-800">{t("feat_service")}</div>
              <div className="text-sm text-slate-500">{t("feat_service_sub")}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            </span>
            <div>
              <div className="font-bold text-slate-800">{t("feat_fresh")}</div>
              <div className="text-sm text-slate-500">{t("feat_fresh_sub")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
