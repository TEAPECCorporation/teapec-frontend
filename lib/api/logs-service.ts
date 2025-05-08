import { config } from "../config"
import { supabase } from "../supabase/client"

export interface Log {
  id: number
  source_type: string
  source_ip: string
  timestamp: string
  data: any
  is_anomaly: boolean
  anomaly_score: number
}

export interface LogUpdate {
  source_type: string
  source_ip: string
  data: any
  is_anomaly: boolean
  anomaly_score: number
}

export const logsService = {
  async getAllLogs(): Promise<Log[]> {
    try {
      // Get the session token from Supabase
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      if (!token) {
        throw new Error("No authentication token available")
      }

      const response = await fetch(`${config.api.backendUrl}/api/v1/logs/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error fetching logs: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch logs:", error)
      throw error
    }
  },

  async getLog(logId: number): Promise<Log> {
    try {
      // Get the session token from Supabase
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      if (!token) {
        throw new Error("No authentication token available")
      }

      const response = await fetch(`${config.api.backendUrl}/api/v1/logs/${logId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error fetching log: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch log ${logId}:`, error)
      throw error
    }
  },

  async updateLog(logId: number, logUpdate: LogUpdate): Promise<{ status: string; log_id: number }> {
    try {
      // Get the session token from Supabase
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      if (!token) {
        throw new Error("No authentication token available")
      }

      const response = await fetch(`${config.api.backendUrl}/api/v1/logs/${logId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(logUpdate),
      })

      if (!response.ok) {
        throw new Error(`Error updating log: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error(`Failed to update log ${logId}:`, error)
      throw error
    }
  },

  async getAnomalies(threshold = 0.5, limit = 100): Promise<Log[]> {
    try {
      // Get the session token from Supabase
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      if (!token) {
        throw new Error("No authentication token available")
      }

      const response = await fetch(`${config.api.backendUrl}/api/v1/anomalies/?threshold=${threshold}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error fetching anomalies: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Failed to fetch anomalies:", error)
      throw error
    }
  },
}
