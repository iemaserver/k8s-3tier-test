# ---------- Stage 1: install production dependencies ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi \
    && npm cache clean --force

# ---------- Stage 2: minimal runtime image ----------
FROM node:22-alpine AS runtime
ENV NODE_ENV=production \
    PORT=5000
WORKDIR /app

# Copy only what is needed to run (no npm cache, no build tooling)
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src

# Run as the unprivileged "node" user that ships with the image
USER node
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:5000/api/health || exit 1

CMD ["node", "src/server.js"]
