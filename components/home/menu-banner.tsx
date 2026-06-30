import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface MenuBannerProps {
  onDiscover: () => void
}

export function MenuBanner({ onDiscover }: MenuBannerProps) {
  return (
    <div
      onClick={onDiscover}
      className="flex flex-col overflow-hidden rounded-2xl border border-blue-100 bg-[#f0f5ff] shadow-sm transition-shadow hover:shadow-md cursor-pointer"
    >
      {/* Image on top — same aspect-video as MenuCard */}
      <div className="relative aspect-video w-full bg-blue-50 flex items-center justify-center overflow-hidden">
        <Image
          src="/products/breakfast-mix.png"
          alt="Mix Boisson et Sandwich"
          fill
          className="object-cover opacity-90"
        />
      </div>

      {/* Content — same padding as MenuCard */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-[#0f172a] leading-tight">
          Compose ton menu complet
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          Ajoute une boisson et une sauce pour un petit déjeuner parfait !
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-sm font-bold text-[#1A56DB]">Découvrir</span>
          <span className="flex items-center gap-1 rounded-full bg-[#1A56DB] px-3 py-1.5 text-xs font-semibold text-white shadow">
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  )
}

