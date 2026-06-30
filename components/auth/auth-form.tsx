"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerAction, loginAction } from "@/app/actions/auth"

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    const action = mode === "login" ? loginAction : registerAction
    const result = await action({ error: undefined, ok: false }, formData)
    setLoading(false)
    if (result?.error) {
      toast.error(result.error)
      return
    }
    toast.success(mode === "login" ? "Connexion réussie !" : "Compte créé avec succès !")
    router.push("/")
    router.refresh()
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {mode === "register" && (
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" name="name" placeholder="Awa Diop" required autoComplete="name" />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="awa@email.com" required autoComplete="email" />
      </div>
      {mode === "register" && (
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="77 123 45 67" autoComplete="tel" />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          minLength={6}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === "login" ? "Se connecter" : "Créer mon compte"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="font-medium text-primary hover:underline">
              Inscris-toi
            </Link>
          </>
        ) : (
          <>
            Déjà un compte ?{" "}
            <Link href="/connexion" className="font-medium text-primary hover:underline">
              Connecte-toi
            </Link>
          </>
        )}
      </p>
    </form>
  )
}
