import { Metadata } from "next"
import { CommandeClient } from "./commande-client"

export const metadata: Metadata = {
  title: "Finaliser la commande — Kay ndeki",
  description: "Validez votre commande Kay ndeki pour une livraison rapide à Dakar.",
}

export default function CommandePage() {
  return <CommandeClient />
}
