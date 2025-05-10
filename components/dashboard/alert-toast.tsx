"use client"

import { useEffect, useState } from "react"
import { Bell, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/theme"
import type { Alert } from "@/lib/api/alerts-service"

interface AlertToastProps {
  alert: Alert
  onClose: () => void
}

export function AlertToast({ alert, onClose }: AlertToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Fade in
    setTimeout(() => setVisible(true), 100)

    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // Allow animation to complete
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "border-error bg-red-50"
      case "medium":
      case "moderate":
        return "border-warning bg-orange-50"
      case "low":
        return "border-yellow-500 bg-yellow-50"
      default:
        return "border-primary bg-blue-50"
    }
  }

  const getSeverityTextColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "text-error"
      case "medium":
      case "moderate":
        return "text-warning"
      case "low":
        return "text-yellow-500"
      default:
        return "text-primary"
    }
  }

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 w-80 rounded-lg shadow-lg border-l-4 transition-all duration-300",
        getSeverityColor(alert.severity),
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      <div className="p-4 bg-white rounded-r-lg">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                getSeverityTextColor(alert.severity),
                "bg-white",
              )}
            >
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium flex items-center">
                <span className={getSeverityTextColor(alert.severity)}>
                  {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Alert
                </span>
              </h3>
              <p className="text-sm text-neutral-text-secondary">{format(new Date(alert.timestamp), "HH:mm")}</p>
              <p className="text-sm mt-1">{alert.description}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
