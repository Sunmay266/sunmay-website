# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 關於這個 Repository

森美中醫診所（Sunmay TCM Clinic）的靜態官網，部署在 Cloudflare Pages，搭配 Pages Functions 提供小型 API。

網站以 **`index.html` 為主頁**（含 inline `<style>` 與 inline `<script>`），加上 `treatments/` 下 8 個療程子頁（每頁同樣是自包含的單一 HTML，inline CSS 沿用相同設計變數）。沒有 build step、沒有 framework、沒有 package.json。

### 療程子頁（treatments/）

| 檔案 | 療程 |
|------|------|
| `weight-loss.html` | 中醫減重 |
| `acupotomy.html` | 超微針刀（小針刀・圓針） |
| `fu-needling.html` | 浮針療法 |
| `acupuncture.html` | 針灸療程 |
| `facial-acupuncture.html` | 美顏針 |
| `embedding.html` | 埋線療程 |
| `gynecology.html` | 婦科調理 |
| `exosome-hair.html` | 外泌體養髮 |
| `pediatric-growth.html` | 小兒轉骨 |
| `sanfu-sanjiu.html` | 三伏貼・三九貼（穴位敷貼） |

- 線上網址為無副檔名形式（Cloudflare Pages 自動處理）：`/treatments/weight-loss`
- 每頁含獨立 SEO meta、canonical、JSON-LD `@graph`（BreadcrumbList / MedicalWebPage / MedicalTherapy+Service / FAQPage），`provider` 以 `@id` 指回首頁的 `#clinic` 實體
- 首頁療程卡片以 `.treatment-link` 連到各子頁；首頁 JSON-LD 的 OfferCatalog 每個 itemOffered 也帶 `url`
- **新增或刪除療程頁時，要同步更新：首頁卡片連結與 OfferCatalog、`sitemap.xml`、`llms.txt` 的療程頁面清單**
- 安全標頭與快取策略在根目錄 `_headers`（Cloudflare Pages 格式）

## 開發與部署

- 本機預覽：直接用瀏覽器開 `index.html`，或用任何靜態伺服器（例如 `npx serve .`）
- 部署：push 到 `main` 會觸發 `.github/workflows/deploy.yml`，透過 `npx wrangler pages deploy . --project-name=sunmay-website` 部署到 Cloudflare Pages
- 若要本機測試 Pages Functions（如 `/api/counter`），用 `npx wrangler pages dev .`

## 架構重點

### `index.html` 結構
單一檔案內依序為：
1. `<head>`：SEO meta（title/description/OG）、Google Analytics (gtag)、`application/ld+json` 結構化資料（`MedicalClinic` schema，含地址、營業時間、療程清單）、CSS 自訂變數與全站樣式
2. `<body>`：依序為 nav（含 hamburger 行動選單）、hero、各 `<section>`（`#about` 關於森美、`#doctor` 醫師介紹、`#schedule` 診療時間、`#treatments` 診療項目、`#environment` 診所空間、`#testimonials` 患者心得（目前 `display:none` 隱藏）、`#faq` 常見問題）、footer、浮動社群按鈕
3. 結尾 `<script>`：hamburger 選單、pageview counter fetch、FAQ accordion、nav scroll 陰影、IntersectionObserver 淡入動畫

### 設計系統（CSS 變數，定義在 `:root`）
- 主色：`--green` (#407248) / `--green-dark` / `--green-light`
- 中性色：`--sand`、`--cream`、`--cream-light`、`--white`
- 文字色：`--text-dark`、`--text-mid`、`--text-muted`
- 字體：`--serif` (Noto Serif TC)、`--display` (Cormorant Garamond)
- 各 section 背景色刻意交錯使用 cream/white/green 系列，避免單調（見最近 commit）

### Pages Functions
- `functions/api/counter.js`：讀寫 Cloudflare KV namespace `COUNTER_KV` 做累積人氣計數，若 binding 不存在則 fallback 回傳固定基底值 888

### SEO / 結構化資料同步
修改診所基本資訊（地址、營業時間、療程項目、社群連結等）時，要同步檢查以下檔案是否一致：
- `index.html` 內的 `<head>` meta 與 `application/ld+json`
- `llms.txt`
- `sitemap.xml`、`rss.xml`

### 圖片
- 全部放在 `images/`，命名為 `img_jpeg_NN.jpg` / `img_png_NN.png`
- `extract_images.py` 是一次性工具，把舊版 HTML 裡的 base64 inline 圖片抽出存成檔案並改寫 `<img src>`；正常開發不需要執行

## 語言與排版

- 站內容為繁體中文，中英文/數字交界處加半形空格（例如：台北市大安區 266 巷）
