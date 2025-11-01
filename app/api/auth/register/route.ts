import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateId, generateToken, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = db.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 })
    }

    // Create user
    const verificationToken = generateToken()
    const user = db.createUser({
      id: generateId(),
      name,
      email,
      password: hashPassword(password),
      emailVerified: false,
      verificationToken,
      createdAt: new Date().toISOString(),
    })

    // In production, send verification email here
    console.log(`[v0] Verification token for ${email}: ${verificationToken}`)

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: "Registration successful! Please check your email to verify your account.",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ success: false, message: "Registration failed" }, { status: 500 })
  }
}
