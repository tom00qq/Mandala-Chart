# 問題紀錄

## 基本資訊

- **日期：** 2025-06-10
- **標籤：** #截圖功能 #html2canvas #CSS #oklch #tailwind

## 問題描述

### 現象

點擊截圖按鈕時發生錯誤：

```
Error: Attempting to parse an unsupported color function "oklch"
```

### 環境

- html2canvas: ^1.4.1
- Tailwind CSS: ^4.1.8
- 瀏覽器：Chrome
- Vite: ^6.3.3
- React: ^19.1.0

### 重現步驟

1. 點擊截圖按鈕
2. html2canvas 嘗試解析 DOM 樣式
3. 遇到 Tailwind v4 生成的 oklch 顏色函數
4. 拋出錯誤並中止截圖

## 解決方式

### 嘗試的方案

1. ❌ **使用 `foreignObjectRendering: true`** - 繞過 CSS 解析但造成位置偏移
2. ❌ **手動覆蓋 oklch 樣式** - 維護成本高，容易遺漏，治標不治本
3. ✅ **降級到 Tailwind v3** - 如果沒有特別需要 v4 功能，採用 v3 支持度高，大幅簡化問題

### 最終解決方案

降級到 Tailwind v4 to v3

### 為什麼有效

1. **Tailwind v3 使用傳統 RGB 顏色** - html2canvas 完全支援
2. **移除 oklch 相關問題** - 不需要任何 CSS 修復

## 參考資源

- [html2canvas GitHub Issue](https://github.com/niklasvh/html2canvas/issues)
- [Tailwind CSS v4 Color Functions](https://tailwindcss.com/docs/color-functions)
- [MDN: oklch() function](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch)

## 備註

- **未來考慮：** 當 html2canvas 支援 oklch 後可重新升級到 v4

### 重要概念說明

#### oklch 顏色函數

- **定義：** CSS Color Module Level 4 的新顏色表示法
- **優勢：**
  - 更準確的色彩表達，符合人眼視覺
  - 更好的色彩插值和漸變效果
  - 支援更廣的色域 (Wide Color Gamut)
- **語法：** `oklch(lightness chroma hue)`
- **問題：** html2canvas 內建的 CSS 解析器不支援現代顏色函數
- **影響範圍：** 所有 CSS Color Level 4 函數都受影響：`oklch()`, `oklab()`, `color()`

#### foreignObjectRendering

- **定義：** html2canvas 的渲染模式選項
- **原理：**
  - `false` (預設): 逐一解析 CSS 樣式，重新構建畫布
  - `true`: 使用 SVG foreignObject 包裝 DOM，直接渲染
- **優勢：** 繞過 CSS 解析問題，相容性更好
- **缺點：**
  - 可能造成元素位置偏移
  - 某些樣式效果可能失真
  - 依賴瀏覽器的 SVG 支援
- **適用情境：** 當遇到不支援的 CSS 函數時的權宜之計
