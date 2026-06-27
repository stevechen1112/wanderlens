# JoyShot Node Server — 專案完整說明文件

> JoyShot 平台的 Node.js 輕量後端服務，作為 Google Places API 的代理伺服器（Proxy），提供地點文字搜尋功能給前端 App 使用。

---

## 一、專案概覽

| 項目 | 內容 |
|------|------|
| **專案名稱** | `server`（joyshot-node-server） |
| **版本** | `1.0.0` |
| **技術棧** | Node.js + Express 4.18.2 + Axios 1.3.4 |
| **伺服器 Port** | 3000 |
| **用途** | Google Places API Text Search 代理 |
| **正式部署路徑** | `/var/www/node-server/` |

---

## 二、技術棧

| 套件 | 版本 | 用途 |
|------|------|------|
| `express` | ^4.18.2 | Web 框架 |
| `axios` | ^1.3.4 | HTTP 客戶端（呼叫 Google Places API） |

### 開發工具

| 套件 | 用途 |
|------|------|
| `nodemon` | 自動重啟（開發模式） |

---

## 三、專案結構

```
joyshot-node-server/
├── index.js              # 主程式（Express 伺服器）
├── package.json          # 專案設定與依賴
├── package-lock.json     # 依賴鎖定
├── start.sh              # 啟動腳本（背景啟動 + 記錄 PID）
└── stop.sh               # 停止腳本（透過 PID 終止程序）
```

---

## 四、主程式（index.js）

### 4.1 伺服器設定

```js
const express = require('express');
const app = express();

app.use((req, res, next) => {
    next();  // 全域中介軟體（目前空邏輯）
});

app.listen(3000, () => {
    console.log('Node run at 3000');
});
```

### 4.2 API 端點

#### `GET /textsearch`

**用途**：代理呼叫 Google Places API Text Search，解決前端 CORS 問題。

**請求參數**：

| 參數 | 類型 | 說明 |
|------|------|------|
| `query` | string | 搜尋關鍵字（地點名稱、地址等） |
| `lang` | string | 語系（如 `zh-TW`、`en`） |

**實作邏輯**：

```js
app.get("/textsearch", (req, res) => {
    let key = "AIzaSyD9kBPooRXLLadDGapObylIZgcWay3Pdus"; // joyshotapp@gmail.com
    let textsearch = "https://maps.googleapis.com/maps/api/place/textsearch/json";
    let googleMap = `${textsearch}?region=tw&language=${req.query.lang}&key=${key}&query=${req.query.query}`;

    axios.get(googleMap).then(function(response) {
        res.header("Access-Control-Allow-Origin", "*"); // 解 CORS
        res.send(response.data);
    }).catch(function(error) {
        console.log(error);
    });
});
```

**Google API 設定**：
- API Key：`AIzaSyD9kBPooRXLLadDGapObylIZgcWay3Pdus`（joyshotapp@gmail.com 帳號）
- 端點：`https://maps.googleapis.com/maps/api/place/textsearch/json`
- 固定參數：`region=tw`（台灣區域）
- 動態參數：`language`（語系）、`query`（搜尋關鍵字）

**回應**：
- `Access-Control-Allow-Origin: *`（允許所有來源跨域存取）
- 回傳 Google Places API 的原始 JSON 回應

#### `GET /`

**用途**：健康檢查端點。

```js
app.get("/", (req, res) => {
    res.send("hello node");
});
```

---

## 五、與前端專案的整合

### 整合對象

**joyshot-app**（客戶端 App）透過 `vue.config.js` 的 proxy 設定整合：

```js
// joyshot-app/vue.config.js
devServer: {
    proxy: {
        '/place-api': {
            target: 'http://localhost:3000/',
            pathRewrite: { '^/place-api': '' }
        }
    }
}
```

### 使用場景

在 `joyshot-app` 的 `Header.vue` 搜尋列中，使用者輸入拍攝地點時：

1. 前端 `el-autocomplete` 元件觸發搜尋（debounce 700ms）
2. 呼叫 `/place-api/textsearch?query=...&lang=...`
3. Vue CLI proxy 將請求轉發至 `http://localhost:3000/textsearch`
4. Node Server 代理呼叫 Google Places API
5. 回傳地點清單（名稱、地址、評分、plus_code 等）
6. 使用者選取地點後，前端解析 `plus_code.compound_code` 取得縣市/區域

### 正式環境

正式環境中，前端 App 直接呼叫 Node Server 的 `/textsearch` 端點（不再透過 proxy），Node Server 部署於 `/var/www/node-server/`。

---

## 六、部署腳本

### 6.1 start.sh（啟動）

```bash
node index.js > nohup.out & echo $! > ./pid.file &
```

- 背景啟動 Node 伺服器
- 輸出重導至 `nohup.out`
- 將程序 PID 寫入 `pid.file`

### 6.2 stop.sh（停止）

```bash
#!/bin/bash
kill $(cat /var/www/node-server/pid.file)
```

- 從 `pid.file` 讀取 PID
- 使用 `kill` 終止程序

---

## 七、開發指令

```bash
# 安裝依賴
npm install

# 開發模式（nodemon 自動重啟）
npm run devStart

# 正式部署
./start.sh

# 停止服務
./stop.sh
```

---

## 八、設計特點

1. **極簡設計**：整個專案僅一個 `index.js` 檔案，約 30 行程式碼
2. **API 代理**：解決前端直接呼叫 Google Places API 的 CORS 問題
3. **API Key 隱藏**：Google API Key 存於伺服器端，不暴露給前端
4. **固定區域**：`region=tw` 固定為台灣區域搜尋
5. **CORS 開放**：`Access-Control-Allow-Origin: *` 允許所有來源

---

## 九、已知問題與觀察

1. **API Key 硬編碼**：Google Maps API Key 直接寫在 `index.js` 中且已提交 Git，應移至環境變數
2. **無錯誤回傳**：`catch` 區塊僅 `console.log(error)`，未回傳錯誤給前端
3. **無 rate limiting**：無請求頻率限制，可能被 Google API 配額限制
4. **無 HTTPS**：正式環境若無反向代理（Nginx），則為 HTTP 明文傳輸
5. **無日誌系統**：僅 `nohup.out` 重導，無結構化日誌
6. **註解中的舊 API Key**：`AIzaSyCZt0Avv2Dx6P9uSyYXAh2dP-dx5JaxrII`（被註解，為 admin/app 使用的另一組 key）

---

## 十、與其他專案的關係

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  joyshot-app    │────▶│ joyshot-node-    │────▶│  Google Places API  │
│  (客戶端 App)   │     │ server (Proxy)   │     │  (textsearch)       │
│  localhost:9666 │     │ localhost:3000   │     │                     │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
                              │
                              │  API Key 隱藏於伺服器端
                              │  解決 CORS 問題
                              │  固定 region=tw
```

| 專案 | 角色 |
|------|------|
| `joyshot-app` | 前端客戶端，透過 `/place-api` proxy 呼叫 Node Server |
| `joyshot-node-server` | API 代理伺服器，轉發請求至 Google Places API |
| `joyshot-api` | Java 後端（不直接使用 Node Server） |
| `joyshot-admin` | 管理後台（不直接使用 Node Server） |
| `joyshot-photographer` | 攝影師端（不直接使用 Node Server） |

---

*文件生成日期：2026-06-23*