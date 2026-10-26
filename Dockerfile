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

# 1. Mise à jour des paquets système Alpine
RUN apk update && apk upgrade --no-cache

# 2. Mise à jour de npm global vers la dernière version 10.x (compatible Node 20)
RUN npm install -g npm@10

ENV NODE_ENV=production

# Installation des dépendances de production uniquement
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copie du code source
COPY . .

# Sécurité : exécution sous un utilisateur non-root
USER node

EXPOSE 3000

CMD ["node", "server.js"]
