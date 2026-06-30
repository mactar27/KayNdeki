"use client"

import Link from "next/link"
import { Bike, ShieldCheck, Headphones, Leaf } from "lucide-react"
import { useTranslation } from "@/components/providers/language-provider"

export function SiteFooter() {
  const { t } = useTranslation()

  const FEATURES = [
    { icon: Bike, title: t("feat_delivery"), sub: t("feat_delivery_sub") },
    { icon: ShieldCheck, title: t("feat_payment"), sub: t("feat_payment_sub") },
    { icon: Headphones, title: t("feat_service"), sub: t("feat_service_sub") },
    { icon: Leaf, title: t("feat_fresh"), sub: t("feat_fresh_sub") },
  ]

  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-2 gap-6 border-b border-border pb-8 md:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-6 md:flex-row md:items-start">
          <div className="max-w-xs text-center md:text-left">
            <span className="font-script text-2xl text-primary">Kay ndeki</span>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">
              {t("footer_desc")}
            </p>
          </div>
          <nav className="flex flex-col items-center gap-2 md:items-start" aria-label="Liens pied de page">
            <Link href="/menu" className="text-sm text-muted-foreground hover:text-primary">
              {t("menu_compose_full")}
            </Link>
            <Link href="/livraison" className="text-sm text-muted-foreground hover:text-primary">
              {t("footer_zones")}
            </Link>
            <Link href="/a-propos" className="text-sm text-muted-foreground hover:text-primary">
              {t("footer_about")}
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
              {t("footer_contact")}
            </Link>
          </nav>
          <div className="text-center text-sm text-muted-foreground md:text-right">
            <p className="font-medium text-foreground">Contact</p>
            <p className="mt-2">Dakar, Sénégal</p>
            <p>+221 77 000 00 00</p>
            <p>bonjour@kayndeki.sn</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-1">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Kay ndeki. {t("footer_rights")}
          </p>
          <p className="text-center text-xs text-muted-foreground">
            {t("footer_by")}{" "}
            <a
              href="https://wockytech.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              Wockytech
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
