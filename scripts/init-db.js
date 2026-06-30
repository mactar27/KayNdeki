import mysql from "mysql2/promise"

async function initDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("Erreur: DATABASE_URL non trouvée dans .env.local")
    process.exit(1)
  }

  // Warning for GATEWAY_HOST
  if (url.includes("GATEWAY_HOST")) {
    console.warn("⚠️ Attention: L'URL contient 'GATEWAY_HOST', ce qui est généralement un espace réservé. Assurez-vous d'utiliser le vrai nom d'hôte fourni par TiDB (ex: gateway01.eu-central-1.prod.aws.tidbcloud.com).")
  }

  const parsedUrl = new URL(url)
  const needsSsl =
    parsedUrl.searchParams.get("sslaccept") === "strict" ||
    parsedUrl.port === "4000" ||
    parsedUrl.hostname.includes("tidbcloud.com")

  try {
    console.log("Connexion au serveur TiDB...")
    // Connect without database first
    const connection = await mysql.createConnection({
      host: parsedUrl.hostname,
      port: parsedUrl.port ? Number(parsedUrl.port) : 3306,
      user: decodeURIComponent(parsedUrl.username),
      password: decodeURIComponent(parsedUrl.password),
      ssl: needsSsl ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
    })

    const dbName = parsedUrl.pathname.replace(/^\//, "")
    console.log(`Création de la base de données '${dbName}' si elle n'existe pas...`)
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``)
    await connection.execute(`USE \`${dbName}\``)

    console.log("Création de la table 'orders'...")
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(36) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        address TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        subtotal INT NOT NULL,
        delivery_fee INT NOT NULL,
        total INT NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log("Création de la table 'order_items'...")
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        details TEXT,
        unit_price INT NOT NULL,
        qty INT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `)

    console.log("Création de la table 'products'...")
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        category VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        name_wo VARCHAR(255),
        description TEXT,
        price INT NOT NULL,
        image VARCHAR(255) NOT NULL,
        available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log("✅ Base de données initialisée avec succès ! Les tables 'orders', 'order_items' et 'products' sont prêtes.")
    await connection.end()
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation de la base de données:", error)
  }
}

initDb()
