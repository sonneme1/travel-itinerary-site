import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'travel',
    themes: {
      travel: {
        dark: false,
        colors: {
          background: '#FBF7F2',
          surface: '#FFFFFF',
          'surface-bright': '#FFFFFF',
          'surface-light': '#F5EFE6',
          'surface-variant': '#EFE6D9',
          'on-surface-variant': '#5B544A',
          primary: '#C8553D',
          'primary-darken-1': '#A6432F',
          secondary: '#3A7CA5',
          accent: '#C9A66B',
          success: '#6A8E5A',
          warning: '#C9A66B',
          error: '#B23A48',
          info: '#3A7CA5',
        },
      },
    },
  },
  defaults: {
    VBtn: { rounded: 'lg' },
    VCard: { rounded: 'lg' },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})
