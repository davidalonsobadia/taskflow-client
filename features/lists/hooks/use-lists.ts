// Lists hook for state management
"use client"

import { useState, useEffect, useCallback } from "react"
import { listsApi } from "../api"
import type { List } from "@/lib/types"

export function useLists() {
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLists = useCallback(async () => {
    try {
      setLoading(true)
      const result = await listsApi.getLists()
      if (result.success && result.data) {
        setLists(result.data)
      }
    } catch (err) {
      setError("Failed to fetch lists")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLists()
  }, [fetchLists])

  const createList = async (data: { title: string; description?: string; color?: string }) => {
    try {
      const result = await listsApi.createList(data)
      if (result.success) {
        await fetchLists()
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (err) {
      return { success: false, error: "Failed to create list" }
    }
  }

  const updateList = async (id: string, data: { title?: string; description?: string; color?: string }) => {
    try {
      const result = await listsApi.updateList(id, data)
      if (result.success) {
        await fetchLists()
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (err) {
      return { success: false, error: "Failed to update list" }
    }
  }

  const deleteList = async (id: string) => {
    try {
      const result = await listsApi.deleteList(id)
      if (result.success) {
        await fetchLists()
        return { success: true }
      }
      return { success: false, error: result.error }
    } catch (err) {
      return { success: false, error: "Failed to delete list" }
    }
  }

  return { lists, loading, error, createList, updateList, deleteList, refetch: fetchLists }
}
