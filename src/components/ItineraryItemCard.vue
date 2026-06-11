<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ItineraryItem } from '@/types/itinerary'
import { TYPE_META } from '@/types/itinerary'
import { formatTime, formatTimeRange } from '@/utils/format'

const props = defineProps<{
  item: ItineraryItem
  highlight?: boolean
  dim?: boolean
  tagText?: string
  tagIcon?: string
}>()

const router = useRouter()
const meta = computed(() => TYPE_META[props.item.type])

const timeText = computed(() => {
  const i = props.item
  if (i.type === 'hotel') {
    if (i.checkIn) return `Check-in ${formatTime(i.checkIn)}`
    return ''
  }
  return formatTimeRange(i.startTime, i.endTime)
})

const subText = computed(() => {
  const i = props.item
  if (i.type === 'flight') {
    return `${i.airline ?? ''} ${i.flightNumber ?? ''}`.trim()
  }
  if (i.type === 'hotel') {
    return i.address ?? ''
  }
  return i.address ?? i.description ?? ''
})

const open = () => router.push({ name: 'item-detail', params: { id: props.item.id } })
</script>

<template>
  <v-card
    :class="[
      'item-card',
      `item-card--${item.type}`,
      { 'item-card--highlight': highlight, 'item-card--dim': dim },
    ]"
    :elevation="highlight ? 4 : 1"
    @click="open"
  >
    <div class="item-card__row">
      <div class="item-card__time">
        <div v-if="timeText" class="time-main">{{ timeText.split(' – ')[0] }}</div>
        <div v-if="timeText.includes('–')" class="time-end">
          {{ timeText.split(' – ')[1] }}
        </div>
        <div v-else-if="!timeText" class="time-main">—</div>
      </div>

      <div class="item-card__icon" :style="{ background: meta.color }">
        <v-icon :icon="meta.color ? meta.icon : meta.icon" color="white" />
      </div>

      <div class="item-card__body">
        <div v-if="highlight" class="up-next-tag">
          <v-icon :icon="tagIcon ?? 'mdi-arrow-right-bold'" size="14" /> {{ tagText ?? 'Up next' }}
        </div>
        <div class="title">{{ item.title }}</div>
        <div v-if="subText" class="sub">{{ subText }}</div>
        <div class="meta-row">
          <v-chip
            size="x-small"
            variant="tonal"
            :style="{ color: meta.color, borderColor: meta.color }"
          >
            {{ meta.label }}
          </v-chip>
          <span v-if="item.type === 'flight' && item.status" class="status-pill">
            {{ item.status }}
          </span>
          <span v-if="item.type === 'flight' && item.gate" class="gate">
            Gate {{ item.gate }}
          </span>
        </div>
      </div>

      <v-icon class="chevron" icon="mdi-chevron-right" color="grey" />
    </div>
  </v-card>
</template>

<style scoped>
.item-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 14px;
  padding: 12px;
  margin-bottom: 10px;
  border-left: 4px solid transparent;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.item-card:active {
  transform: scale(0.99);
}
.item-card--flight {
  border-left-color: #3a7ca5;
}
.item-card--hotel {
  border-left-color: #c9a66b;
}
.item-card--activity {
  border-left-color: #c8553d;
}
.item-card--restaurant {
  border-left-color: #6a8e5a;
}
.item-card--highlight {
  border: 2px solid rgb(var(--v-theme-primary));
  border-left-width: 6px;
  background: linear-gradient(180deg, #fff 0%, #fff8f4 100%);
}
.item-card--dim {
  opacity: 0.55;
}

.item-card__row {
  display: grid;
  grid-template-columns: 70px 44px 1fr 24px;
  gap: 10px;
  align-items: center;
  min-height: 56px;
}

.item-card__time {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  white-space: nowrap;
}
.item-card--hotel .item-card__time {
  white-space: normal;
}
.time-main {
  font-weight: 700;
  font-size: 0.95rem;
  color: rgba(0, 0, 0, 0.85);
  line-height: 1.15;
}
.time-end {
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.5);
}

.item-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.item-card__body {
  min-width: 0;
}
.item-card__body .title {
  font-weight: 600;
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.88);
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
}
.item-card__body .sub {
  font-size: 0.82rem;
  color: rgba(0, 0, 0, 0.55);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta-row {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 6px;
  flex-wrap: wrap;
}
.status-pill {
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 999px;
  background: #eef5fb;
  color: #3a7ca5;
  text-transform: capitalize;
}
.gate {
  font-size: 0.72rem;
  color: rgba(0, 0, 0, 0.6);
}
.chevron {
  justify-self: end;
}

.up-next-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 2px;
}
</style>
