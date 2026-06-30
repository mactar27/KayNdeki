import mysql from "mysql2/promise"

async function alterDb() {
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
    console.log("Connexion au serveur TiDB...")
    const connection = await mysql.createConnection({
      host: parsedUrl.hostname,
      port: parsedUrl.port ? Number(parsedUrl.port) : 3306,
      user: decodeURIComponent(parsedUrl.username),
      password: decodeURIComponent(parsedUrl.password),
      database: parsedUrl.pathname.replace(/^\//, ""),
      ssl: needsSsl ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
    })

    console.log("Ajout de la colonne 'name_en' à la table 'products'...")
    try {
      await connection.execute(`ALTER TABLE products ADD COLUMN name_en VARCHAR(255)`)
      console.log("✅ Colonne 'name_en' ajoutée avec succès.")
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log("La colonne 'name_en' existe déjà.")
      } else {
        throw e
      }
    }
    
    await connection.end()
  } catch (error) {
    console.error("❌ Erreur:", error)
  }
}

alterDb()
