import { getPool } from "../lib/db.js"

async function main() {
  const conn = await getPool().getConnection()
  try {
    console.log("Updating prices in products table...")
    await conn.execute("UPDATE products SET price = 2500 WHERE category = 'sandwich'")
    console.log("✅ Products updated.")

    console.log("Updating prix_vente in fiches_techniques table...")
    await conn.execute("UPDATE fiches_techniques SET prix_vente = 2500")
    console.log("✅ Fiches techniques updated.")
  } catch (error) {
    console.error("Error updating prices:", error)
  } finally {
    conn.release()
    process.exit(0)
  }
}

main()
