# 🎮 Dareo

A gamified social web app where friends form private groups and dare each other to complete quests for XP, levels, and bragging rights.

![TypeScript](https://img.shields.io/badge/TypeScript-98%25-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Stars](https://img.shields.io/github/stars/xkhaliil/Dareo?style=flat-square)

## What it does

Dareo lets a user sign up, create or join an invite-code-gated group, and post dares to that group. Members can claim open dares, then mark them completed, passed, or failed, which adjusts their XP, level, and rank. The app has a public landing page and auth-gated routes for the game view, a group view, and a profile view (with avatar upload). Client state (auth) is kept in Zustand with persistence, while server data (groups, dares, users) is fetched and cached through TanStack Query against an Express/Prisma API.

<details>
<summary>XP, leveling, and ranks (from the app's data model)</summary>

| Action | XP Change |
| --- | --- |
| Claim a dare | +5 XP |
| Complete a dare | + dare's XP reward |
| Pass / fail a dare | −200% of dare's XP |

Level is `floor(XP / 10)`, minimum level 1. Ranks run Rookie (0) → Bronze (50) → Silver (150) → Gold (250) → Platinum (350) → Diamond (500) → Legend (700).

Dares carry a difficulty (Easy/Medium/Hard/Extreme, each with a default and max XP reward) and a status (`OPEN`, `COMPLETED`, `PASSED`, `FAILED`).

</details>

## Tech stack

**Frontend** — React 19, TypeScript, Vite, React Router, Tailwind CSS, Radix UI / base-ui primitives, Zustand, TanStack Query, React Hook Form + Zod, Lucide icons, UploadThing (client).

**Backend** — Express, Prisma ORM with `@prisma/adapter-pg` against PostgreSQL, JWT (`jsonwebtoken`) auth, `bcryptjs` password hashing, CORS, UploadThing (server route).

**Testing / tooling** — Vitest, Testing Library (`jest-dom`), ESLint, Prettier, `depcheck`, `tsx`, `concurrently`.

## Getting started

```bash
npm install

# set required env vars (DATABASE_URL, JWT secret, UploadThing keys, etc.)
# <!-- TODO: document required environment variables, no .env.example present -->

npx prisma generate

# runs the Vite client and the tsx/Express server together
npm run dev
```

Other scripts: `npm run build` (Prisma generate + `tsc -b` + Vite build), `npm start` (run the built server), `npm run test` / `test:watch` (Vitest), `npm run lint` / `lint:fix`, `npm run format` / `format:check`.

## Usage

Client routes (see `src/main.tsx`):

| Route | Access |
| --- | --- |
| `/` | Public landing page |
| `/sign-in`, `/sign-up` | Public auth pages |
| `/game` | Protected — main game/dares view |
| `/group/:id` | Protected — group view |
| `/profile` | Protected — profile & avatar |

Unauthenticated users hitting a protected route are redirected to `/sign-in`; authenticated users hitting `/` are redirected to `/game`.

<!-- TODO: add a screenshot -->

## License

No license file is present in the repository.
