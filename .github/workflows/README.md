# GitHub Actions（canonical）

> **GitHub 只讀 repo 根目錄** `.github/workflows/`。本目錄為 CI 的**正式位置**。
>
> `wanderlens-infra/.github/workflows/` 保留相同副本；修改 workflow 時請**兩處同步**，或只改根目錄再複製到 infra。

| 檔案 | 說明 |
|------|------|
| `ci-api.yml` | Maven build + test |
| `ci-web.yml` | Nuxt lint + build |
| `ci-provider.yml` | Provider lint + build |
| `ci-admin.yml` | Admin lint + build |
| `ci-media.yml` | Media build |
| `ci-infra.yml` | docker compose / nginx 驗證 |
| `ci-e2e.yml` | 根目錄 Playwright（煙霧 `npm run test:e2e`） |
