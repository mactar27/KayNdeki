import mysql from "mysql2/promise"

const DRINKS = [
  {
    id: "drink-cafe",
    category: "drink",
    name: "Café",
    name_wo: "Kafe",
    name_en: "Coffee",
    description: "",
    price: 500,
    image: "/products/boisson-cafe.png",
    available: true,
  },
  {
    id: "drink-orange",
    category: "drink",
    name: "Jus d'orange",
    name_wo: "Siiw orans",
    name_en: "Orange Juice",
    description: "",
    price: 600,
    image: "/products/boisson-jus-orange.png",
    available: true,
  },
  {
    id: "drink-bissap",
    category: "drink",
    name: "Bissap",
    name_wo: "Bissap",
    name_en: "Bissap",
    description: "",
    price: 500,
    image: "/products/boisson-bissap.png",
    available: true,
  },
  {
    id: "drink-eau",
    category: "drink",
    name: "Eau minérale",
    name_wo: "Ndoxum sifaar",
    name_en: "Mineral Water",
    description: "",
    price: 300,
    image: "/products/boisson-eau.png",
    available: true,
  },
  {
    id: "drink-soda",
    category: "drink",
    name: "Boisson gazeuse",
    name_wo: "Gaz",
    name_en: "Soda",
    description: "",
    price: 500,
    image: "/products/boisson-soda.png",
    available: true,
  },
  {
    id: "drink-the",
    category: "drink",
    name: "Thé",
    name_wo: "Ataya",
    name_en: "Tea",
    description: "",
    price: 500,
    image: "/products/boisson-the.png",
    available: true,
  },
]

async function addDrinks() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("Erreur: DATABASE_URL non trouvée dans .env.local")
    process.exit(1)
  }

  const parsedUrl = new URL(url)
  const needsSsl =
    parsedUrl.searchParams.get("sslaccept") === "strict" ||
    parsedUrl.port === "4000" ||
    parsedUrl.hostname.includes("tidbcloud.com")

  try {
    const connection = await mysql.createConnection({
      host: parsedUrl.hostname,
      port: parsedUrl.port ? Number(parsedUrl.port) : 3306,
      user: decodeURIComponent(parsedUrl.username),
      password: decodeURIComponent(parsedUrl.password),
      database: parsedUrl.pathname.replace(/^\//, ""),
      ssl: needsSsl ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
    })

    for (const drink of DRINKS) {
      // Use INSERT IGNORE to prevent duplicate errors
      await connection.execute(
        `INSERT IGNORE INTO products (id, category, name, name_wo, name_en, description, price, image, available)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          drink.id,
          drink.category,
          drink.name,
          drink.name_wo,
          drink.name_en,
          drink.description,
          drink.price,
          drink.image,
          drink.available,
        ]
      )
    }

    console.log("✅ Boissons ajoutées avec succès (y compris Boisson gazeuse).")
    await connection.end()
  } catch (error) {
    console.error("❌ Erreur:", error)
  }
}

addDrinks()
