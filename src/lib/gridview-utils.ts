// 共用的網格工具函數

import type { Offset } from "@/components/OffsetContainer/OffsetContainer";

/**
 * 將區塊索引和卡片索引轉換為全域索引
 * @param sectionIndex 區塊索引 (0-8)
 * @param cardIndex 卡片索引 (0-8)
 * @returns 全域索引 (0-80)
 */
export const getGlobalIndex = (
  sectionIndex: number,
  cardIndex: number
): number => {
  const sectionRow = Math.floor(sectionIndex / 3);
  const sectionCol = sectionIndex % 3;
  const cardRow = Math.floor(cardIndex / 3);
  const cardCol = cardIndex % 3;

  const globalRow = sectionRow * 3 + cardRow;
  const globalCol = sectionCol * 3 + cardCol;

  return globalRow * 9 + globalCol;
};

/**
 * 從全域索引獲取區塊和卡片索引
 * @param globalIndex 全域索引 (0-80)
 * @returns 區塊索引和卡片索引
 */
export const getLocalIndices = (
  globalIndex: number
): { sectionIndex: number; cardIndex: number } => {
  const globalRow = Math.floor(globalIndex / 9);
  const globalCol = globalIndex % 9;

  const sectionRow = Math.floor(globalRow / 3);
  const sectionCol = Math.floor(globalCol / 3);
  const sectionIndex = sectionRow * 3 + sectionCol;

  const cardRow = globalRow % 3;
  const cardCol = globalCol % 3;
  const cardIndex = cardRow * 3 + cardCol;

  return { sectionIndex, cardIndex };
};

/**
 * 檢查是否為中央區塊
 * @param sectionIndex 區塊索引
 * @returns 是否為中央區塊
 */
export const isCenterSection = (sectionIndex: number): boolean => {
  return sectionIndex === 4;
};

/**
 * 檢查是否為區塊內的中央卡片
 * @param cardIndex 卡片索引
 * @returns 是否為中央卡片
 */
export const isCenterCard = (cardIndex: number): boolean => {
  return cardIndex === 4;
};

/**
 * 置中 Card Modal
 * @param offset 背景的偏移量
 * @returns 卡片偏移位置
 */
export const centeredCardModal = (offset: Offset) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 假設 modal 的尺寸（可以根據實際需求調整）
  const modalWidth = 520; // modal 寬度
  const modalHeight = 576; // modal 高度

  // 計算視窗中心點
  const viewportCenterX = viewportWidth / 2;
  const viewportCenterY = viewportHeight / 2;

  // 考慮 Canvas 偏移後的實際中心位置
  // 由於 Canvas 有偏移，我們需要計算在當前可視區域的真正中心
  const actualCenterX = viewportCenterX - (offset?.x || 0);
  const actualCenterY = viewportCenterY - (offset?.y || 0);

  // 計算 modal 左上角應該在的位置（讓 modal 中心對齊實際中心）
  const modalX = actualCenterX - modalWidth / 2;
  const modalY = actualCenterY - modalHeight / 2;

  return { x: modalX, y: modalY };
};
