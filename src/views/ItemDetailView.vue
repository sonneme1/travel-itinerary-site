<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTrip } from '@/stores/trip'
import { TYPE_META } from '@/types/itinerary'
import {
  formatLongDate,
  formatTime,
  formatTimeRange,
} from '@/utils/format'
import ItemFormDialog from '@/components/ItemFormDialog.vue'

const props = defineProps<{ id: string }>()

const router = useRouter()
const { itemById, deleteItem } = useTrip()

const item = itemById(props.id)

const meta = computed(() => (item.value ? TYPE_META[item.value.type] : null))

const editOpen = ref(false)
const deleteConfirmOpen = ref(false)

const onDelete = () => {
  deleteItem(props.id)
  deleteConfirmOpen.value = false
  router.replace({ name: 'timeline' })
}

const fields = computed(() => {
  const i = item.value
  if (!i) return []
  const list: { label: string; value: string; icon: string }[] = []

  if (i.type === 'flight') {
    if (i.airline || i.flightNumber)
      list.push({
        label: 'Flight',
        value: `${i.airline ?? ''} ${i.flightNumber ?? ''}`.trim(),
        icon: 'mdi-airplane',
      })
    if (i.departureAirport)
      list.push({ label: 'From', value: i.departureAirport, icon: 'mdi-airplane-takeoff' })
    if (i.arrivalAirport)
      list.push({ label: 'To', value: i.arrivalAirport, icon: 'mdi-airplane-landing' })
    if (i.terminal || i.gate)
      list.push({
        label: 'Terminal / Gate',
        value: [i.terminal, i.gate ? `Gate ${i.gate}` : ''].filter(Boolean).join(' \u00b7 '),
        icon: 'mdi-door',
      })
    if (i.status)
      list.push({ label: 'Status', value: i.status, icon: 'mdi-clock-check-outline' })
  }

  if (i.type === 'hotel') {
    if (i.checkIn)
      list.push({ label: 'Check-in', value: formatTime(i.checkIn), icon: 'mdi-login' })
    if (i.checkOut)
      list.push({
        label: 'Check-out',
        value: i.checkOutDate
          ? `${formatLongDate(i.checkOutDate)} \u00b7 ${formatTime(i.checkOut)}`
          : formatTime(i.checkOut),
        icon: 'mdi-logout',
      })
  }

  if ((i.type === 'activity' || i.type === 'restaurant') && (i.startTime || i.endTime)) {
    list.push({
      label: 'Time',
      value: formatTimeRange(i.startTime, i.endTime),
      icon: 'mdi-clock-outline',
    })
  }

  if (i.address)
    list.push({ label: 'Location', value: i.address, icon: 'mdi-map-marker' })

  if (i.confirmation)
    list.push({
      label: 'Confirmation',
      value: i.confirmation,
      icon: 'mdi-numeric',
    })

  return list
})
</script>

<template>
  <div v-if="item" class="detail-view">
    <div class="hero" :style="{ background: meta?.color }">
      <v-icon :icon="meta?.icon" color="white" size="56" />
      <div class="hero-label">{{ meta?.label }}</div>
      <div class="hero-title">{{ item.title }}</div>
      <div class="hero-date">
        Day {{ item.day }} · {{ formatLongDate(item.date) }}
      </div>
    </div>

    <div class="detail-body">
      <p v-if="item.description" class="description">{{ item.description }}</p>

      <ul class="fields">
        <li v-for="f in fields" :key="f.label" class="field">
          <v-icon :icon="f.icon" size="18" color="grey-darken-1" />
          <div class="field-text">
            <div class="field-label">{{ f.label }}</div>
            <div class="field-value">{{ f.value }}</div>
          </div>
        </li>
      </ul>

      <div v-if="item.notes" class="notes">
        <div class="notes-label">
          <v-icon icon="mdi-note-text-outline" size="16" /> Notes
        </div>
        <p>{{ item.notes }}</p>
      </div>

      <div class="actions">
        <v-btn
          variant="tonal"
          color="primary"
          prepend-icon="mdi-pencil"
          block
          size="large"
          @click="editOpen = true"
        >
          Edit
        </v-btn>
        <v-btn
          variant="text"
          color="error"
          prepend-icon="mdi-trash-can-outline"
          block
          size="large"
          @click="deleteConfirmOpen = true"
        >
          Delete item
        </v-btn>
      </div>
    </div>

    <ItemFormDialog v-model="editOpen" :initial="item" />

    <v-dialog v-model="deleteConfirmOpen" max-width="360">
      <v-card>
        <v-card-title>Delete this item?</v-card-title>
        <v-card-text>
          "{{ item.title }}" will be removed from your itinerary.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteConfirmOpen = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="onDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <div v-else class="missing">
    <v-icon icon="mdi-help-circle-outline" size="48" color="grey" />
    <p>Item not found.</p>
    <v-btn variant="tonal" :to="{ name: 'timeline' }">Back to timeline</v-btn>
  </div>
</template>

<style scoped>
.detail-view {
  padding-bottom: 24px;
}
.hero {
  padding: 28px 20px 32px;
  color: white;
  text-align: left;
}
.hero-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  margin-top: 12px;
  opacity: 0.85;
}
.hero-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-top: 4px;
  line-height: 1.2;
}
.hero-date {
  font-size: 0.85rem;
  opacity: 0.85;
  margin-top: 4px;
}

.detail-body {
  padding: 16px;
}
.description {
  color: rgba(0, 0, 0, 0.7);
  font-size: 0.95rem;
  margin: 0 0 16px;
}
.fields {
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgb(var(--v-theme-surface));
  border-radius: 14px;
  overflow: hidden;
}
.field {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 10px;
  align-items: flex-start;
  padding: 14px 14px;
  border-bottom: 1px solid #f0e8db;
  min-height: 44px;
}
.field:last-child {
  border-bottom: 0;
}
.field-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.5);
}
.field-value {
  font-size: 0.95rem;
  color: rgba(0, 0, 0, 0.88);
  line-height: 1.35;
  word-break: break-word;
}
.notes {
  margin-top: 16px;
  background: #fff8f0;
  border-radius: 14px;
  padding: 14px;
  border-left: 4px solid rgb(var(--v-theme-accent));
}
.notes-label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.55);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.notes p {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.45;
  color: rgba(0, 0, 0, 0.78);
}
.actions {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.missing {
  padding: 64px 24px;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
</style>
