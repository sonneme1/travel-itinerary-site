<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ItineraryItem, ItemType } from '@/types/itinerary'
import { TYPE_META } from '@/types/itinerary'
import { useTrip } from '@/stores/trip'

const props = defineProps<{
  modelValue: boolean
  initial?: Partial<ItineraryItem> | null
  defaultDay?: number
  defaultDate?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved', item: ItineraryItem): void
}>()

const { addItem, updateItem, days } = useTrip()

const isEdit = ref(false)
const editingId = ref<string | null>(null)

const form = ref<{
  type: ItemType
  title: string
  date: string
  day: number
  startTime: string
  endTime: string
  address: string
  notes: string
  confirmation: string
}>({
  type: 'activity',
  title: '',
  date: '',
  day: 1,
  startTime: '',
  endTime: '',
  address: '',
  notes: '',
  confirmation: '',
})

const reset = () => {
  const initial = props.initial
  isEdit.value = Boolean(initial?.id)
  editingId.value = (initial?.id as string) ?? null

  const fallbackDay = props.defaultDay ?? days.value[0]?.day ?? 1
  const fallbackDate =
    props.defaultDate ?? days.value.find((d) => d.day === fallbackDay)?.date ?? ''

  form.value = {
    type: (initial?.type as ItemType) ?? 'activity',
    title: initial?.title ?? '',
    date: initial?.date ?? fallbackDate,
    day: initial?.day ?? fallbackDay,
    startTime: initial?.startTime ?? '',
    endTime: initial?.endTime ?? '',
    address: initial?.address ?? '',
    notes: initial?.notes ?? '',
    confirmation: initial?.confirmation ?? '',
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) reset()
  },
)

const close = () => emit('update:modelValue', false)

const onDateChange = (newDate: string) => {
  const match = days.value.find((d) => d.date === newDate)
  if (match) form.value.day = match.day
}

const valid = () =>
  Boolean(form.value.title.trim() && form.value.date && form.value.type)

const save = () => {
  if (!valid()) return
  const payload = {
    type: form.value.type,
    day: form.value.day,
    date: form.value.date,
    title: form.value.title.trim(),
    startTime: form.value.startTime || undefined,
    endTime: form.value.endTime || undefined,
    address: form.value.address.trim() || undefined,
    notes: form.value.notes.trim() || undefined,
    confirmation: form.value.confirmation.trim() || undefined,
  }
  if (isEdit.value && editingId.value) {
    updateItem(editingId.value, payload)
    emit('saved', { ...payload, id: editingId.value } as ItineraryItem)
  } else {
    const created = addItem(payload as Omit<ItineraryItem, 'id'>)
    emit('saved', created)
  }
  close()
}

const typeOptions = (Object.keys(TYPE_META) as ItemType[]).map((t) => ({
  title: TYPE_META[t].label,
  value: t,
}))
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    max-width="430"
    fullscreen-mobile
  >
    <v-card class="pa-0">
      <v-toolbar color="primary" density="compact">
        <v-btn icon="mdi-close" variant="text" @click="close" aria-label="Close" />
        <v-toolbar-title>{{ isEdit ? 'Edit item' : 'Add item' }}</v-toolbar-title>
        <v-spacer />
        <v-btn variant="text" :disabled="!valid()" @click="save">Save</v-btn>
      </v-toolbar>

      <v-card-text class="pa-4">
        <v-select
          v-model="form.type"
          :items="typeOptions"
          label="Type"
          variant="outlined"
          density="comfortable"
        />
        <v-text-field
          v-model="form.title"
          label="Title"
          variant="outlined"
          density="comfortable"
          required
        />
        <v-text-field
          v-model="form.date"
          label="Date"
          type="date"
          variant="outlined"
          density="comfortable"
          @update:model-value="onDateChange"
        />
        <div class="d-flex ga-2">
          <v-text-field
            v-model="form.startTime"
            label="Start time"
            type="time"
            variant="outlined"
            density="comfortable"
          />
          <v-text-field
            v-model="form.endTime"
            label="End time"
            type="time"
            variant="outlined"
            density="comfortable"
          />
        </div>
        <v-text-field
          v-model="form.address"
          label="Location / address"
          variant="outlined"
          density="comfortable"
        />
        <v-text-field
          v-model="form.confirmation"
          label="Confirmation #"
          variant="outlined"
          density="comfortable"
        />
        <v-textarea
          v-model="form.notes"
          label="Notes"
          variant="outlined"
          density="comfortable"
          rows="3"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
