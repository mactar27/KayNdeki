import "server-only"
import { query } from "@/lib/db"

export async function createPushSubscriptionTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      endpoint TEXT NOT NULL,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_endpoint (endpoint(255))
    )
  `)
}

export async function savePushSubscription(sub: {
  endpoint: string
  keys: { p256dh: string; auth: string }
}) {
  await query(
    `INSERT INTO push_subscriptions (endpoint, p256dh, auth)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE p256dh = VALUES(p256dh), auth = VALUES(auth)`,
    [sub.endpoint, sub.keys.p256dh, sub.keys.auth]
  )
}

export async function getAllSubscriptions() {
  return query<{ endpoint: string; p256dh: string; auth: string }>(
    "SELECT endpoint, p256dh, auth FROM push_subscriptions"
  )
}

export async function deleteSubscription(endpoint: string) {
  await query("DELETE FROM push_subscriptions WHERE endpoint = ?", [endpoint])
}
