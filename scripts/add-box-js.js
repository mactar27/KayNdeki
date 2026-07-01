import mysql from "mysql2/promise"

async function main() {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  })

  try {
    console.log("Inserting La Box Kay Ndeki into products table...")
    
    // Check if it exists
    const [rows] = await pool.execute("SELECT id FROM products WHERE id = 'box-kay-ndeki'")
    if (rows.length === 0) {
      await pool.execute(
        "INSERT INTO products (id, category, name, name_wo, description, price, image, available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          "box-kay-ndeki",
          "box",
          "La Box Kay Ndeki",
          "Mburu Box",
          "Ton sandwich au choix + crudités fraîches + œuf dur + 1 boisson au choix.",
          4000,
          "/products/box.png",
          true
        ]
      )
      console.log("✅ Box added to products.")
    } else {
      console.log("⚠️ Box already exists.")
    }
  } catch (error) {
    console.error("Error inserting box:", error)
  } finally {
    await pool.end()
    process.exit(0)
  }
}

main()
