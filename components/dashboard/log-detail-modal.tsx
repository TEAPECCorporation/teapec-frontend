"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Info, Shield } from 'lucide-react'
import { formatDateTime } from "@/lib/utils/date-utils"
import { getThreatLevel, getThreatColor, type ThreatLevel } from "@/lib/utils/threat-utils"
import type { Log } from "@/lib/api/logs-service"

interface LogDetailModalProps {
  log: Log | null
  isOpen: boolean
  onClose: () => void
}

export function LogDetailModal({ log, isOpen, onClose }: LogDetailModalProps) {
  if (!log) return null

  const threatLevel = getThreatLevel(log.anomaly_score, log.is_anomaly)
  const threatColor = getThreatColor(threatLevel)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ThreatIcon level={threatLevel} />
            <span>Log Details</span>
            <span className="ml-2 text-sm font-normal">ID: {log.id}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Source Type" value={log.source_type} />
            <InfoItem label="Source IP" value={log.source_ip} />
            <InfoItem label="Timestamp" value={formatDateTime(log.timestamp)} />
            <InfoItem label="Anomaly Score" value={log.anomaly_score.toFixed(2)} className={threatColor} />
            <InfoItem
              label="Is Anomaly"
              value={log.is_anomaly ? "Yes" : "No"}
              className={log.is_anomaly ? "text-error" : "text-success"}
            />
          </div>

          {log.data.message && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-1">Message:</h3>
              <div className="bg-gray-50 p-3 rounded-md border text-sm">
                {log.data.message}
              </div>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-1">Full Data:</h3>
            <pre className="bg-gray-50 p-3 rounded-md border text-xs overflow-x-auto">
              {JSON.stringify(log.data, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface InfoItemProps {
  label: string
  value: string
  className?: string
}

function InfoItem({ label, value, className = "" }: InfoItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-neutral-text-secondary">{label}</p>
      <p className={`font-medium ${className}`}>{value}</p>
    </div>
  )
}

function ThreatIcon({ level }: { level: ThreatLevel }) {
  switch (level) {
    case "high":
      return <AlertTriangle className="h-5 w-5 text-error" />
    case "moderate":
      return <AlertTriangle className="h-5 w-5 text-warning" />
    case "low":
      return <Info className="h-5 w-5 text-yellow-500" />
    default:
      return <Shield className="h-5 w-5 text-success" />
  }
}
