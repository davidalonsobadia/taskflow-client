import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 })
    }

    const user = db.getUserByEmail(email)
    if (!user) {
      // Don't reveal if email exists
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, a password reset link has been sent.",
      })
    }

    // Generate reset token
    const resetToken = generateToken()
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour

    db.updateUser(user.id, {
      resetToken,
      resetTokenExpiry,
    })

    // In production, send reset email here
    console.log(`[v0] Password reset token for ${email}: ${resetToken}`)

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("[v0] Forgot password error:", error)
    return NextResponse.json({ success: false, message: "Request failed" }, { status: 500 })
  }
}
