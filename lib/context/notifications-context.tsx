"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { alertsService, type Alert } from "../api/alerts-service"
import { AlertToast } from "@/components/dashboard/alert-toast"

type NotificationsContextType = {
  alerts: Alert[]
  unreadCount: number
  loading: boolean
  error: string | null
  markAllAsRead: () => void
  markAsRead: (alertId: number) => void
  refreshAlerts: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [readAlerts, setReadAlerts] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toastAlerts, setToastAlerts] = useState<Alert[]>([])
  const [lastFetchedAlertIds, setLastFetchedAlertIds] = useState<Set<number>>(new Set())

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await alertsService.getAllAlerts()

      // Sort alerts by timestamp (newest first)
      const sortedAlerts = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      // Check for new alerts to show as toasts
      if (lastFetchedAlertIds.size > 0) {
        const newAlerts = sortedAlerts.filter((alert) => !lastFetchedAlertIds.has(alert.id))

        if (newAlerts.length > 0) {
          setToastAlerts((prev) => [...newAlerts, ...prev])
        }
      }

      // Update last fetched alert IDs
      setLastFetchedAlertIds(new Set(sortedAlerts.map((alert) => alert.id)))

      setAlerts(sortedAlerts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch alerts")
      console.error("Error fetching alerts:", err)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchAlerts()
  }, [])

  // Set up polling for alerts (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAlerts()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  // Load read alerts from localStorage
  useEffect(() => {
    const storedReadAlerts = localStorage.getItem("readAlerts")
    if (storedReadAlerts) {
      try {
        const parsedReadAlerts = JSON.parse(storedReadAlerts)
        setReadAlerts(new Set(parsedReadAlerts))
      } catch (error) {
        console.error("Error parsing read alerts from localStorage:", error)
      }
    }
  }, [])

  // Save read alerts to localStorage
  const saveReadAlerts = (alertIds: Set<number>) => {
    localStorage.setItem("readAlerts", JSON.stringify([...alertIds]))
  }

  const markAsRead = (alertId: number) => {
    setReadAlerts((prev) => {
      const newReadAlerts = new Set(prev)
      newReadAlerts.add(alertId)
      saveReadAlerts(newReadAlerts)
      return newReadAlerts
    })
  }

  const markAllAsRead = () => {
    const newReadAlerts = new Set(alerts.map((alert) => alert.id))
    setReadAlerts(newReadAlerts)
    saveReadAlerts(newReadAlerts)
  }

  const dismissToast = (alertId: number) => {
    setToastAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
    markAsRead(alertId)
  }

  const unreadCount = alerts.filter((alert) => !readAlerts.has(alert.id)).length

  return (
    <NotificationsContext.Provider
      value={{
        alerts,
        unreadCount,
        loading,
        error,
        markAllAsRead,
        markAsRead,
        refreshAlerts: fetchAlerts,
      }}
    >
      {children}
      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toastAlerts.slice(0, 3).map((alert) => (
          <AlertToast key={alert.id} alert={alert} onClose={() => dismissToast(alert.id)} />
        ))}
      </div>
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
