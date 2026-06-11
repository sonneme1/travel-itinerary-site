<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTrip } from '@/stores/trip'
import DaySelector from '@/components/DaySelector.vue'
import ItineraryItemCard from '@/components/ItineraryItemCard.vue'
import ItemFormDialog from '@/components/ItemFormDialog.vue'
import { formatLongDate } from '@/utils/format'

const { days, currentDay, itemsForDay } = useTrip()

const selectedDay = ref<number>(currentDay.value)
const dialogOpen = ref(false)

const dayItems = computed(() => itemsForDay(selectedDay.value).value)
const dayDate = computed(() => days.value.find((d) => d.day === selectedDay.value)?.date ?? '')
</script>

<template>
  <div class="timeline-view">
    <DaySelector v-model="selectedDay" :days="days" />

    <div class="day-heading">
      <div class="day-heading__title">Day {{ selectedDay }}</div>
      <div class="day-heading__date">{{ formatLongDate(dayDate) }}</div>
    </div>

    <div class="timeline">
      <ItineraryItemCard v-for="item in dayItems" :key="item.id" :item="item" />
      <div v-if="!dayItems.length" class="empty">
        <v-icon icon="mdi-calendar-blank" size="48" color="grey" />
        <p>Nothing scheduled. Tap + to add an item.</p>
      </div>
    </div>

    <v-btn
      icon="mdi-plus"
      color="primary"
      size="large"
      class="fab"
      elevation="6"
      aria-label="Add item"
      @click="dialogOpen = true"
    />

    <ItemFormDialog
      v-model="dialogOpen"
      :default-day="selectedDay"
      :default-date="dayDate"
    />
  </div>
</template>

<style scoped>
.timeline-view {
  padding-top: 4px;
}
.day-heading {
  padding: 4px 16px 8px;
}
.day-heading__title {
  font-weight: 700;
  font-size: 1.3rem;
  color: rgba(0, 0, 0, 0.88);
}
.day-heading__date {
  font-size: 0.82rem;
  color: rgba(0, 0, 0, 0.55);
}
.timeline {
  padding: 8px 16px 16px;
}
.empty {
  text-align: center;
  padding: 48px 16px;
  color: rgba(0, 0, 0, 0.5);
}
.fab {
  position: fixed;
  bottom: 84px;
  right: max(16px, calc((100vw - 430px) / 2 + 16px));
  z-index: 4;
}
</style>
