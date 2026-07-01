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
    console.log("Updating La Box Kay Ndeki price to 3500...")
    await pool.execute("UPDATE products SET price = 3500 WHERE id = 'box-kay-ndeki'")
    console.log("✅ Price updated.")
  } catch (error) {
    console.error("Error updating price:", error)
  } finally {
    await pool.end()
    process.exit(0)
  }
}

main()
