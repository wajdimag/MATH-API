# ==========================================
# Stage 1: Dependencies & Development Build
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# ==========================================
# Stage 2: Testing Vulnerable Base Image
# ==========================================
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
# Copy compiled node_modules from Stage 1 to avoid npm CLI lockfile errors
COPY --from=builder /app/node_modules ./node_modules

COPY . .

USER node
EXPOSE 3000

CMD ["node", "server.js"]
