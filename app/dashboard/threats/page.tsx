"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangle, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ThreatCard } from "@/components/dashboard/threat-card"
import { LogDetailModal } from "@/components/dashboard/log-detail-modal"
import { AlertNotification } from "@/components/dashboard/alert-notification"
import { useAuth } from "@/lib/auth/auth-context"
import { logsService, type Log } from "@/lib/api/logs-service"
import { getThreatLevel } from "@/lib/utils/threat-utils"

export default function ThreatDetectionPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [logs, setLogs] = useState<Log[]>([])
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [alerts, setAlerts] = useState<Log[]>([])
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await logsService.getAllLogs()
      setLogs(data)

      // Check for new anomalies to show alerts
      const newAnomalies = data
        .filter((log) => log.is_anomaly || log.anomaly_score > 0.4)
        .filter((newLog) => !alerts.some((alert) => alert.id === newLog.id))

      if (newAnomalies.length > 0) {
        setAlerts((prev) => [...newAnomalies, ...prev].slice(0, 5))
      }
    } catch (error) {
      console.error("Error fetching logs:", error)
    } finally {
      setIsLoading(false)
    }
  }, [alerts])

  // Filter logs based on search and active tab
  useEffect(() => {
    let filtered = logs

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (log) =>
          log.source_ip.toLowerCase().includes(term) ||
          log.source_type.toLowerCase().includes(term) ||
          JSON.stringify(log.data).toLowerCase().includes(term),
      )
    }

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((log) => {
        const threatLevel = getThreatLevel(log.anomaly_score, log.is_anomaly)
        return threatLevel === activeTab
      })
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, activeTab])

  // Set up polling for real-time updates
  useEffect(() => {
    fetchLogs()

    // Set up polling interval (every 10 seconds)
    const interval = setInterval(fetchLogs, 10000)
    setPollingInterval(interval)

    return () => {
      if (pollingInterval) clearInterval(pollingInterval)
    }
  }, [fetchLogs])

  // Auth check
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    )
  }

  // Count threats by level
  const threatCounts = {
    low: logs.filter((log) => getThreatLevel(log.anomaly_score, log.is_anomaly) === "low").length,
    moderate: logs.filter((log) => getThreatLevel(log.anomaly_score, log.is_anomaly) === "moderate").length,
    high: logs.filter((log) => getThreatLevel(log.anomaly_score, log.is_anomaly) === "high").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">AI Threat Detection</h1>
            <p className="text-neutral-text-secondary">Monitor and analyze security threats in real-time</p>
          </div>
          <Button onClick={fetchLogs} disabled={isLoading} className="bg-primary hover:bg-primary/90">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Alert notifications */}
        <div className="space-y-2">
          {alerts.map((alert) => (
            <AlertNotification
              key={alert.id}
              log={alert}
              onClose={() => setAlerts(alerts.filter((a) => a.id !== alert.id))}
            />
          ))}
        </div>

        {/* Threat summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-medium">Low Threats</h3>
            </div>
            <p className="text-2xl font-bold">{threatCounts.low}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-medium">Moderate Threats</h3>
            </div>
            <p className="text-2xl font-bold">{threatCounts.moderate}</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 text-error mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-medium">High Threats</h3>
            </div>
            <p className="text-2xl font-bold">{threatCounts.high}</p>
          </div>
        </div>

        {/* Search and filters */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search logs by IP, type, or content..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs and log list */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Logs ({logs.length})</TabsTrigger>
            <TabsTrigger value="low">Low ({threatCounts.low})</TabsTrigger>
            <TabsTrigger value="moderate">Moderate ({threatCounts.moderate})</TabsTrigger>
            <TabsTrigger value="high">High ({threatCounts.high})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                <p>Loading logs...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-neutral-text-secondary">
                <p>No logs found matching your criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredLogs.map((log) => (
                  <ThreatCard
                    key={log.id}
                    log={log}
                    onClick={() => {
                      setSelectedLog(log)
                      setIsModalOpen(true)
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Log detail modal */}
      <LogDetailModal log={selectedLog} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </DashboardLayout>
  )
}
