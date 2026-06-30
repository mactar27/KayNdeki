"use client"

import { useTranslation } from "@/components/providers/language-provider"

export function MenuHeader() {
  const { t } = useTranslation()

  return (
    <div className="mb-12 text-center">
      <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
        {t("menu_compose")}
      </h2>
      <p className="mt-4 text-lg text-muted-foreground">
        {t("menu_compose_sub")}
      </p>
    </div>
  )
}
