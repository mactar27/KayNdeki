"use server"

import { cookies } from "next/headers"

export async function loginAdminAction(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD || "Ndeki@Dakar2026!"

  if (password === correctPassword) {
    const cookieStore = await cookies()
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semaine
      path: "/",
    })
    return { success: true }
  }

  return { success: false, error: "Mot de passe incorrect" }
}

export async function logoutAdminAction() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  return { success: true }
}

export async function checkAdminStatus() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")
  return session?.value === "authenticated"
}

export async function loginAction(prevState: any, formData: FormData) {
  // TODO: Implémenter la logique de connexion client
  // Pour le moment on simule une erreur car ce n'est pas encore implémenté
  return { error: "Connexion non implémentée", ok: false }
}

export async function registerAction(prevState: any, formData: FormData) {
  // TODO: Implémenter la logique d'inscription client
  // Pour le moment on simule une erreur car ce n'est pas encore implémenté
  return { error: "Inscription non implémentée", ok: false }
}
