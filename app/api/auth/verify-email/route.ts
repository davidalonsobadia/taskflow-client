import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false, message: "Verification token is required" }, { status: 400 })
    }

    // Find user with this verification token
    const users = Array.from((db as any).users.values())
    const user = users.find((u: any) => u.verificationToken === token)

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid or expired verification token" }, { status: 400 })
    }

    // Update user
    db.updateUser(user.id, {
      emailVerified: true,
      verificationToken: undefined,
    })

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    })
  } catch (error) {
    console.error("[v0] Email verification error:", error)
    return NextResponse.json({ success: false, message: "Verification failed" }, { status: 500 })
  }
}
