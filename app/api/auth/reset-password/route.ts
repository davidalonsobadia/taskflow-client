import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ success: false, message: "Token and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, message: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Find user with this reset token
    const users = Array.from((db as any).users.values())
    const user = users.find((u: any) => u.resetToken === token)

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
      return NextResponse.json({ success: false, message: "Invalid or expired reset token" }, { status: 400 })
    }

    // Update password
    db.updateUser(user.id, {
      password: hashPassword(password),
      resetToken: undefined,
      resetTokenExpiry: undefined,
    })

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now log in with your new password.",
    })
  } catch (error) {
    console.error("[v0] Reset password error:", error)
    return NextResponse.json({ success: false, message: "Password reset failed" }, { status: 500 })
  }
}
