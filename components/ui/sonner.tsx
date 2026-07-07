"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "group w-full sm:w-[380px] flex items-start gap-3 p-4 backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200/50 dark:border-slate-800/50 transition-all",
          title: "text-[15px] font-semibold text-slate-900 dark:text-slate-50 leading-tight tracking-tight",
          description: "text-[14px] text-slate-600 dark:text-slate-400 mt-1 leading-snug",
          icon: "mt-0.5",
          actionButton: "bg-[#1A56DB] text-white px-3 py-1.5 rounded-full text-xs font-semibold mt-2",
          cancelButton: "bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold mt-2",
        },
      }}
      icons={{
        success: (
          <img src="/icon.jpg" alt="Kay Ndeki" className="w-10 h-10 rounded-[10px] shadow-sm object-cover" />
        ),
        info: (
          <img src="/icon.jpg" alt="Kay Ndeki" className="w-10 h-10 rounded-[10px] shadow-sm object-cover" />
        ),
        warning: (
          <img src="/icon.jpg" alt="Kay Ndeki" className="w-10 h-10 rounded-[10px] shadow-sm object-cover" />
        ),
        error: (
          <img src="/icon.jpg" alt="Kay Ndeki" className="w-10 h-10 rounded-[10px] shadow-sm object-cover" />
        ),
        loading: (
          <Loader2Icon className="size-5 animate-spin text-[#1A56DB]" />
        ),
      }}
      {...props}
    />
  )
}

export { Toaster }
