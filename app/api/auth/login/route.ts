import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateToken, verifyPassword } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 })
    }

    const user = db.getUserByEmail(email)
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 })
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { success: false, message: "Please verify your email before logging in" },
        { status: 403 },
      )
    }

    // Create session
    const token = generateToken()
    db.createSession(token, user.id)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ success: false, message: "Login failed" }, { status: 500 })
  }
}
