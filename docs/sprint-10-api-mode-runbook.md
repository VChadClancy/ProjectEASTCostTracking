# API Mode Runbook (Sprint 10)

## Overview
This document describes how to run the Project EAST Cost Tracking frontend and backend locally in both default (mock) and API integration modes as of Sprint 10.

---

## 1. Default Mode (Mock Data)
- **Mode:** `VITE_FINANCIAL_DATA_SOURCE=mock` (default)
- **Frontend:**
  - No backend required.
  - All financial data is served from frontend mock repositories.
- **How to run:**
  ```sh
  # In the project root
  npm run dev
  ```

---

## 2. API Mode (Local Backend Integration)
- **Mode:** `VITE_FINANCIAL_DATA_SOURCE=api`
- **Backend:** Must be running locally.
- **Frontend:** Connects to backend API for financial data.
- **How to run:**

### Step 1: Start the Backend
Open a terminal and run:
```sh
cd backend
npm install # if not already done
npm run dev
```

- The backend will start on [http://localhost:4000](http://localhost:4000) (default).

### Step 2: Start the Frontend in API Mode
Open a separate terminal and run:
```sh
# In the project root
VITE_FINANCIAL_DATA_SOURCE=api VITE_API_BASE_URL=http://localhost:4000/api/v1 npm run dev
```

---

## 3. Backend Defaults
- The backend **still defaults to mock repositories** for all data sources.
- No production database or migrations are required for API mode.

---

## 4. Data Flow in API Mode
```
Frontend financial service
  → repository selector
    → API repository
      → backend route/controller/service
        → mock repository (backend)
```

---

## 5. Known Limitations (Sprint 10)
- API mode is **read-oriented** only (no create/update/delete).
- No broad UI workflow changes yet.
- No production database dependency.
- No authentication or RBAC.
- No deployed environment (local only).

---

## 6. Summary
- Use default mode for rapid frontend development with mock data.
- Use API mode to test frontend-backend integration (read-only, mock data).
- No backend or database setup is required for either mode at this stage.
