# syntax=docker/dockerfile:1.6

ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS base
ENV CI=true
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat
WORKDIR /app
SHELL ["/bin/sh", "-lc"]
RUN corepack enable && corepack prepare pnpm@latest --activate

# --- Dependencies layer ---
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- Dev runtime (hot reload) ---
FROM deps AS dev
ENV HOST=0.0.0.0
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev", "-p", "3000"]

# --- Build layer ---
FROM deps AS build
COPY . .
RUN pnpm build

# --- Production runtime ---
FROM node:${NODE_VERSION} AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Copy standalone output
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
