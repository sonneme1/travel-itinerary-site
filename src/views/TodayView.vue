<script setup lang="ts">
import { computed } from 'vue'
import { useTrip } from '@/stores/trip'
import { TYPE_META } from '@/types/itinerary'
import { formatLongDate, formatTime, formatTimeRange } from '@/utils/format'
import ItineraryItemCard from '@/components/ItineraryItemCard.vue'

const {
  trip,
  currentDay,
  itemsForDay,
  upNextItem,
  happeningNowItem,
  itemEndTimestamp,
} = useTrip()

const todays = computed(() => itemsForDay(currentDay.value).value)

const todayDate = computed(
  () => trip.value.items.find((i) => i.day === currentDay.value)?.date ?? '',
)

const now = computed(() => Date.now())

const isPast = (id: string) => {
  const item = todays.value.find((i) => i.id === id)
  if (!item) return false
  return itemEndTimestamp(item) < now.value
}

const isHappeningNow = (id: string) => happeningNowItem.value?.id === id
const isUpNext = (id: string) => upNextItem.value?.id === id && !isHappeningNow(id)

const remaining = computed(() => todays.value.filter((i) => !isPast(i.id)))
const past = computed(() => todays.value.filter((i) => isPast(i.id)))

const upNextMeta = computed(() =>
  upNextItem.value ? TYPE_META[upNextItem.value.type] : null,
)

const upNextTimeText = computed(() => {
  const i = upNextItem.value
  if (!i) return ''
  if (i.type === 'hotel' && i.checkIn) return `Check-in ${formatTime(i.checkIn)}`
  return formatTimeRange(i.startTime, i.endTime)
})
</script>

<template>
  <div class="today-view">
    <section class="hero">
      <div class="eyebrow">Today \u00b7 Day {{ currentDay }}</div>
      <h1 class="hero-title">{{ formatLongDate(todayDate) }}</h1>
      <div v-if="happeningNowItem" class="now-pill">
        <v-icon icon="mdi-circle" size="10" color="error" class="pulse" />
        <span>Happening now: {{ happeningNowItem.title }}</span>
      </div>
    </section>

    <section v-if="upNextItem" class="up-next-card" @click="$router.push({ name: 'item-detail', params: { id: upNextItem.id } })">
      <div class="up-next-eyebrow">
        <v-icon icon="mdi-arrow-right-bold" size="16" /> Up next
      </div>
      <div class="up-next-row">
        <div
          class="up-next-icon"
          :style="{ background: upNextMeta?.color }"
        >
          <v-icon :icon="upNextMeta?.icon" color="white" size="28" />
        </div>
        <div class="up-next-body">
          <div class="up-next-title">{{ upNextItem.title }}</div>
          <div v-if="upNextTimeText" class="up-next-time">{{ upNextTimeText }}</div>
          <div v-if="upNextItem.address" class="up-next-sub">
            <v-icon icon="mdi-map-marker" size="14" /> {{ upNextItem.address }}
          </div>
        </div>
      </div>
      <div v-if="upNextItem.notes" class="up-next-notes">
        <v-icon icon="mdi-information-outline" size="14" /> {{ upNextItem.notes }}
      </div>
    </section>

    <section v-if="remaining.length" class="schedule">
      <div class="section-title">Coming up today</div>
      <ItineraryItemCard
        v-for="item in remaining"
        :key="item.id"
        :item="item"
        :highlight="isUpNext(item.id) || isHappeningNow(item.id)"
      />
    </section>

    <section v-if="past.length" class="schedule">
      <div class="section-title section-title--muted">Earlier today</div>
      <ItineraryItemCard
        v-for="item in past"
        :key="item.id"
        :item="item"
        dim
      />
    </section>

    <div v-if="!todays.length" class="empty">
      <v-icon icon="mdi-calendar-blank" size="48" color="grey" />
      <p>No plans scheduled for today.</p>
    </div>
  </div>
</template>

<style scoped>
.today-view {
  padding: 16px 16px 24px;
}
.hero {
  margin-bottom: 16px;
}
.eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
}
.hero-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 4px 0 8px;
  line-height: 1.15;
  color: rgba(0, 0, 0, 0.88);
}
.now-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  background: rgba(178, 58, 72, 0.08);
  color: rgb(var(--v-theme-error));
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 500;
}
.pulse {
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.up-next-card {
  background: linear-gradient(135deg, #fff 0%, #fdf3ee 100%);
  border: 2px solid rgb(var(--v-theme-primary));
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 24px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(200, 85, 61, 0.12);
  transition: transform 0.15s ease;
}
.up-next-card:active {
  transform: scale(0.99);
}
.up-next-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 10px;
}
.up-next-row {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 14px;
  align-items: center;
}
.up-next-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.up-next-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.9);
  line-height: 1.2;
}
.up-next-time {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  margin-top: 2px;
}
.up-next-sub {
  font-size: 0.82rem;
  color: rgba(0, 0, 0, 0.6);
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.up-next-notes {
  margin-top: 12px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  font-size: 0.82rem;
  color: rgba(0, 0, 0, 0.7);
  display: flex;
  gap: 6px;
  align-items: flex-start;
  line-height: 1.4;
}

.schedule {
  margin-bottom: 24px;
}
.section-title {
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 8px;
  padding-left: 4px;
}
.section-title--muted {
  color: rgba(0, 0, 0, 0.4);
}
.empty {
  text-align: center;
  padding: 48px 16px;
  color: rgba(0, 0, 0, 0.5);
}
</style>
