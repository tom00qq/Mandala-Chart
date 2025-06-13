import type {
  CardData,
  GridSection,
} from "@/components/GridContainer/GridContainer.types";

/**
 * 從 localStorage 載入卡片數據
 * @param storageKey 儲存鍵值
 * @returns 卡片數據數組
 */
export const loadCardsFromStorage = (storageKey: string): CardData[] => {
  const savedCards = localStorage.getItem(storageKey);
  if (savedCards) {
    const parsedCards = JSON.parse(savedCards);
    if (parsedCards) {
      return parsedCards;
    }
  }
  return [];
};

/**
 * 將卡片數據保存到 localStorage
 * @param cards 卡片數據數組
 * @param storageKey 儲存鍵值
 */
export const saveCardsToStorage = (cards: CardData[], storageKey: string) => {
  localStorage.setItem(storageKey, JSON.stringify(cards));
};

/**
 * 從 localStorage 載入區塊數據
 * @param storageKey 儲存鍵值
 * @returns 區塊數據數組
 */
export const loadSectionsFromStorage = (storageKey: string): GridSection[] => {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/**
 * 將區塊數據保存到 localStorage
 * @param sections 區塊數據數組
 * @param storageKey 儲存鍵值
 */
export const saveSectionsToStorage = (
  sections: GridSection[],
  storageKey: string
) => {
  localStorage.setItem(storageKey, JSON.stringify(sections));
};

/**
 * 創建初始卡片數據
 * @param total 卡片總數
 * @param centerIndex 中心卡片索引
 * @param colors 顏色配置
 * @returns 卡片數據數組
 */
export const getInitialCards = (
  total: number,
  centerIndex: number,
  colors: { main: string; secondary: string; tertiary: string }
): CardData[] =>
  Array(total)
    .fill(null)
    .map((_, index) => ({
      id: `card-${index}`,
      title: index === centerIndex ? "核心目標" : `關聯目標`,
      content: `說明...`,
      bgColor:
        index === centerIndex
          ? colors.main
          : [1, 3, 5, 7].includes(index)
          ? colors.secondary
          : colors.tertiary,
    }));

/**
 * 創建初始區塊數據
 * @param sectionTotal 區塊總數
 * @param cardTotal 每個區塊的卡片總數
 * @param centerSectionIndex 中心區塊索引
 * @param centerCardIndex 中心卡片索引
 * @param colors 顏色配置
 * @returns 區塊數據數組
 */
export const getInitialSections = (
  sectionTotal: number,
  cardTotal: number,
  centerSectionIndex: number,
  centerCardIndex: number,
  colors: { main: string; secondary: string; tertiary: string }
): GridSection[] =>
  Array(sectionTotal)
    .fill(null)
    .map((_, sectionIndex) => {
      const sectionCards = Array(cardTotal)
        .fill(null)
        .map((_, cardIndex) => ({
          id: `section-${sectionIndex}-card-${cardIndex}`,
          title:
            cardIndex === centerCardIndex ? "核心目標" : `關聯目標${cardIndex}`,
          content: `說明...`,
          bgColor:
            sectionIndex === centerSectionIndex
              ? cardIndex === centerCardIndex
                ? colors.main
                : [1, 3, 5, 7].includes(cardIndex)
                ? colors.secondary
                : colors.tertiary
              : "#ffffff",
        }));

      return {
        id: `section-${sectionIndex}`,
        sectionIndex,
        cards: sectionCards,
      };
    });

/**
 * 同步卡片內容
 * @param targetCard 目標卡片
 * @param sourceCard 源卡片
 * @returns 同步後的卡片
 */
export const syncCardContent = (
  targetCard: CardData,
  sourceCard: CardData
) => ({
  ...targetCard,
  title: sourceCard.title,
  content: sourceCard.content,
  bgColor: sourceCard.bgColor,
});

/**
 * 同步相關卡片
 * @param sections 區塊數據數組
 * @param sectionIndex 當前區塊索引
 * @param cardIndex 當前卡片索引
 * @param updatedCard 更新後的卡片
 * @param centerSectionIndex 中心區塊索引
 * @param centerCardIndex 中心卡片索引
 * @returns 同步後的區塊數據數組
 */
export const syncRelatedCards = (
  sections: GridSection[],
  sectionIndex: number,
  cardIndex: number,
  updatedCard: CardData,
  centerSectionIndex: number,
  centerCardIndex: number
): GridSection[] => {
  const newSections = [...sections];

  // 情況 1：編輯中心 section 的非中心卡片，同步到對應周邊 section 的中心卡片
  if (sectionIndex === centerSectionIndex && cardIndex !== centerCardIndex) {
    const targetSectionIndex = cardIndex;
    const targetCardIndex = centerCardIndex;

    newSections[targetSectionIndex] = {
      ...newSections[targetSectionIndex],
      cards: newSections[targetSectionIndex].cards.map((card, idx) =>
        idx === targetCardIndex ? syncCardContent(card, updatedCard) : card
      ),
    };
  }

  // 情況 2：編輯周邊 section 的中心卡片，同步到中心 section 的對應卡片
  if (sectionIndex !== centerSectionIndex && cardIndex === centerCardIndex) {
    const targetSectionIndex = centerSectionIndex;
    const targetCardIndex = sectionIndex;

    newSections[targetSectionIndex] = {
      ...newSections[targetSectionIndex],
      cards: newSections[targetSectionIndex].cards.map((card, idx) =>
        idx === targetCardIndex ? syncCardContent(card, updatedCard) : card
      ),
    };
  }

  return newSections;
};

/**
 * 將中心區塊同步到周邊區塊
 * @param sections 區塊數據數組
 * @param centerSectionIndex 中心區塊索引
 * @param centerCardIndex 中心卡片索引
 * @returns 同步後的區塊數據數組
 */
export const syncCenterToPeriphery = (
  sections: GridSection[],
  centerSectionIndex: number,
  centerCardIndex: number
): GridSection[] => {
  const newSections = [...sections];
  const centerSection = newSections[centerSectionIndex];

  // 將中央 section 的每張非中心卡片同步到對應周邊 section 的中心卡片
  centerSection.cards.forEach((centerCard, cardIndex) => {
    if (cardIndex !== centerCardIndex) {
      const targetSectionIndex = cardIndex;
      const targetCardIndex = centerCardIndex;

      newSections[targetSectionIndex] = {
        ...newSections[targetSectionIndex],
        cards: newSections[targetSectionIndex].cards.map((card, idx) =>
          idx === targetCardIndex ? syncCardContent(card, centerCard) : card
        ),
      };
    }
  });

  return newSections;
};

/**
 * 將區塊索引和卡片索引轉換為全局索引
 * @param sectionIndex 區塊索引
 * @param cardIndex 卡片索引
 * @returns 全局索引
 */
export const getGlobalIndex = (
  sectionIndex: number,
  cardIndex: number
): number => {
  return sectionIndex * 9 + cardIndex;
};

/**
 * 將全局索引轉換為區塊索引和卡片索引
 * @param globalIndex 全局索引
 * @returns 包含區塊索引和卡片索引的對象
 */
export const getLocalIndices = (
  globalIndex: number
): { sectionIndex: number; cardIndex: number } => {
  const sectionIndex = Math.floor(globalIndex / 9);
  const cardIndex = globalIndex % 9;
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
export const centeredCardModal = (offset: { x: number; y: number }) => {
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
