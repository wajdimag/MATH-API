# ==========================================
# Stage 1: Dependencies & Development Build
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# ==========================================
# Stage 2: Clean Production Runtime
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

# 1. Upgrade Alpine OS packages
RUN apk update && apk upgrade --no-cache

# 2. Upgrade global npm CLI to patch bundled npm vulnerabilities
RUN npm install -g npm@latest

ENV NODE_ENV=production

# Install ONLY production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy application source code
COPY . .

# Security Best Practice: Run as non-root user
USER node

EXPOSE 3000

CMD ["node", "server.js"]
