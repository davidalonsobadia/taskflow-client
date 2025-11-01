// In-memory database simulation
import type { User, List, Task } from "./types"

class Database {
  private users: Map<string, User> = new Map()
  private lists: Map<string, List> = new Map()
  private tasks: Map<string, Task> = new Map()
  private sessions: Map<string, string> = new Map() // token -> userId

  // User operations
  createUser(user: User): User {
    this.users.set(user.id, user)
    return user
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email)
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id)
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id)
    if (!user) return undefined
    const updated = { ...user, ...updates }
    this.users.set(id, updated)
    return updated
  }

  // Session operations
  createSession(token: string, userId: string): void {
    this.sessions.set(token, userId)
  }

  getUserByToken(token: string): User | undefined {
    const userId = this.sessions.get(token)
    return userId ? this.users.get(userId) : undefined
  }

  deleteSession(token: string): void {
    this.sessions.delete(token)
  }

  // List operations
  createList(list: List): List {
    this.lists.set(list.id, list)
    return list
  }

  getListsByUserId(userId: string): List[] {
    return Array.from(this.lists.values())
      .filter((l) => l.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getListById(id: string): List | undefined {
    return this.lists.get(id)
  }

  updateList(id: string, updates: Partial<List>): List | undefined {
    const list = this.lists.get(id)
    if (!list) return undefined
    const updated = { ...list, ...updates, updatedAt: new Date().toISOString() }
    this.lists.set(id, updated)
    return updated
  }

  deleteList(id: string): boolean {
    // Also delete all tasks in this list
    const tasks = Array.from(this.tasks.values()).filter((t) => t.listId === id)
    tasks.forEach((t) => this.tasks.delete(t.id))
    return this.lists.delete(id)
  }

  // Task operations
  createTask(task: Task): Task {
    this.tasks.set(task.id, task)
    return task
  }

  getTasksByListId(listId: string): Task[] {
    return Array.from(this.tasks.values())
      .filter((t) => t.listId === listId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.get(id)
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const task = this.tasks.get(id)
    if (!task) return undefined
    const updated = { ...task, ...updates, updatedAt: new Date().toISOString() }
    this.tasks.set(id, updated)
    return updated
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id)
  }
}

// Singleton instance
export const db = new Database()
