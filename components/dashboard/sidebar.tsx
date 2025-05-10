"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, AlertCircle, ClipboardCheck, Menu, X, ChevronDown, ChevronRight, Bell } from "lucide-react"
import { cn } from "@/lib/theme"
import { useNotifications } from "@/lib/context/notifications-context"

type SidebarItem = {
  title: string
  icon: React.ElementType
  href?: string
  comingSoon?: boolean
  children?: SidebarItem[]
  expanded?: boolean
  badge?: number | null
}

export function Sidebar() {
  const pathname = usePathname()
  const { unreadCount } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([
    {
      title: "AI Threat Detection",
      icon: Shield,
      expanded: true,
      children: [
        {
          title: "Dashboard",
          href: "/dashboard",
          icon: () => <span className="w-1.5 h-1.5 rounded-full bg-current" />,
        },
        {
          title: "Threats",
          href: "/dashboard/threats",
          icon: () => <span className="w-1.5 h-1.5 rounded-full bg-current" />,
        },
        {
          title: "Alerts",
          href: "/dashboard/alerts",
          icon: Bell,
          badge: unreadCount,
        },
      ],
    },
    {
      title: "Incident Response",
      icon: AlertCircle,
      comingSoon: true,
    },
    {
      title: "Compliance",
      icon: ClipboardCheck,
      comingSoon: true,
    },
  ])

  // Update badge count when unreadCount changes
  useEffect(() => {
    setSidebarItems((items) => {
      const newItems = [...items]
      // Find AI Threat Detection
      const threatDetectionIndex = newItems.findIndex((item) => item.title === "AI Threat Detection")
      if (threatDetectionIndex !== -1 && newItems[threatDetectionIndex].children) {
        // Find Alerts child
        const alertsIndex = newItems[threatDetectionIndex].children!.findIndex((child) => child.title === "Alerts")
        if (alertsIndex !== -1) {
          newItems[threatDetectionIndex].children![alertsIndex].badge = unreadCount
        }
      }
      return newItems
    })
  }, [unreadCount])

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Toggle expanded state for an item
  const toggleExpanded = (index: number) => {
    setSidebarItems((items) => items.map((item, i) => (i === index ? { ...item, expanded: !item.expanded } : item)))
  }

  // Check if a route is active
  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-20 bg-black/50 md:hidden transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile toggle button */}
      <button
        className="fixed bottom-4 right-4 z-30 md:hidden bg-primary text-white p-3 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-full w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Sidebar header */}
        <div className="h-16 flex items-center px-4 border-b bg-primary text-white">
          <h2 className="text-lg font-bold">Sentinel XDR</h2>
        </div>

        {/* Sidebar content */}
        <div className="overflow-y-auto h-[calc(100vh-4rem)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item, index) => (
                <li key={index}>
                  {/* Parent item */}
                  <div
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md cursor-pointer",
                      item.children
                        ? "hover:bg-gray-100"
                        : isActive(item.href)
                          ? "bg-primary text-white"
                          : "hover:bg-gray-100",
                    )}
                    onClick={() => item.children && toggleExpanded(index)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                      {item.comingSoon && (
                        <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">Soon</span>
                      )}
                    </div>
                    {item.children &&
                      (item.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
                  </div>

                  {/* Child items */}
                  {item.children && item.expanded && (
                    <ul className="mt-1 ml-4 pl-4 border-l border-gray-200 space-y-1">
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          <Link
                            href={child.href || "#"}
                            className={cn(
                              "flex items-center gap-3 p-2 rounded-md text-sm",
                              isActive(child.href)
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-neutral-text-primary hover:bg-gray-100",
                            )}
                          >
                            <child.icon className="h-3 w-3" />
                            <span className="flex-1">{child.title}</span>
                            {child.badge ? (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-[10px] font-bold text-white">
                                {child.badge > 99 ? "99+" : child.badge}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}
