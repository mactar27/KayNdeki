import "server-only"
import mysql from "mysql2/promise"

// Connexion MySQL / TiDB Serverless (port 4000 + TLS).
// Si DATABASE_URL est absent, les fonctions renvoient des erreurs claires.

let pool: mysql.Pool | null = null

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL)
}

export function getPool(): mysql.Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL non configurée. Ajoutez votre chaîne de connexion TiDB/MySQL dans les variables d'environnement du projet.",
    )
  }
  if (!pool) {
    const url = new URL(process.env.DATABASE_URL)
    const needsSsl =
      url.searchParams.get("sslaccept") === "strict" ||
      url.port === "4000" ||
      url.hostname.includes("tidbcloud.com")

    pool = mysql.createPool({
      host: url.hostname,
      port: url.port ? Number(url.port) : 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ""),
      ssl: needsSsl ? { minVersion: "TLSv1.2", rejectUnauthorized: true } : undefined,
      connectionLimit: 5,
      waitForConnections: true,
      enableKeepAlive: true,
    })
  }
  return pool
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await getPool().execute(sql, params)
  return rows as T[]
}
