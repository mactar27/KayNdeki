import mysql from "mysql2/promise"
import { randomUUID } from "crypto"

// ─── Données initiales ───────────────────────────────────────────────────────
const FICHES_INITIALES = [
  {
    produit: "Sandwich Viande",
    emoji: "🥩",
    prix_vente: 4500,
    ingredients: [
      { name: "Pain",       poids: 1,     unite: "unité", prix_kg: 100,  prix_portion: 100  },
      { name: "Viande",     poids: 0.1,   unite: "kg",    prix_kg: 3000, prix_portion: 300  },
      { name: "Tomate",     poids: 0.2,   unite: "kg",    prix_kg: 1000, prix_portion: 200  },
      { name: "Salade",     poids: 0.025, unite: "kg",    prix_kg: 500,  prix_portion: 12.5 },
      { name: "Oignons",    poids: 0.025, unite: "kg",    prix_kg: 500,  prix_portion: 12.5 },
      { name: "Mayonnaise", poids: 0.01,  unite: "kg",    prix_kg: 1000, prix_portion: 10   },
      { name: "Ketchup",    poids: 0.01,  unite: "kg",    prix_kg: 1000, prix_portion: 10   },
      { name: "Moutarde",   poids: 0.01,  unite: "kg",    prix_kg: 1000, prix_portion: 10   },
      { name: "Packaging",  poids: 1,     unite: "unité", prix_kg: 100,  prix_portion: 100  },
    ],
  },
  {
    produit: "Sandwich Poulet",
    emoji: "🍗",
    prix_vente: 4000,
    ingredients: [
      { name: "Pain",       poids: 1,     unite: "unité", prix_kg: 100,  prix_portion: 100  },
      { name: "Poulet",     poids: 0.1,   unite: "kg",    prix_kg: 3000, prix_portion: 300  },
      { name: "Tomate",     poids: 0.03,  unite: "kg",    prix_kg: 1000, prix_portion: 30   },
      { name: "Salade",     poids: 0.025, unite: "kg",    prix_kg: 500,  prix_portion: 12.5 },
      { name: "Mayonnaise", poids: 0.01,  unite: "kg",    prix_kg: 1000, prix_portion: 10   },
      { name: "Piment",     poids: 0.01,  unite: "kg",    prix_kg: 600,  prix_portion: 6    },
      { name: "Packaging",  poids: 1,     unite: "unité", prix_kg: 100,  prix_portion: 100  },
    ],
  },
  {
    produit: "Sandwich + Ndambé",
    emoji: "🫘",
    prix_vente: 2000,
    ingredients: [
      { name: "Pain",             poids: 1,    unite: "unité", prix_kg: 100, prix_portion: 100 },
      { name: "Ndambé (haricot)", poids: 0.08, unite: "kg",    prix_kg: 800, prix_portion: 64  },
      { name: "Oignons",          poids: 0.02, unite: "kg",    prix_kg: 500, prix_portion: 10  },
      { name: "Piment",           poids: 0.005,unite: "kg",    prix_kg: 600, prix_portion: 3   },
      { name: "Huile",            poids: 0.01, unite: "kg",    prix_kg: 1200,prix_portion: 12  },
      { name: "Packaging",        poids: 1,    unite: "unité", prix_kg: 100, prix_portion: 100 },
    ],
  },
  {
    produit: "Café",
    emoji: "☕",
    prix_vente: 500,
    ingredients: [
      { name: "Café stick", poids: 1,   unite: "unité", prix_kg: 160, prix_portion: 160 },
      { name: "Eau chaude", poids: 0.2, unite: "kg",    prix_kg: 0,   prix_portion: 0   },
      { name: "Gobelet",    poids: 1,   unite: "unité", prix_kg: 50,  prix_portion: 50  },
    ],
  },
]

// ─── Connexion ───────────────────────────────────────────────────────────────
async function getConnection() {
  const url = process.env.DATABASE_URL
  if (!url) {
    console.error("❌ DATABASE_URL non trouvée dans .env.local")
    process.exit(1)
  }

  const parsedUrl = new URL(url)
  const needsSsl =
    parsedUrl.searchParams.get("sslaccept") === "strict" ||
    parsedUrl.port === "4000" ||
    parsedUrl.hostname.includes("tidbcloud.com")

  return mysql.createConnection({
    host: parsedUrl.hostname,
    port: parsedUrl.port ? Number(parsedUrl.port) : 3306,
    user: decodeURIComponent(parsedUrl.username),
    password: decodeURIComponent(parsedUrl.password),
    database: parsedUrl.pathname.replace(/^\//, ""),
    ssl: needsSsl ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
  })
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function initFiches() {
  const conn = await getConnection()

  // 1. Créer les tables
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS fiches_techniques (
      id VARCHAR(36) PRIMARY KEY,
      produit VARCHAR(255) NOT NULL,
      emoji VARCHAR(10) DEFAULT '🥪',
      prix_vente INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
  console.log("✅ Table fiches_techniques créée (ou déjà existante)")

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS fiche_ingredients (
      id VARCHAR(36) PRIMARY KEY,
      fiche_id VARCHAR(36) NOT NULL,
      name VARCHAR(255) NOT NULL,
      poids DECIMAL(10,3) DEFAULT 0,
      unite VARCHAR(20) DEFAULT 'kg',
      prix_kg INT DEFAULT 0,
      prix_portion DECIMAL(10,2) DEFAULT 0,
      position INT DEFAULT 0,
      FOREIGN KEY (fiche_id) REFERENCES fiches_techniques(id) ON DELETE CASCADE
    )
  `)
  console.log("✅ Table fiche_ingredients créée (ou déjà existante)")

  // 2. Vérifier si des données existent déjà
  const [existing] = await conn.execute("SELECT COUNT(*) as count FROM fiches_techniques")
  if (existing[0].count > 0) {
    console.log("ℹ️  Des fiches existent déjà, insertion ignorée.")
    await conn.end()
    return
  }

  // 3. Insérer les fiches initiales
  for (const fiche of FICHES_INITIALES) {
    const ficheId = randomUUID()
    await conn.execute(
      `INSERT INTO fiches_techniques (id, produit, emoji, prix_vente) VALUES (?, ?, ?, ?)`,
      [ficheId, fiche.produit, fiche.emoji, fiche.prix_vente]
    )
    for (let i = 0; i < fiche.ingredients.length; i++) {
      const ing = fiche.ingredients[i]
      await conn.execute(
        `INSERT INTO fiche_ingredients (id, fiche_id, name, poids, unite, prix_kg, prix_portion, position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [randomUUID(), ficheId, ing.name, ing.poids, ing.unite, ing.prix_kg, ing.prix_portion, i]
      )
    }
    console.log(`✅ Fiche "${fiche.produit}" insérée avec ${fiche.ingredients.length} ingrédients`)
  }

  console.log("\n🎉 Initialisation des fiches techniques terminée !")
  await conn.end()
}

initFiches().catch(console.error)
