# GEMINI.md - Instructional Context

## Project Overview

This project is a single-page application (SPA) built with the Quasar Framework and Vue.js. It is designed to display commodity prices and inflation statistics for the "Kabupaten Mempawah" region. The application is titled "KOPI DEWA" (Kolaborasi Pengendalian Inflasi Daerah Kabupaten Mempawah).

The primary goal of the application is to provide a user-friendly interface for monitoring commodity prices and their impact on inflation. It is a collaborative effort between the local government and other stakeholders to control inflation in the region.

The application uses Pinia for state management and Chart.js for displaying charts.

### AI Analysis Section

The application includes a section that displays AI-powered analysis of commodity prices. This analysis is fetched from an external API and provides insights into price trends, volatility, and short-term outlooks. The UI for this section is designed to have a modern, "AI feel" to reflect the nature of the data being displayed.

## Building and Running

*   **Development Server:** `npm run dev`
*   **Build for Production:** `npm run build`
*   **Linting:** `npm run lint`
*   **Formatting:** `npm run format`
*   **Testing:** `npm run test` (Note: No tests are currently specified)

## Development Conventions

*   **Spec-Driven Development:** Before making any code changes, you must first consult the `spec` folder to understand the project's specifications. This is to ensure that your changes are consistent with the existing design and to avoid duplicating any functionality.
*   **API:** The API specification is documented in `spec/05-api-specification.md`.
*   **Components:** Component specifications are documented in the `spec/components` folder.
*   **User Interaction:** The application's behavior is described in `spec/03-user-interaction.md` using a Behavior-Driven Development (BDD) format.
*   **Styling:** The application uses a combination of a dark theme for the hero section and a light theme for the main content area. The styling is documented in `spec/04-styling-and-theme.md`.
