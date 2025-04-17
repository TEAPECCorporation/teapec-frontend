"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
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
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Sentinel XDR</h1>
          <Button variant="outline" onClick={logout} className="text-white border-white hover:bg-primary/80">
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-8">
        <h1 className="text-2xl font-bold text-primary mb-4">Welcome to your Dashboard</h1>
        <p className="text-neutral-text-primary mb-8">
          This is a placeholder dashboard. Your actual dashboard content will go here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-primary mb-2">Dashboard Widget {i}</h2>
              <p className="text-neutral-text-secondary">
                This is a placeholder widget. Your actual widget content will go here.
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
