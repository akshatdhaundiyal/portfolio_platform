# Stage 1: Base (Shared Environment)
# Installs core dependencies required for both development and production.
FROM node:20-alpine as base

WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Development (Local Hot-Reload Engine)
# Optimized for rapid local iteration with live updates.
FROM base as development

COPY . .
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=development
EXPOSE 3000
# Development command is managed by docker-compose, but we set it here as a default
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Stage 3: Build (Compiling the production bundle)
FROM base as builder
COPY . .
RUN npm run build

# Stage 4: Production (Lightweight Runtime Runner)
# Contains ONLY the pre-built .output folder for maximum performance and security.
FROM node:20-alpine as production

WORKDIR /app
COPY --from=builder /app/.output ./.output
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
