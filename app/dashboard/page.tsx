"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, BarChart3, Activity } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">Welcome to your Dashboard</h1>
          <p className="text-neutral-text-primary">Monitor and manage your security operations with Sentinel XDR</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/dashboard/threats">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-primary">AI Threat Detection</h2>
              </div>
              <p className="text-neutral-text-secondary">
                Real-time monitoring and detection of security threats using AI
              </p>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-primary">Security Analytics</h2>
            </div>
            <p className="text-neutral-text-secondary">
              Comprehensive analytics and insights into your security posture
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-primary">System Health</h2>
            </div>
            <p className="text-neutral-text-secondary">Monitor the health and performance of your security systems</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
