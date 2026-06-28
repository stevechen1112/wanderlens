# wanderlens-web — Nuxt 3 SSR（多階段建置，API base 於 build 時注入）
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG NUXT_PUBLIC_API_BASE=https://api.wanderlenstw.com/api
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE

RUN npm run build

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001
ENV NITRO_PORT=3001

COPY --from=builder /app/.output ./.output

EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]
