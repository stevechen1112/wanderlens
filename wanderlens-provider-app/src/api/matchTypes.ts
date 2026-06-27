export interface MatchBroadcastPayload {
  type: string
  requestId?: number
  serviceTypeId?: number
  shootingLocation?: string
  shootingLat?: number
  shootingLng?: number
  durationHours?: number
  scheduledTime?: string
  estimatedIncome?: number
  distanceKm?: number
  responseSeconds?: number
}
