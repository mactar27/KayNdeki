import mysql from "mysql2/promise"

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

    const [rows] = await connection.execute("SELECT * FROM products WHERE category = 'drink'")
    console.log("Current drinks:", rows)
    
    // Update anything containing "coca" (case insensitive usually in mysql, or we just do a direct update if we find it)
    await connection.execute("UPDATE products SET name = 'Boisson gazeuse', name_en = 'Soda' WHERE name LIKE '%coca%'")
    
    console.log("✅ Updated Coca to Boisson gazeuse.")
    
    await connection.end()
  } catch (error) {
    console.error("❌ Erreur:", error)
  }
}

updateDb()
