import { Metadata } from "next"
import { LivraisonContent } from "./livraison-content"

export const metadata: Metadata = {
  title: "Livraison — Kay ndeki",
  description: "Informations sur les zones et tarifs de livraison de Kay ndeki à Dakar.",
}

export default function LivraisonPage() {
  return <LivraisonContent />
}
