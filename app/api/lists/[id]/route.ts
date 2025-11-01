import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const updates = await request.json()

    const list = db.getListById(id)
    if (!list) {
      return NextResponse.json({ success: false, message: "List not found" }, { status: 404 })
    }

    if (list.userId !== user.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    const updatedList = db.updateList(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedList,
      message: "List updated successfully",
    })
  } catch (error) {
    console.error("[v0] Update list error:", error)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const list = db.getListById(id)
    if (!list) {
      return NextResponse.json({ success: false, message: "List not found" }, { status: 404 })
    }

    if (list.userId !== user.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    db.deleteList(id)

    return NextResponse.json({
      success: true,
      message: "List deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Delete list error:", error)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
}
