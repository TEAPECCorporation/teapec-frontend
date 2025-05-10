"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Bell, Search, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNotifications } from "@/lib/context/notifications-context"
import { cn } from "@/lib/theme"

export default function AlertsPage() {
  const { alerts, loading, refreshAlerts } = useNotifications()
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedAlerts, setExpandedAlerts] = useState<Set<number>>(new Set())

  const toggleExpand = (alertId: number) => {
    setExpandedAlerts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(alertId)) {
        newSet.delete(alertId)
      } else {
        newSet.add(alertId)
      }
      return newSet
    })
  }

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.severity.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-primary">AI Threat Detection</h1>
            <p className="text-neutral-text-secondary">Security Alerts and Notifications</p>
          </div>
          <Button onClick={refreshAlerts} disabled={loading} className="bg-primary hover:bg-primary/90">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search alerts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Alerts list */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
              <p>Loading alerts...</p>
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-sm border p-6">
              <Bell className="h-12 w-12 mx-auto text-neutral-text-tertiary mb-4" />
              <h3 className="text-lg font-medium mb-1">No alerts found</h3>
              <p className="text-neutral-text-secondary">
                {searchTerm ? "Try adjusting your search terms" : "You don't have any alerts at the moment"}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isExpanded = expandedAlerts.has(alert.id)
              return (
                <div
                  key={alert.id}
                  className={cn(
                    "border-l-4 bg-white rounded-lg shadow-sm overflow-hidden",
                    getSeverityColor(alert.severity),
                  )}
                >
                  <div
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleExpand(alert.id)}
                  >
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
                            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                          </span>
                          <span className="mx-2">•</span>
                          <span className="text-neutral-text-secondary text-sm">
                            {format(new Date(alert.timestamp), "MMM d, yyyy HH:mm")}
                          </span>
                        </h3>
                        <p className="text-neutral-text-primary">{alert.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-2 shrink-0">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-neutral-text-secondary mb-1">Alert ID</p>
                            <p className="font-medium">{alert.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-text-secondary mb-1">Log ID</p>
                            <p className="font-medium">{alert.log_id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-text-secondary mb-1">Severity</p>
                            <p className={cn("font-medium", getSeverityTextColor(alert.severity))}>
                              {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-text-secondary mb-1">Timestamp</p>
                            <p className="font-medium">{format(new Date(alert.timestamp), "PPpp")}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-neutral-text-secondary mb-1">Description</p>
                          <p className="font-medium">{alert.description}</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm" className="mr-2">
                            View Log
                          </Button>
                          <Button size="sm" className="bg-primary hover:bg-primary/90">
                            Resolve Alert
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
