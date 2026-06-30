import "server-only"
import { getPool } from "./db"
import { MENU } from "./menu-data"

// Crée les tables si elles n'existent pas et insère le catalogue de menu.
export async function ensureSchema(): Promise<void> {
  const pool = getPool()

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(190) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      phone VARCHAR(40),
      role VARCHAR(20) NOT NULL DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_sessions_user (user_id)
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id VARCHAR(40) PRIMARY KEY,
      category VARCHAR(20) NOT NULL,
      name VARCHAR(120) NOT NULL,
      description VARCHAR(255),
      price INT NOT NULL DEFAULT 0,
      image VARCHAR(255),
      available TINYINT(1) NOT NULL DEFAULT 1,
      sort_order INT NOT NULL DEFAULT 0,
      INDEX idx_menu_category (category)
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36),
      customer_name VARCHAR(120) NOT NULL,
      phone VARCHAR(40) NOT NULL,
      mode VARCHAR(20) NOT NULL DEFAULT 'delivery',
      address VARCHAR(255),
      note VARCHAR(255),
      status VARCHAR(20) NOT NULL DEFAULT 'pending',
      subtotal INT NOT NULL DEFAULT 0,
      delivery_fee INT NOT NULL DEFAULT 0,
      total INT NOT NULL DEFAULT 0,
      payment_method VARCHAR(20) NOT NULL DEFAULT 'cash',
      payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_orders_user (user_id),
      INDEX idx_orders_status (status)
    )
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(36) NOT NULL,
      title VARCHAR(160) NOT NULL,
      details VARCHAR(500),
      unit_price INT NOT NULL DEFAULT 0,
      qty INT NOT NULL DEFAULT 1,
      INDEX idx_items_order (order_id)
    )
  `)

  await seedMenu()
}

async function seedMenu(): Promise<void> {
  const pool = getPool()
  const [rows] = await pool.query("SELECT COUNT(*) AS c FROM menu_items")
  const count = (rows as any[])[0]?.c ?? 0
  if (count > 0) return

  let order = 0
  for (const item of MENU) {
    await pool.execute(
      `INSERT INTO menu_items (id, category, name, description, price, image, available, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.id, item.category, item.name, item.description, item.price, item.image, item.available ? 1 : 0, order++],
    )
  }
}
