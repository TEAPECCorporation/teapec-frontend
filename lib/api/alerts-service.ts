import { config } from "../config"
import { supabase } from "../supabase/client"
import type { Log } from "./logs-service"

export interface Alert {
  id: number
  log_id: number
  timestamp: string
  severity: string
  description: string
  log?: Log
}

export const alertsService = {
  async getAllAlerts(): Promise<Alert[]> {
    try {
      // Get the session token from Supabase
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      if (!token) {
        throw new Error("No authentication token available")
      }

      const response = await fetch(`${config.api.backendUrl}/api/v1/alerts/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error fetching alerts: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
      throw error
    }
  },

  async getAlert(alertId: number): Promise<Alert> {
    try {
      // Get the session token from Supabase
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      if (!token) {
        throw new Error("No authentication token available")
      }

      const response = await fetch(`${config.api.backendUrl}/api/v1/alerts/${alertId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error fetching alert: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch alert ${alertId}:`, error)
      throw error
    }
  },
}
