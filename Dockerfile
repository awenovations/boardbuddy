FROM --platform=$BUILDPLATFORM node:22.23.5-alpine AS builder
WORKDIR /app

ENV CYPRESS_INSTALL_BINARY=0
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:22.23.5-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
COPY server.js server.js

EXPOSE 3000
ENV NODE_ENV=production

ENV PROTOCOL_HEADER=x-forwarded-proto
ENV HOST_HEADER=x-forwarded-host

CMD ["node", "server.js"]
