"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/lib/context/notifications-context"
import { cn } from "@/lib/theme"

export function NotificationBell() {
  const { alerts, unreadCount, markAllAsRead, markAsRead } = useNotifications()
  const [open, setOpen] = useState(false)

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen)
    // Mark all as read when dropdown is closed
    if (!isOpen && unreadCount > 0) {
      markAllAsRead()
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-error text-white"
      case "medium":
      case "moderate":
        return "bg-warning text-white"
      case "low":
        return "bg-yellow-500 text-white"
      default:
        return "bg-primary text-white"
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h3 className="font-medium">Notifications</h3>
          {alerts.length > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto py-1 px-2 text-xs">
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="p-4 text-center text-sm text-neutral-text-secondary">No notifications</div>
          ) : (
            alerts.slice(0, 10).map((alert) => (
              <DropdownMenuItem key={alert.id} className="cursor-default p-0" onSelect={() => markAsRead(alert.id)}>
                <div className="flex w-full items-start gap-2 p-3 hover:bg-gray-50">
                  <div
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      getSeverityColor(alert.severity),
                    )}
                  >
                    <Bell className="h-3 w-3" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} Alert
                      </p>
                      <span className="text-xs text-neutral-text-tertiary">
                        {format(new Date(alert.timestamp), "MMM d, HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-text-secondary">{alert.description}</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
        {alerts.length > 10 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-default justify-center p-2 text-sm font-medium text-primary">
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
