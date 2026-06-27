# wanderlens-web — 生產映像（需先在本機/CI 執行 npm run build）
# 因 @nuxtjs/i18n + unhead 在乾淨 node_modules 下建置有相容性問題，採預建 .output 打包
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001
ENV NITRO_PORT=3001

COPY .output ./.output

EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]
