"use client"

import Link from "next/link"
import { SearchX, ArrowLeft } from "lucide-react"
import { useTranslation } from "@/components/providers/language-provider"

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-blue-200 blur-3xl opacity-50 rounded-full" />
        <div className="relative bg-white p-6 rounded-full shadow-sm border border-slate-100 text-[#1A56DB]">
          <SearchX className="h-16 w-16" />
        </div>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-script text-primary mb-4 tracking-tight">
        {t("not_found_title")}
      </h1>
      
      <p className="text-lg text-slate-500 mb-8 max-w-md">
        {t("not_found_desc")}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 bg-[#1A56DB] text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-700 transition shadow-sm hover:shadow active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
          {t("not_found_home_btn")}
        </Link>
        
        <Link 
          href="/menu"
          className="flex items-center justify-center bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-full font-bold hover:bg-slate-50 hover:text-slate-900 transition active:scale-95"
        >
          {t("not_found_menu_btn")}
        </Link>
      </div>
    </main>
  )
}
