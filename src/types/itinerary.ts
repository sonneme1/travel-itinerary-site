export type ItemType = 'flight' | 'hotel' | 'activity' | 'restaurant'

export type FlightStatus = 'on-time' | 'delayed' | 'boarding' | 'landed' | 'scheduled'

export interface ItineraryItem {
  id: string
  type: ItemType
  day: number
  date: string
  title: string
  description?: string
  startTime?: string
  endTime?: string
  confirmation?: string
  address?: string
  notes?: string

  airline?: string
  flightNumber?: string
  departureAirport?: string
  arrivalAirport?: string
  terminal?: string
  gate?: string
  status?: FlightStatus

  checkIn?: string
  checkOut?: string
  checkOutDate?: string
}

export interface Trip {
  name: string
  destination: string
  startDate: string
  endDate: string
  travelers: string[]
  items: ItineraryItem[]
}

export const TYPE_META: Record<ItemType, { icon: string; color: string; label: string }> = {
  flight: { icon: 'mdi-airplane', color: '#3A7CA5', label: 'Flight' },
  hotel: { icon: 'mdi-bed', color: '#C9A66B', label: 'Hotel' },
  activity: { icon: 'mdi-ticket-confirmation', color: '#C8553D', label: 'Activity' },
  restaurant: { icon: 'mdi-silverware-fork-knife', color: '#6A8E5A', label: 'Restaurant' },
}
