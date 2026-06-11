# Travel Itinierary Mobile Webiste - Project Brief

## Summary
A mobile-first single-page trip itinerary website for a vacation traveler.
Primary user is Maya, a 41-year-old traveler who is traveling with her family on a 7-day trip to Portugal who needs to quickly find what's happening today and what's coming next. Her family is her husband and 9 year old daughter.
Think TripIt or Google Trips — but stripped down, fast, and thumb-friendly.
The core question the app answers: "What do I need to know right now?"

---

## Data
- Generate a fake dataset as a JSON file (src/data/trip.json)
- 7 days of trip data (arriving Day 1, departing Day 7) set in Lisbon & Porto, Portugal
- Traveling from Minneapolis/St. Paul airport
- Data should include the following item types:

  - Flights
    - Airline, flight number, departure/arrival airport and time
    - Terminal and gate (where applicable)
    - Confirmation number
    - Status (on time, delayed, boarding)

  - Hotels
    - Hotel name, address, check-in and check-out time
    - Confirmation number
    - Notes (e.g. breakfast included, rooftop pool)

  - Activities
    - Activity name, location/address, start and end time
    - Booking confirmation (if applicable)
    - Notes (e.g. wear comfortable shoes, bring passport)

  - Restaurants
    - Restaurant name, address, reservation time
    - Confirmation or reservation number
    - Notes (e.g. dress code, must-order dish)

  - Each item should include:
    - A type field (flight, hotel, activity, restaurant)
    - A day number (1–7) and a date
    - A title and short description
    - Start time and end time where applicable
    - Confirmation number
    - Address or location
    - Notes field

---

## Layout
- Mobile-first, designed for a 390px viewport (iPhone 14 size)
- Single scrollable page with a bottom navigation bar for moving between views
- Four views:
  - Today View: default landing view showing current day's events, what's happening now and what's next, with a clear "up next" highlight
  - Full Day Timeline: scrollable chronological list of all events for the selected day
  - Item Detail: tapping any item expands or navigates to a full detail view showing all fields, confirmation number, address, and notes
  - Trip Overview: a day-by-day summary of the full 7-day trip, collapsible by day

- Use a top-down hierarchy within each view — most time-critical information first
- Bottom navigation bar with icons for Today, Timeline, and Trip views
- Sticky header showing trip name and current day/date

---

## Interactions
- Bottom navigation: tap to switch between Today, Timeline, and Trip Overview views
- Day selector: horizontal scrollable pill/tab row to switch between days (Day 1 through Day 7) on the Timeline and Trip Overview views
- Item tap: tapping any itinerary item opens the Item Detail view with full information
- Add item: a floating action button (FAB) on the Timeline view opens a simple form to add a new itinerary item (type, title, date, time, location, notes, confirmation number)
- Edit item: from the Item Detail view, an edit button allows the user to modify any field
- Delete item: from the Item Detail view, a delete option removes the item with a confirmation prompt
- "Up Next" highlight: the next upcoming item on Today View is visually emphasized

---

## Style
- Clean, minimal, lots of whitespace
- Warm travel-inspired color palette — think soft neutrals with one accent color (e.g. terracotta, ocean blue, or sandy gold)
- Each item type has a distinct icon and subtle color tag:
  - ✈️ Flights — blue
  - 🏨 Hotels — warm neutral/tan
  - 🎭 Activities — coral/terracotta
  - 🍽️ Restaurants — green
- Large, thumb-friendly tap targets (minimum 44px)
- Typography is clear and readable at a glance — bold times, lighter supporting details
- No horizontal scrolling anywhere except the day selector
- Designed for one-handed use — primary actions reachable in the bottom half of the screen

---

## Tech
- Vue 3 + TypeScript + Vuetify 3
- Fake data from a local JSON file (src/data/trip.json) — no API calls
- Vue Router for navigating between the four views
- Single trip — no login or multi-trip management needed
- Persistent state for any edits using localStorage so changes survive a page refresh