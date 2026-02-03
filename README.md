# Cloud9 Assistant

An esports coaching & analytics platform with a React frontend (Vite) and Express backend.

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Setup & Run

1. **Install root dependencies** (for the `dev` script using `concurrently`):
   ```bash
   npm install
   ```

2. **Run both frontend and backend with one command:**
   ```bash
   npm run dev
   ```

   This starts:
   - **Backend**: http://localhost:3001 (Express, port 3001)
   - **Frontend**: http://localhost:4100 (Vite, port 4100)

3. **Open the app in your browser:**
   ```
   http://localhost:4100
   ```

### Manual Startup (if preferred)

**Terminal 1 — Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm install
npm run dev
```

## Project Structure

- `server/` — Express backend with API endpoints (ports 3001)
  - `index.js` — Main server with routes for predictions, analytics, team insights
  - Endpoints: `/api/matches/today`, `/api/predict`, `/api/teams/:id/insights`, `/api/artemis/draft/*`, etc.

- `client/` — React + Vite frontend
  - `src/` — React components (Dashboard, DraftBoard, WarRoom, etc.)
  - `vite.config.js` — Vite config with proxy to backend

## API Routes

The backend provides:
- **Matches:** `GET /api/matches/today`
- **Predictions:** `POST /api/predict` (with teamA, teamB in body)
- **Insights:** `GET /api/teams/:id/insights`
- **Draft Assist (LoL):** `POST /api/artemis/draft/predict`, `POST /api/artemis/draft/recommend`
- **War Room:** `/api/simulation/what-if`, `/api/match/momentum`, `/api/players/chemistry`

## Notes

- Frontend is bound to `127.0.0.1:4100` to avoid Windows firewall prompts.
- The client proxy forwards `/api/*` requests to the backend at `http://localhost:3001`.
- Demo data is provided if the Grid API is unavailable.

