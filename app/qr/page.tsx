import Image from "next/image"
import type { Metadata } from "next"
import { PrintButton } from "./print-button"

export const metadata: Metadata = {
  title: "QR Code - Kay ndeki",
  description: "Flashez ce QR Code pour commander votre petit déjeuner chez Kay ndeki.",
}

export default function QRCodePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 print:p-0 print:bg-white">
      {/* 
        A4 proportion wrapper, responsive on screen.
      */}
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-xl flex flex-col items-center justify-center p-8 sm:p-12 border border-slate-100 relative overflow-hidden print:shadow-none print:border-none print:w-full print:h-screen print:max-w-none print:rounded-none print:p-0">
        
        {/* Top Decorative Header */}
        <div className="w-full text-center space-y-6 z-10">
          <div className="mx-auto bg-white p-3 rounded-full shadow-sm border border-slate-100 inline-block">
            <Image
              src="/kay-ndeki-logo.jpeg"
              alt="Kay ndeki Logo"
              width={100}
              height={100}
              className="rounded-full object-cover w-20 h-20 sm:w-24 sm:h-24"
            />
          </div>

          <div>
            <h1 className="font-script text-5xl sm:text-6xl text-[#1A56DB] mb-3">Kay ndeki</h1>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-widest">
              Commandez ici
            </h2>
            <p className="text-slate-500 mt-2 text-lg">
              Scannez le QR code avec votre téléphone
            </p>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="relative z-10 bg-white p-4 sm:p-6 rounded-3xl shadow-sm border-2 border-slate-100 my-10">
          <Image
            src="/qr-code.png"
            alt="QR Code Kay Ndeki"
            width={300}
            height={300}
            className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
          />
        </div>

        {/* Footer info */}
        <div className="relative z-10 w-full text-center space-y-2">
          <div className="inline-flex items-center justify-center gap-2 bg-sky-50 px-6 py-3 rounded-full text-[#1A56DB] font-bold text-lg sm:text-xl border border-sky-100">
            <span>🌐</span> www.kay-ndeki.com
          </div>
          <p className="text-slate-400 font-medium pt-4">Petit déjeuner 100% Sénégalais</p>
        </div>
      </div>
      
      {/* Floating print button for browsers */}
      <PrintButton />
    </div>
  )
}
