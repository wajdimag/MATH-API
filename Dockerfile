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

# Upgrade Alpine OS packages
RUN apk update && apk upgrade --no-cache

ENV NODE_ENV=production

# Install ONLY production dependencies, then remove npm CLI to eliminate base image findings
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Copy application source code
COPY . .

# Security Best Practice: Run as non-root user
USER node

EXPOSE 3000

CMD ["node", "server.js"]
