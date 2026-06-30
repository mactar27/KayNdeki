import mysql from "mysql2/promise"

const translations = {
  "sand-ndambe": "Bean Sandwich (Ndambé)",
  "sand-petit-pois": "Green Pea Sandwich",
  "sand-foie": "Liver Sandwich",
  "sand-thon": "Tuna Sandwich",
  "sand-mortadelle": "Bologna Sandwich",
  "sand-omelette-frites": "Omelet & Fries Sandwich",
  "sand-viande": "Minced Meat Sandwich"
}

async function updateDb() {
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

    for (const [id, nameEn] of Object.entries(translations)) {
      await connection.execute("UPDATE products SET name_en = ? WHERE id = ?", [nameEn, id])
    }
    
    console.log("✅ Traductions anglaises ajoutées pour les produits de base.")
    
    await connection.end()
  } catch (error) {
    console.error("❌ Erreur:", error)
  }
}

updateDb()
