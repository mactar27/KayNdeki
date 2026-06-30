import { getMenu } from "@/lib/queries"
import { type MenuCategory, CATEGORY_LABELS } from "@/lib/menu-data"
import { MenuInteractive } from "./menu-interactive"
import { MenuHeader } from "./menu-header"

export async function MenuSection() {
  const items = await getMenu()
  
  // Group items by category
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  // Define the order of categories to display based on the UI logic
  const categoryOrder: MenuCategory[] = [
    "base",
    "protein",
    "legumes_secs",
    "feculents",
    "legumes_frais",
    "sauce",
    "drink",
  ]

  return (
    <section id="menu" className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-6xl px-4">
        <MenuHeader />

          <MenuInteractive items={items} />
      </div>
    </section>
  )
}
