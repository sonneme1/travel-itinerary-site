<script setup lang="ts">
import { ref } from 'vue'
import { useTrip } from '@/stores/trip'
import { TYPE_META } from '@/types/itinerary'
import { formatDayLabel, formatTime, formatTimeRange } from '@/utils/format'

const { trip, days, itemsForDay, currentDay } = useTrip()

const expandedDays = ref<number[]>([currentDay.value])

const itemTime = (item: ReturnType<typeof itemsForDay>['value'][number]) => {
  if (item.type === 'hotel' && item.checkIn) return formatTime(item.checkIn)
  return formatTimeRange(item.startTime, item.endTime) || '—'
}
</script>

<template>
  <div class="trip-overview">
    <header class="overview-header">
      <h1>{{ trip.name }}</h1>
      <div class="sub">{{ trip.destination }}</div>
      <div class="travelers">
        <v-icon icon="mdi-account-group" size="16" />
        {{ trip.travelers.join(', ') }}
      </div>
      <div class="trip-dates">
        {{ formatDayLabel(trip.startDate) }} – {{ formatDayLabel(trip.endDate) }}
      </div>
    </header>

    <v-expansion-panels v-model="expandedDays" multiple variant="accordion" class="day-panels">
      <v-expansion-panel
        v-for="d in days"
        :key="d.day"
        :value="d.day"
      >
        <v-expansion-panel-title>
          <div class="panel-title">
            <div class="panel-day">Day {{ d.day }}</div>
            <div class="panel-date">{{ formatDayLabel(d.date) }}</div>
          </div>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <ul class="day-list">
            <li
              v-for="item in itemsForDay(d.day).value"
              :key="item.id"
              class="day-list__item"
              @click="$router.push({ name: 'item-detail', params: { id: item.id } })"
            >
              <div class="time">{{ itemTime(item) }}</div>
              <div class="dot" :style="{ background: TYPE_META[item.type].color }">
                <v-icon :icon="TYPE_META[item.type].icon" color="white" size="14" />
              </div>
              <div class="title">{{ item.title }}</div>
              <v-icon icon="mdi-chevron-right" size="18" color="grey" />
            </li>
            <li v-if="!itemsForDay(d.day).value.length" class="empty-day">
              No items
            </li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<style scoped>
.trip-overview {
  padding: 16px 16px 24px;
}
.overview-header {
  margin-bottom: 16px;
}
.overview-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: rgba(0, 0, 0, 0.9);
}
.sub {
  font-size: 0.95rem;
  color: rgb(var(--v-theme-primary));
  font-weight: 500;
  margin-top: 2px;
}
.travelers {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.82rem;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 6px;
}
.trip-dates {
  font-size: 0.82rem;
  color: rgba(0, 0, 0, 0.55);
  margin-top: 2px;
}

.day-panels {
  border-radius: 14px;
  overflow: hidden;
}
.panel-title {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.panel-day {
  font-weight: 700;
  font-size: 0.95rem;
}
.panel-date {
  font-size: 0.78rem;
  color: rgba(0, 0, 0, 0.55);
}

.day-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.day-list__item {
  display: grid;
  grid-template-columns: 80px 28px 1fr 18px;
  align-items: center;
  gap: 8px;
  padding: 10px 4px;
  border-bottom: 1px solid #f0e8db;
  cursor: pointer;
  min-height: 44px;
}
.day-list__item:last-child {
  border-bottom: 0;
}
.day-list__item:active {
  background: #fdf3ee;
}
.time {
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
}
.dot {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.title {
  font-size: 0.92rem;
  color: rgba(0, 0, 0, 0.85);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.empty-day {
  padding: 12px 4px;
  color: rgba(0, 0, 0, 0.4);
  font-size: 0.85rem;
}
</style>
