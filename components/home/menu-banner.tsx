"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface MenuBannerProps {
  onDiscover: () => void
}

export function MenuBanner({ onDiscover }: MenuBannerProps) {
  return (
    <div className="mt-12 flex flex-col md:flex-row items-center gap-6 rounded-3xl bg-blue-50/80 p-6 md:p-8">
      {/* Image container */}
      <div className="relative flex size-32 shrink-0 items-center justify-center rounded-full bg-white shadow-sm md:size-40">
        <div className="relative size-24 md:size-32">
          {/* We'll use a placeholder or an existing image. Using hero-breakfast for now, or just some emojis if image doesn't fit well. */}
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            🍹
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
        <h3 className="text-2xl font-bold text-slate-800 md:text-3xl">
          Compose ton menu complet
        </h3>
        <p className="mt-2 text-slate-600 md:text-lg">
          Ajoute une boisson et une sauce pour un petit déjeuner parfait !
        </p>

        {/* Button */}
        <button
          onClick={onDiscover}
          className="mt-6 flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-[#1A56DB] shadow-sm transition hover:shadow-md"
        >
          Découvrir les boissons
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  )
}
