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
    console.log("Updating prices in products table...")
    await pool.execute("UPDATE products SET price = 2500 WHERE category = 'sandwich'")
    console.log("✅ Products updated.")

    console.log("Updating prix_vente in fiches_techniques table...")
    await pool.execute("UPDATE fiches_techniques SET prix_vente = 2500")
    console.log("✅ Fiches techniques updated.")
  } catch (error) {
    console.error("Error updating prices:", error)
  } finally {
    await pool.end()
    process.exit(0)
  }
}

main()
