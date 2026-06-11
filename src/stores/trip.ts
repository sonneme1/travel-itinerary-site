import { ref, computed, watch } from 'vue'
import tripData from '@/data/trip.json'
import type { ItineraryItem, Trip } from '@/types/itinerary'

const STORAGE_KEY = 'travel-itinerary:trip:v1'

const loadInitial = (): Trip => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Trip
  } catch {
    /* fall through to seed */
  }
  return tripData as Trip
}

const trip = ref<Trip>(loadInitial())

watch(
  trip,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

const sortItems = (items: ItineraryItem[]) =>
  [...items].sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day
    const at = a.startTime ?? a.checkIn ?? '00:00'
    const bt = b.startTime ?? b.checkIn ?? '00:00'
    return at.localeCompare(bt)
  })

const itemTimestamp = (item: ItineraryItem): number => {
  const time = item.startTime ?? item.checkIn ?? '00:00'
  return new Date(`${item.date}T${time}:00`).getTime()
}

const itemEndTimestamp = (item: ItineraryItem): number => {
  const time = item.endTime ?? item.startTime ?? item.checkIn ?? '23:59'
  return new Date(`${item.date}T${time}:00`).getTime()
}

const todayISO = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export function useTrip() {
  const items = computed(() => sortItems(trip.value.items))

  const days = computed(() => {
    const dayNumbers = Array.from(new Set(trip.value.items.map((i) => i.day))).sort((a, b) => a - b)
    return dayNumbers.map((day) => {
      const date = trip.value.items.find((i) => i.day === day)?.date ?? ''
      return { day, date }
    })
  })

  const currentDay = computed(() => {
    const today = todayISO()
    const match = days.value.find((d) => d.date === today)
    if (match) return match.day
    if (today < trip.value.startDate) return days.value[0]?.day ?? 1
    return days.value[days.value.length - 1]?.day ?? 1
  })

  const itemsForDay = (day: number) =>
    computed(() => sortItems(trip.value.items.filter((i) => i.day === day)))

  const itemById = (id: string) =>
    computed(() => trip.value.items.find((i) => i.id === id))

  const upNextItem = computed(() => {
    const now = Date.now()
    const todays = sortItems(trip.value.items.filter((i) => i.day === currentDay.value))
    return (
      todays.find((i) => itemTimestamp(i) > now) ??
      todays.find((i) => itemTimestamp(i) <= now && itemEndTimestamp(i) >= now) ??
      todays[0]
    )
  })

  const happeningNowItem = computed(() => {
    const now = Date.now()
    return sortItems(trip.value.items.filter((i) => i.day === currentDay.value)).find(
      (i) => itemTimestamp(i) <= now && itemEndTimestamp(i) >= now,
    )
  })

  const addItem = (item: Omit<ItineraryItem, 'id'>) => {
    const newItem: ItineraryItem = { ...item, id: genId() }
    trip.value.items.push(newItem)
    return newItem
  }

  const updateItem = (id: string, patch: Partial<ItineraryItem>) => {
    const idx = trip.value.items.findIndex((i) => i.id === id)
    if (idx === -1) return
    trip.value.items[idx] = { ...trip.value.items[idx], ...patch, id }
  }

  const deleteItem = (id: string) => {
    trip.value.items = trip.value.items.filter((i) => i.id !== id)
  }

  const resetTrip = () => {
    trip.value = JSON.parse(JSON.stringify(tripData)) as Trip
  }

  return {
    trip,
    items,
    days,
    currentDay,
    itemsForDay,
    itemById,
    upNextItem,
    happeningNowItem,
    itemTimestamp,
    itemEndTimestamp,
    addItem,
    updateItem,
    deleteItem,
    resetTrip,
  }
}
