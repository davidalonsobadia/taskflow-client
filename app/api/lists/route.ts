import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, generateId } from "@/lib/auth"

export async function GET() {
  try {
    const user = await requireAuth()

    const lists = db.getListsByUserId(user.id)

    return NextResponse.json({
      success: true,
      data: lists,
    })
  } catch (error) {
    console.error("[v0] Get lists error:", error)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { title, description, color } = await request.json()

    if (!title) {
      return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 })
    }

    const list = db.createList({
      id: generateId(),
      userId: user.id,
      title,
      description,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      data: list,
      message: "List created successfully",
    })
  } catch (error) {
    console.error("[v0] Create list error:", error)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
}
