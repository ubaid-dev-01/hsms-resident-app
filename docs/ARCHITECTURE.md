# Architecture — HSMS Resident App

## Intent

Mobile client for housing-society residents: auth flows and tabbed resident experiences talking to the HSMS backend. Built with React Native, TanStack Query, and Zustand.

## System shape

`app/` routes for auth and tabs; `services/` for API; `stores/` for client state.

## Stack decisions

- React Native
- Expo
- TypeScript
- TanStack Query
- Zustand

## Boundaries

- Secrets stay in environment variables / secret managers — never in git.
- Client bundles only receive public configuration (`NEXT_PUBLIC_*` / `VITE_*`).
- Tenant or role checks belong in middleware / server layers, not UI-only gates.
- Heavy or long-running work should not run inside short-lived serverless handlers unless designed for it.

## Quality bar

- Prefer typed contracts at API and domain boundaries.
- Ship a vertical slice (auth → persisted outcome) before a broad feature surface.
- Document trade-offs in PRs when changing data models or auth.

