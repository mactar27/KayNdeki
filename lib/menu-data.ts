// Catalogue de référence Kay ndeki — prix en FCFA.
// Sert de source pour le seed de la base et de repli si la BDD est indisponible.

export type MenuCategory = "sandwich"

export interface MenuItem {
  id: string
  category: MenuCategory
  name: string
  nameWo?: string // Wolof name
  nameEn?: string // English name
  description: string
  price: number
  image: string
  available: boolean
}

export const DELIVERY_FEE = 300

export const MENU: MenuItem[] = [
  {
    id: "sand-viande",
    category: "sandwich",
    name: "Sandwich viande haché",
    nameWo: "Mburu yàpp bu ñu melli",
    description: "",
    price: 1000,
    image: "/products/sandwich-viande-hachee.png",
    available: true,
  },
  {
    id: "sand-thon",
    category: "sandwich",
    name: "Sandwich Thon",
    nameWo: "Mburu toon",
    description: "",
    price: 750,
    image: "/products/sandwich-thon.png",
    available: true,
  },
  {
    id: "sand-petit-pois",
    category: "sandwich",
    name: "Sandwich + Petit Pois",
    nameWo: "Mburu ak poa",
    description: "",
    price: 700,
    image: "/products/sandwich-petit-pois.png",
    available: true,
  },
  {
    id: "sand-ndambe",
    category: "sandwich",
    name: "Sandwich + Ndambé",
    nameWo: "Mburu ak ndambé",
    description: "",
    price: 700,
    image: "/products/ingredients.png",
    available: true,
  },
  {
    id: "sand-foie",
    category: "sandwich",
    name: "Sandwich Foie",
    nameWo: "Mburu fwa",
    description: "",
    price: 1200,
    image: "/products/sandwich-foie.png",
    available: true,
  },
  {
    id: "sand-omelette-frites",
    category: "sandwich",
    name: "Sandwich omelette + Frites",
    nameWo: "Mburu nen ak fritte",
    description: "",
    price: 1200,
    image: "/products/sandwich-omelette.png",
    available: true,
  },
  {
    id: "sand-mortadelle",
    category: "sandwich",
    name: "Sandwich mortadelle",
    nameWo: "Mburu mortadel",
    description: "",
    price: 700,
    image: "/products/sandwich-mortadelle.png",
    available: true,
  },
]

export const CATEGORY_LABELS: Record<MenuCategory, string> = {
  sandwich: "Sandwichs",
  ingredients: "Ingrédients",
  sauce: "Sauces",
  breakfast: "Petit Déjeuner",
  drink: "Boissons",
}

export const CATEGORY_LABELS_WO: Record<MenuCategory, string> = {
  sandwich: "Mburu yi",
  ingredients: "Li ci biir",
  sauce: "Maayo yi",
  breakfast: "Ndeki yi",
  drink: "Ndox mi",
}

export const CATEGORY_LABELS_EN: Record<MenuCategory, string> = {
  sandwich: "Sandwiches",
  ingredients: "Ingredients",
  sauce: "Sauces",
  breakfast: "Breakfast",
  drink: "Drinks",
}

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
}

export function getItemsByCategory(category: MenuCategory, items: MenuItem[] = MENU) {
  return items.filter((i) => i.category === category)
}
