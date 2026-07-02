import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "QR Code - Kay ndeki",
  description: "Flashez ce QR Code pour commander votre petit déjeuner chez Kay ndeki.",
}

export default function QRCodePage() {
  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4 print:p-0 print:bg-white">
      {/* 
        This container is styled to look like a small printable poster or table stand.
        A4 size roughly scales to 794x1123px, but we'll use a clean fixed-aspect card. 
      */}
      <div className="bg-white w-full max-w-md aspect-[3/4] rounded-3xl shadow-2xl flex flex-col items-center justify-between p-10 text-center border-4 border-[#1A56DB] relative overflow-hidden print:shadow-none print:border-none print:w-full print:max-w-none print:h-screen print:rounded-none">
        
        {/* Background Decoration */}
        <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-amber-100 rounded-full mix-blend-multiply opacity-50 blur-2xl"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-blue-100 rounded-full mix-blend-multiply opacity-50 blur-2xl"></div>

        <div className="relative z-10 w-full">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-2 rounded-full shadow-md border border-slate-100">
              <Image
                src="/kay-ndeki-logo.jpeg"
                alt="Kay ndeki Logo"
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            </div>
          </div>

          <h1 className="font-script text-5xl text-[#1A56DB] mb-2">Kay ndeki</h1>
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">
            Faim de petit déj ?
          </h2>
          <p className="text-slate-500 mt-2">
            Flashez pour commander sans attendre !
          </p>
        </div>

        {/* QR Code */}
        <div className="relative z-10 bg-white p-6 rounded-3xl shadow-lg border border-slate-100 my-8">
          <Image
            src="/qr-code.png"
            alt="QR Code Kay Ndeki"
            width={250}
            height={250}
            className="w-48 h-48 sm:w-64 sm:h-64 object-contain"
          />
        </div>

        {/* Footer info */}
        <div className="relative z-10 w-full border-t-2 border-dashed border-slate-200 pt-6">
          <div className="flex items-center justify-center gap-2 text-slate-800 font-semibold text-lg">
            <span>🌐</span> www.kay-ndeki.com
          </div>
          <p className="text-sm text-slate-400 mt-1">Prêt en 15 minutes • Sur place ou à emporter</p>
        </div>
      </div>
      
      {/* Floating print button for browsers */}
      <button 
        onClick={() => window.print()}
        className="fixed bottom-6 right-6 bg-[#1A56DB] hover:bg-blue-700 text-white p-4 rounded-full shadow-xl print:hidden transition-transform hover:scale-110 flex items-center justify-center group"
        title="Imprimer le QR Code"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
      </button>
    </div>
  )
}
