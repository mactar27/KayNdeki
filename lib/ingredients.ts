export type IngredientCategory = "base" | "protein" | "veggies" | "extras" | "sauces"

export interface Ingredient {
  id: string
  name: string
  nameEn: string
  nameWo: string
  category: IngredientCategory
  price: number
}

export const INGREDIENTS: Ingredient[] = [
  // Bases
  { id: "pain-demi", name: "1/2 Pain", nameEn: "1/2 Bread", nameWo: "Mburu", category: "base", price: 150 },
  { id: "pain-entier", name: "Pain Entier", nameEn: "Whole Bread", nameWo: "Mburu mu mat", category: "base", price: 300 },
  
  // Protéines / Plats
  { id: "prot-viande", name: "Viande hachée", nameEn: "Minced Meat", nameWo: "Yàpp bu ñu melli", category: "protein", price: 500 },
  { id: "prot-thon", name: "Thon", nameEn: "Tuna", nameWo: "Toon", category: "protein", price: 400 },
  { id: "prot-foie", name: "Foie", nameEn: "Liver", nameWo: "Fwa", category: "protein", price: 600 },
  { id: "prot-mortadelle", name: "Mortadelle", nameEn: "Bologna", nameWo: "Mortadel", category: "protein", price: 300 },
  { id: "prot-omelette", name: "Omelette", nameEn: "Omelet", nameWo: "Nen", category: "protein", price: 250 },
  { id: "prot-ndambe", name: "Ndambé (Haricots)", nameEn: "Beans", nameWo: "Ndambé", category: "protein", price: 300 },
  { id: "prot-petit-pois", name: "Petit Pois", nameEn: "Green Peas", nameWo: "Poa", category: "protein", price: 250 },

  // Crudités (Gratuit ou faible coût)
  { id: "veg-salade", name: "Salade", nameEn: "Lettuce", nameWo: "Salad", category: "veggies", price: 0 },
  { id: "veg-tomate", name: "Tomates", nameEn: "Tomatoes", nameWo: "Tamaati", category: "veggies", price: 0 },
  { id: "veg-oignon", name: "Oignons", nameEn: "Onions", nameWo: "Linyon", category: "veggies", price: 0 },
  { id: "veg-mais", name: "Maïs", nameEn: "Corn", nameWo: "Maka", category: "veggies", price: 50 },
  { id: "veg-concombre", name: "Concombres", nameEn: "Cucumber", nameWo: "Kankombar", category: "veggies", price: 50 },

  // Suppléments
  { id: "ext-frites", name: "Frites", nameEn: "Fries", nameWo: "Fritte", category: "extras", price: 300 },
  { id: "ext-fromage", name: "Fromage", nameEn: "Cheese", nameWo: "Froomaas", category: "extras", price: 200 },
  { id: "ext-oeuf-dur", name: "Œuf dur", nameEn: "Boiled Egg", nameWo: "Nen bu bax", category: "extras", price: 150 },

  // Sauces
  { id: "sauce-mayo", name: "Mayonnaise", nameEn: "Mayonnaise", nameWo: "Maayo", category: "sauces", price: 0 },
  { id: "sauce-ketchup", name: "Ketchup", nameEn: "Ketchup", nameWo: "Ketsop", category: "sauces", price: 0 },
  { id: "sauce-moutarde", name: "Moutarde", nameEn: "Mustard", nameWo: "Mustard", category: "sauces", price: 0 },
  { id: "sauce-maison", name: "Sauce Maison", nameEn: "House Sauce", nameWo: "Soosu kër", category: "sauces", price: 0 },
  { id: "sauce-piment", name: "Piment", nameEn: "Hot Sauce", nameWo: "Kaani", category: "sauces", price: 0 },
]

export const INGREDIENT_CATEGORIES = {
  base: "Base (Pain)",
  protein: "Garniture Principale",
  veggies: "Crudités",
  extras: "Suppléments",
  sauces: "Sauces"
}
