# Plan v45: Frontend Docker & Seamless Dev Server Setup (KOPI DEWA Frontend)

## Goal

Align the `harga-front` repository with the spec-driven Docker and Development Environment configuration matching best practices established across the project. Ensure instant live reload (HMR), orphan process prevention, automatic port cleanup, and clear documentation.

## Proposed Changes

1. **Spec-Driven Documentation**:
   - Create `spec/Development_Environment_Setup.md` for frontend development environment specification (Docker, local script, ports, HMR, process lifecycle).
   - Update `SETUP_GUIDE.md` with instructions on running via Docker Compose and the new orphan-free `dev.sh` script.

2. **Docker Compose & Development Container**:
   - Create `Dockerfile` (Node 20 Alpine base with Quasar CLI support).
   - Create `docker-compose.yml` (service `frontend` listening on port 9100, mounting `./:/app`, polling enabled for HMR).

3. **Environment Setup (.env)**:
   - Create `.env` based on `.env.example` with `VITE_API_BASE_URL=http://localhost:8000/api`, port 9100, and KOPI DEWA identity settings.

4. **Seamless Dev Server & HMR Script**:
   - Update `quasar.config.js` to allow dynamic `PORT` env and bind to `0.0.0.0`.
   - Create `dev.sh` script to check port 9100, kill any orphan process listening on port 9100 before start, handle SIGINT/SIGTERM/EXIT signals via bash traps to ensure no child/orphan processes linger on exit.
   - Update `package.json` with script entries (`npm run dev:clean`, etc.).

5. **Walkthrough Document**:
   - Create `walkthrough.md` documenting verification results and usage details.

## Verification Plan

1. Verify `.env` file created and configured.
2. Test `dev.sh` execution: check process launching, orphan cleanup, signal handling, and clean shutdown on Ctrl+C.
3. Test Docker setup: verify Docker container build and runtime.
4. Verify file syntax across all modified/created configuration files.
