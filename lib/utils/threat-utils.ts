export type ThreatLevel = "low" | "moderate" | "high" | "none"

export function getThreatLevel(anomalyScore: number, isAnomaly: boolean): ThreatLevel {
  if (!isAnomaly && anomalyScore === 0) return "none"
  if (anomalyScore < 0.4) return "low"
  if (anomalyScore < 0.7) return "moderate"
  return "high"
}

export function getThreatColor(threatLevel: ThreatLevel): string {
  switch (threatLevel) {
    case "low":
      return "text-yellow-500"
    case "moderate":
      return "text-warning"
    case "high":
      return "text-error"
    default:
      return "text-success"
  }
}

export function getThreatBgColor(threatLevel: ThreatLevel): string {
  switch (threatLevel) {
    case "low":
      return "bg-yellow-100"
    case "moderate":
      return "bg-orange-100"
    case "high":
      return "bg-red-100"
    default:
      return "bg-green-100"
  }
}
