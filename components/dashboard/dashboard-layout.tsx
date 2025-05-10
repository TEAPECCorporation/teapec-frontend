"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import { NotificationsProvider } from "@/lib/context/notifications-context"
import { NotificationBell } from "./notification-bell"
import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  if (!loading && !user) {
    router.push("/auth/login")
    return null
  }

  return (
    <NotificationsProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="bg-primary text-white sticky top-0 z-10">
          <div className="container mx-auto px-4 flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Sentinel XDR</h1>
            </div>

            <div className="flex items-center gap-4">
              <NotificationBell />
              <Button
                variant="outline"
                onClick={() => logout()}
                className="text-white border-white hover:bg-primary/80"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 md:ml-64 overflow-auto">{children}</main>
        </div>
      </div>
    </NotificationsProvider>
  )
}
