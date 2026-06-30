"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loginAdminAction } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

export default function BossLoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const res = await loginAdminAction(password)
    
    if (res.success) {
      router.push("/admin")
      router.refresh()
    } else {
      setError(res.error || "Erreur")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
            <Lock className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-8">Accès Restreint</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              placeholder="Mot de passe..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-lg outline-none transition focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/20"
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">{error}</p>
          )}

          <Button 
            type="submit" 
            disabled={isLoading || !password}
            className="w-full rounded-full h-12 font-bold bg-slate-800 hover:bg-slate-900"
          >
            {isLoading ? "Vérification..." : "Entrer"}
          </Button>
        </form>
      </div>
    </div>
  )
}
