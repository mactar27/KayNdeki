import { getMenu } from "@/lib/queries"
import { MenuSectionClient } from "./menu-section-client"

export async function MenuSection() {
  const items = await getMenu()

  return <MenuSectionClient items={items} />
}
