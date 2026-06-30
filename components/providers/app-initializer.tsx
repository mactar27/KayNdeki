"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function AppInitializer({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<"splash" | "onboarding" | "ready">("splash")
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu l'onboarding
    const hasSeen = localStorage.getItem("kayndeki_has_seen_onboarding")
    
    if (hasSeen === "true") {
      setStage("ready")
      return
    }

    // Sinon, afficher le splash pendant 2 secondes puis passer à l'onboarding
    const timer = setTimeout(() => {
      setStage("onboarding")
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const finishOnboarding = () => {
    localStorage.setItem("kayndeki_has_seen_onboarding", "true")
    setStage("ready")
  }

  const slides = [
    {
      title: "Bienvenue sur Kay ndeki",
      desc: "Votre petit-déjeuner sur mesure, livré chaud chaque matin.",
      icon: "🍳"
    },
    {
      title: "Composez votre menu",
      desc: "Choisissez vos ingrédients, sauces et boissons préférés.",
      icon: "🥪"
    },
    {
      title: "Livraison rapide",
      desc: "Recevez votre commande en moins de 45 minutes partout à Dakar.",
      icon: "🛵"
    }
  ]

  return (
    <>
      <AnimatePresence mode="wait">
        {stage === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <Image
                src="/kay-ndeki-logo.jpeg"
                alt="Kay ndeki Logo"
                width={120}
                height={120}
                className="rounded-full shadow-xl mb-4"
                priority
              />
              <h1 className="font-script text-4xl text-primary">Kay ndeki</h1>
            </motion.div>
          </motion.div>
        )}

        {stage === "onboarding" && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white p-6 text-center"
          >
            <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                <div className="text-8xl mb-8">{slides[currentSlide].icon}</div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">{slides[currentSlide].title}</h2>
                <p className="text-slate-500 text-lg">{slides[currentSlide].desc}</p>
              </motion.div>
            </div>

            <div className="w-full max-w-sm pb-12">
              <div className="flex justify-center gap-2 mb-8">
                {slides.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? "w-8 bg-primary" : "w-2 bg-slate-200"}`}
                  />
                ))}
              </div>
              
              <div className="flex flex-col gap-3">
                {currentSlide < slides.length - 1 ? (
                  <button
                    onClick={() => setCurrentSlide(c => c + 1)}
                    className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 transition-transform active:scale-95"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={finishOnboarding}
                    className="w-full bg-primary text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/30 transition-transform active:scale-95"
                  >
                    Commencer
                  </button>
                )}
                
                {currentSlide < slides.length - 1 && (
                  <button
                    onClick={finishOnboarding}
                    className="text-slate-400 font-medium py-2 hover:text-slate-600 transition-colors"
                  >
                    Passer
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rendre les enfants (l'application) en arrière-plan (si stage n'est pas prêt, on le cache visuellement pour éviter les flashs de contenu, ou on le rend invisible) */}
      <div className={stage !== "ready" ? "opacity-0 pointer-events-none h-screen overflow-hidden" : "opacity-100 transition-opacity duration-500"}>
        {children}
      </div>
    </>
  )
}
