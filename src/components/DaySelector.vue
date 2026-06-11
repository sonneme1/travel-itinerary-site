<script setup lang="ts">
import { formatDayLabel } from '@/utils/format'

defineProps<{
  days: { day: number; date: string }[]
  modelValue: number
}>()

defineEmits<{ (e: 'update:modelValue', day: number): void }>()
</script>

<template>
  <div class="day-selector" role="tablist" aria-label="Select day">
    <button
      v-for="d in days"
      :key="d.day"
      :class="['day-pill', { active: d.day === modelValue }]"
      role="tab"
      :aria-selected="d.day === modelValue"
      @click="$emit('update:modelValue', d.day)"
    >
      <span class="day-num">Day {{ d.day }}</span>
      <span class="day-date">{{ formatDayLabel(d.date) }}</span>
    </button>
  </div>
</template>

<style scoped>
.day-selector {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 16px 12px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.day-selector::-webkit-scrollbar {
  display: none;
}
.day-pill {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 64px;
  min-height: 56px;
  padding: 8px 12px;
  border-radius: 18px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid #efe6d9;
  cursor: pointer;
  transition: all 0.15s ease;
}
.day-pill:active {
  transform: scale(0.97);
}
.day-pill.active {
  background: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
  color: white;
}
.day-num {
  font-weight: 700;
  font-size: 0.85rem;
}
.day-date {
  font-size: 0.7rem;
  opacity: 0.85;
}
</style>
