# PLANS.md

## Goal

Scaffold a lean Next.js + TypeScript + Tailwind project aligned with AGENTS.md and the reference HTML, with a base layout shell and Supabase client placeholders.

## Assumptions

- No schema, auth, or payments implemented yet (placeholders only).
- Visual system follows `reference.html` (EB Garamond + Sora, color tokens, spacing).
- Use pnpm; network installs will be done by the developer locally.

## Files to Change / Add

- package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.js
- app/layout.tsx, app/page.tsx, styles/globals.css
- components/site/Header.tsx, components/site/Footer.tsx
- lib/config.ts, supabase/client.ts
- README.md, docs/SETUP.md

## Risks

- Tailwind theme parity may require iteration as features expand.
- External image host allowance limited to Googleusercontent per reference; may need more domains later.
- Supabase auth/helpers not installed yet; added later when auth starts.

## Implementation Steps

1. Add base Next.js + TS config and scripts
2. Configure Tailwind with reference color system and radii
3. Implement global styles and fonts via next/font
4. Add header, hero, benefits band, footer
5. Add Supabase client placeholder
6. Document setup and commands

## Verification Checklist

- pnpm dev runs locally after `pnpm install`
- Home page renders with header/hero/footer matching reference feel
- Tailwind classes available and color tokens usable
- Remote image host works
- No runtime crash without Supabase env vars

---

## Deployment: Dockerization (added)

### Goal
Containerize the app for both development (hot reload) and production (standalone Next.js output) without expanding the stack.

### Assumptions
- Supabase remains external (no local DB containers added).
- Use Docker + docker-compose only for the web app.

### Files
- Dockerfile (multi-stage: dev/build/runner)
- .dockerignore
- docker-compose.yml (dev and prod services)
- next.config.mjs updated with `output: 'standalone'` for smaller images

### Risks
- Dev file watching inside containers can be flaky on some hosts; `CHOKIDAR_USEPOLLING` is enabled.

### Steps
1. Add multi-stage Dockerfile (dev + prod)
2. Add docker-compose.yml for easy dev/prod runs
3. Configure Next standalone output
4. Document usage in README

### Verification
- docker compose up --build serves app on :3000 (dev)
- docker compose --profile prod up web-prod serves built app on :3000
