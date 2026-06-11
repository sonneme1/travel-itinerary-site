<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTrip } from '@/stores/trip'
import { formatLongDate } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const { trip, currentDay, days } = useTrip()

const headerDate = computed(() => {
  const today = days.value.find((d) => d.day === currentDay.value)
  return today ? formatLongDate(today.date) : ''
})

const showBack = computed(() => route.name === 'item-detail')
const goBack = () => {
  if (window.history.length > 1) router.back()
  else router.push({ name: 'timeline' })
}
</script>

<template>
  <v-app>
    <div class="phone-frame">
      <v-app-bar
        color="primary"
        density="comfortable"
        elevation="0"
        class="app-header"
      >
        <template v-if="showBack" #prepend>
          <v-btn icon="mdi-arrow-left" variant="text" @click="goBack" aria-label="Back" />
        </template>
        <div class="header-text">
          <div class="trip-name">{{ trip.name }}</div>
        </div>
      </v-app-bar>

      <v-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-main>

      <v-bottom-navigation
        color="primary"
        grow
        height="64"
        class="app-bottom-nav"
      >
        <v-btn :to="{ name: 'today' }">
          <v-icon>mdi-calendar-today</v-icon>
          <span>Today</span>
        </v-btn>
        <v-btn :to="{ name: 'timeline' }">
          <v-icon>mdi-timeline-text-outline</v-icon>
          <span>Timeline</span>
        </v-btn>
        <v-btn :to="{ name: 'trip' }">
          <v-icon>mdi-map-outline</v-icon>
          <span>Trip</span>
        </v-btn>
      </v-bottom-navigation>
    </div>
  </v-app>
</template>

<style>
html,
body,
#app {
  background: #efe6d9;
}

.phone-frame {
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.06);
  position: relative;
}

.app-header {
  position: sticky !important;
  top: 0;
  z-index: 5;
}
.app-header :deep(.v-toolbar__content) {
  padding-inline: 16px;
}
.app-header .v-toolbar__content {
  padding-left: 16px !important;
  padding-right: 16px !important;
}

.app-header .header-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.app-header .trip-name {
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.2px;
}
.app-header .trip-sub {
  font-size: 0.78rem;
  opacity: 0.92;
}

.main-content {
  padding-top: 0 !important;
  padding-bottom: 88px !important;
  --v-layout-top: 0px;
}
.main-content :deep(.v-main__wrap) {
  padding-top: 0;
}

.app-bottom-nav {
  max-width: 430px;
  margin: 0 auto;
  position: fixed !important;
  left: 0;
  right: 0;
  bottom: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
