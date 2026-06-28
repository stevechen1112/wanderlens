# wanderlens-web — Nuxt 3 SSR 執行映像
# 建置：於 wanderlens-web 目錄執行
#   NUXT_PUBLIC_API_BASE=https://api.wanderlenstw.com/api npm run build
# 再於 wanderlens-infra 執行 docker compose build web
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001
ENV NITRO_PORT=3001

COPY .output ./.output

EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]
