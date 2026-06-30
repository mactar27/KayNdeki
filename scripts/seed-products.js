import mysql from "mysql2/promise"

const INITIAL_PRODUCTS = [
  {
    id: "sand-viande",
    category: "sandwich",
    name: "Sandwich viande haché",
    name_wo: "Mburu yàpp bu ñu melli",
    description: "",
    price: 1000,
    image: "/products/sandwich-viande-hachee.png",
    available: true,
  },
  {
    id: "sand-thon",
    category: "sandwich",
    name: "Sandwich Thon",
    name_wo: "Mburu toon",
    description: "",
    price: 750,
    image: "/products/sandwich-thon.png",
    available: true,
  },
  {
    id: "sand-petit-pois",
    category: "sandwich",
    name: "Sandwich + Petit Pois",
    name_wo: "Mburu ak poa",
    description: "",
    price: 700,
    image: "/products/sandwich-petit-pois.png",
    available: true,
  },
  {
    id: "sand-ndambe",
    category: "sandwich",
    name: "Sandwich + Ndambé",
    name_wo: "Mburu ak ndambé",
    description: "",
    price: 700,
    image: "/products/ingredients.png",
    available: true,
  },
  {
    id: "sand-foie",
    category: "sandwich",
    name: "Sandwich Foie",
    name_wo: "Mburu fwa",
    description: "",
    price: 1200,
    image: "/products/sandwich-foie.png",
    available: true,
  },
  {
    id: "sand-omelette-frites",
    category: "sandwich",
    name: "Sandwich omelette + Frites",
    name_wo: "Mburu nen ak fritte",
    description: "",
    price: 1200,
    image: "/products/sandwich-omelette.png",
    available: true,
  },
  {
    id: "sand-mortadelle",
    category: "sandwich",
    name: "Sandwich mortadelle",
    name_wo: "Mburu mortadel",
    description: "",
    price: 700,
    image: "/products/sandwich-mortadelle.png",
    available: true,
  },
]

async function seedProducts() {
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
    console.log("Connexion au serveur TiDB pour le seed...")
    const connection = await mysql.createConnection({
      host: parsedUrl.hostname,
      port: parsedUrl.port ? Number(parsedUrl.port) : 3306,
      user: decodeURIComponent(parsedUrl.username),
      password: decodeURIComponent(parsedUrl.password),
      database: parsedUrl.pathname.replace(/^\//, ""),
      ssl: needsSsl ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
    })

    console.log("Insertion des produits initiaux...")
    
    // Check if products already exist to avoid duplicates
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM products')
    if (rows[0].count > 0) {
      console.log("Les produits existent déjà, on ne fait rien.")
      await connection.end()
      return
    }

    for (const product of INITIAL_PRODUCTS) {
      await connection.execute(
        `INSERT INTO products (id, category, name, name_wo, description, price, image, available)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.category,
          product.name,
          product.name_wo,
          product.description,
          product.price,
          product.image,
          product.available,
        ]
      )
    }

    console.log("✅ Produits insérés avec succès !")
    await connection.end()
  } catch (error) {
    console.error("❌ Erreur lors du seed des produits:", error)
  }
}

seedProducts()
