# Plan v46: Full TailwindCSS v4 Migration, Spacing Fixes, & Chart Rendering Correction

## Goal

Install TailwindCSS v4 (`@tailwindcss/vite`), fix UI spacing inconsistencies, align component layout using modern Tailwind CSS utilities, and resolve data formatting/chart rendering bugs (invalid date padding, empty price/date labels).

## Proposed Changes

1. **TailwindCSS v4 Setup**:
   - Install `@tailwindcss/vite` and `tailwindcss`.
   - Update `quasar.config.js` to register `@tailwindcss/vite` plugin.
   - Add `@import "tailwindcss";` to `src/css/app.scss`.

2. **Fix Core Data & Date Parsing Bug**:
   - Fix `src/utils/utils.js` to pad `item.bulan` (`item.bulan.padStart(2, '0')`) when creating ISO date strings (`YYYY-MM-DD`). This fixes `Invalid Date` parsing in `MainChart.vue` and restores line chart rendering and initial price/date displays.

3. **Refactor UI Layout & Spacing using TailwindCSS v4**:
   - Update `IndexPage.vue`: Modernize grid system and container margins using Tailwind (`grid grid-cols-1 md:grid-cols-12 gap-6`, `p-6`).
   - Update `MainChart.vue`: Clean up header layout, refresh button alignment, price badges, info rows, and period selection buttons with Tailwind utilities.
   - Update `ListKomoditas.vue`: Fix search bar padding, list item avatar/text alignment, price badges, and handle empty sparkline price fallback (`Rp 0` instead of truncated `Rp`).

## Verification Plan

1. Verify `@tailwindcss/vite` build integration.
2. Verify `src/utils/utils.js` date parsing.
3. Verify `MainChart.vue` chart rendering, price displays, and period filtering.
4. Verify `ListKomoditas.vue` search bar and list item formatting.
