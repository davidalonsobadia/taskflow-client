import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, generateId } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const listId = searchParams.get("listId")

    if (!listId) {
      return NextResponse.json({ success: false, message: "List ID is required" }, { status: 400 })
    }

    // Verify list belongs to user
    const list = db.getListById(listId)
    if (!list || list.userId !== user.id) {
      return NextResponse.json({ success: false, message: "List not found" }, { status: 404 })
    }

    const tasks = db.getTasksByListId(listId)

    return NextResponse.json({
      success: true,
      data: tasks,
    })
  } catch (error) {
    console.error("[v0] Get tasks error:", error)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { listId, title, description, priority, dueDate } = await request.json()

    if (!listId || !title) {
      return NextResponse.json({ success: false, message: "List ID and title are required" }, { status: 400 })
    }

    // Verify list belongs to user
    const list = db.getListById(listId)
    if (!list || list.userId !== user.id) {
      return NextResponse.json({ success: false, message: "List not found" }, { status: 404 })
    }

    const task = db.createTask({
      id: generateId(),
      listId,
      userId: user.id,
      title,
      description,
      completed: false,
      priority: priority || "medium",
      dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      data: task,
      message: "Task created successfully",
    })
  } catch (error) {
    console.error("[v0] Create task error:", error)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }
}
