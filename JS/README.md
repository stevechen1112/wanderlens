# JS 遺產參考（joyshot）

> **唯讀參考**：本目錄為 WanderLens 前置研究時保留的舊 joyshot 程式碼，**請勿在此開發新功能**。

## 用途

- 對照舊版 API / UI 行為（見 [WanderLens_05_前置研究與JS遺產盤點.md](../WanderLens_05_前置研究與JS遺產盤點.md)）
- 查閱歷史實作細節

## 現行開發位置

| 舊 joyshot | WanderLens |
|------------|------------|
| joyshot-api | [wanderlens-api](../wanderlens-api/README.md) |
| joyshot-app | [wanderlens-web](../wanderlens-web/README.md) |
| joyshot-photographer | [wanderlens-provider](../wanderlens-provider/README.md) |
| joyshot-admin | [wanderlens-admin](../wanderlens-admin/README.md) |

## 注意

- 不要將此目錄加入 Docker build 或 CI
- 若需刪減體積，請先確認無文件連結依賴，再移至 `archive/`（另開議題）
