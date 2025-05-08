"use client"

import { useState } from "react"
import { AlertTriangle, Info, Shield, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getThreatLevel, getThreatColor, getThreatBgColor, type ThreatLevel } from "@/lib/utils/threat-utils"
import { formatRelativeTime } from "@/lib/utils/date-utils"
import type { Log } from "@/lib/api/logs-service"

interface ThreatCardProps {
  log: Log
  onClick?: () => void
}

export function ThreatCard({ log, onClick }: ThreatCardProps) {
  const [expanded, setExpanded] = useState(false)
  const threatLevel = getThreatLevel(log.anomaly_score, log.is_anomaly)
  const threatColor = getThreatColor(threatLevel)
  
  return (
    <Card 
      className={`border hover:shadow-md transition-shadow ${expanded ? 'shadow-md' : ''}`}
      onClick={() => onClick && onClick()}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{log.source_type} Log</CardTitle>
          <ThreatBadge level={threatLevel} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-text-secondary">Source IP:</span>
            <span className="font-medium">{log.source_ip}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-text-secondary">Time:</span>
            <span className="font-medium">{formatRelativeTime(log.timestamp)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-text-secondary">Anomaly Score:</span>
            <span className={`font-medium ${threatColor}`}>{log.anomaly_score.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-text-secondary">Anomaly:</span>
            <span className={`font-medium ${log.is_anomaly ? "text-error" : "text-success"}`}>
              {log.is_anomaly ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ThreatBadgeProps {
  level: ThreatLevel
}

function ThreatBadge({ level }: ThreatBadgeProps) {
  if (level === "none") {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        <Shield className="h-3 w-3 mr-1" />
        Normal
      </Badge>
    )
  }

  const variants = {
    low: "bg-yellow-100 text-yellow-800 border-yellow-200",
    moderate: "bg-orange-100 text-orange-800 border-orange-200",
    high: "bg-red-100 text-red-800 border-red-200",
  }

  const icons = {
    low: <Info className="h-3 w-3 mr-1" />,
    moderate: <AlertTriangle className="h-3 w-3 mr-1" />,
    high: <AlertTriangle className="h-3 w-3 mr-1" />,
  }

  const labels = {
    low: "Low",
    moderate: "Moderate",
    high: "High",
  }

  return (
    <Badge variant="outline" className={variants[level]}>
      {icons[level]}
      {labels[level]}
    </Badge>
  )
}
