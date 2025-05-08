"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Log } from "@/lib/api/logs-service"
import { getThreatLevel, getThreatColor, type ThreatLevel } from "@/lib/utils/threat-utils"

interface AlertNotificationProps {
  log: Log
  onClose: () => void
}

export function AlertNotification({ log, onClose }: AlertNotificationProps) {
  const [visible, setVisible] = useState(true)
  const threatLevel = getThreatLevel(log.anomaly_score, log.is_anomaly)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // Allow animation to complete
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (threatLevel === "none") return null

  const variants = {
    low: "border-yellow-500 bg-yellow-50",
    moderate: "border-warning bg-orange-50",
    high: "border-error bg-red-50",
  }

  const titles = {
    low: "Low Severity Alert",
    moderate: "Moderate Severity Alert",
    high: "High Severity Alert",
  }

  return (
    <Alert
      className={`mb-2 border-l-4 ${variants[threatLevel]} transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <AlertTriangle className={`h-4 w-4 ${getThreatColor(threatLevel)}`} />
      <div className="flex-1">
        <AlertTitle>{titles[threatLevel]}</AlertTitle>
        <AlertDescription>
          {log.source_type} log from {log.source_ip} detected with anomaly score {log.anomaly_score.toFixed(2)}
        </AlertDescription>
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
    </Alert>
  )
}
