import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const updates = await request.json()

    const task = db.getTaskById(id)
    if (!task) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 })
    }

    if (task.userId !== user.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    const updatedTask = db.updateTask(id, updates)

    return NextResponse.json({
      success: true,
      data: updatedTask,
      message: "Task updated successfully",
    })
  } catch (error) {
    console.error("[v0] Update task error:", error)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const task = db.getTaskById(id)
    if (!task) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 })
    }

    if (task.userId !== user.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    db.deleteTask(id)

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Delete task error:", error)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
}
