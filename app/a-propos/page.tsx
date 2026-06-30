import { Metadata } from "next"
import { AboutContent } from "./about-content"

export const metadata: Metadata = {
  title: "À propos — Kay ndeki",
  description: "Découvrez l'histoire de Kay ndeki, votre petit-déjeuner sur-mesure livré partout à Dakar.",
}

export default function AProposPage() {
  return <AboutContent />
}
