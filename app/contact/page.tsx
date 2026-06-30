import { Metadata } from "next"
import { ContactContent } from "./contact-content"

export const metadata: Metadata = {
  title: "Contact — Kay ndeki",
  description: "Contactez Kay ndeki pour toute question sur vos commandes ou la livraison à Dakar.",
}

export default function ContactPage() {
  return <ContactContent />
}
