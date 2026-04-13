# Build Stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package configurations
COPY frontend/package*.json ./

# Install npm dependencies
RUN npm install

# Copy frontend source
COPY frontend ./

# Build Nuxt project (outputs to .output)
RUN npm run build

# Runner Stage (Keeps image slim)
FROM node:20-alpine

WORKDIR /app

# Copy built artifacts from the builder
COPY --from=builder /app/.output ./.output

# Required env variables for Nuxt SSR
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

# Execute serverless SSR output
CMD ["node", ".output/server/index.mjs"]
