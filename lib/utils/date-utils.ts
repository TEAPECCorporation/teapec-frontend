import { format, formatDistanceToNow } from "date-fns"

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return format(dateObj, "PPP")
}

export function formatTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return format(dateObj, "p")
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return format(dateObj, "PPp")
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}
