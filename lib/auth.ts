// Authentication utilities
import { cookies } from "next/headers"
import { db } from "./db"

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) return null

  const user = db.getUserByToken(token)
  if (!user) return null

  // Don't return password
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Simple password hashing (in production, use bcrypt)
export function hashPassword(password: string): string {
  // This is a simple hash for demo purposes
  // In production, use bcrypt or similar
  return Buffer.from(password).toString("base64")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}
