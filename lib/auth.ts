import "server-only"
import { cookies } from "next/headers"
import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto"
import { promisify } from "util"
import { query } from "./db"

const scrypt = promisify(_scrypt)
const SESSION_COOKIE = "kn_session"
const SESSION_DAYS = 30

export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  role: "customer" | "admin"
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex")
  const derived = (await scrypt(password, salt, 64)) as Buffer
  return `${salt}:${derived.toString("hex")}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, key] = stored.split(":")
  if (!salt || !key) return false
  const derived = (await scrypt(password, salt, 64)) as Buffer
  const keyBuffer = Buffer.from(key, "hex")
  if (keyBuffer.length !== derived.length) return false
  return timingSafeEqual(keyBuffer, derived)
}

export function generateId(): string {
  return randomBytes(16).toString("hex")
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("hex")
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await query(
    "INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)",
    [token, userId, expires.toISOString().slice(0, 19).replace("T", " ")],
  )
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (token) {
    try {
      await query("DELETE FROM sessions WHERE id = ?", [token])
    } catch {
      // ignore
    }
  }
  store.delete(SESSION_COOKIE)
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  try {
    const rows = await query<any>(
      `SELECT u.id, u.name, u.email, u.phone, u.role, s.expires_at
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.id = ? LIMIT 1`,
      [token],
    )
    const row = rows[0]
    if (!row) return null
    if (new Date(row.expires_at) < new Date()) {
      await query("DELETE FROM sessions WHERE id = ?", [token])
      return null
    }
    return { id: row.id, name: row.name, email: row.email, phone: row.phone, role: row.role }
  } catch {
    return null
  }
}
