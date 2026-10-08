<div align="center">

# HSMS Resident App

**Resident mobile experience — React Native / Expo**

![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat&logo=react&logoColor=61DAFB) ![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)

[Repository](https://github.com/ubaid-dev-01/hsms-resident-app) · [Author](https://github.com/ubaid-dev-01) · [Portfolio](https://ubaid-dev-01.vercel.app)

</div>

---

## Overview

Mobile client for housing-society residents: auth flows and tabbed resident experiences talking to the HSMS backend. Built with React Native, TanStack Query, and Zustand.

## Features

- Auth screens
- Tabbed resident UX
- React Query data hooks
- Zustand local stores
- Shared theme system

## Architecture

`app/` routes for auth and tabs; `services/` for API; `stores/` for client state.

## Tech stack

- React Native
- Expo
- TypeScript
- TanStack Query
- Zustand

## Project structure

```text
hsms-resident-app/
├── app/(auth) (tabs)
├── components/ screens/ services/ stores/ theme/
└── docs/
```

## Getting started

```bash
npm install
npx expo start
```

## Environment

Point API base URL at HSMS backend. Keep tokens in secure storage — never in git.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Expo start |
| `npm run android` / `ios` / `web` | Platform targets |

## Documentation

| Doc | Purpose |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System shape, data flow, boundaries |
| [docs/SETUP.md](docs/SETUP.md) | Local install, env, runbook |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | Branching, commits, PR checklist |


## Author

**M Ubaid Javaid** — Software Engineer (MERN / Next.js)

- GitHub: [https://github.com/ubaid-dev-01](https://github.com/ubaid-dev-01)
- Portfolio: [https://ubaid-dev-01.vercel.app](https://ubaid-dev-01.vercel.app)
- Email: mubaidjavaid97@gmail.com

## License

Source is published for portfolio and engineering review. Client product ownership is not implied unless stated in a case study.

