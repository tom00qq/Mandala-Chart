import { useEffect, useState } from "react";
import { Card } from "@/components/Card/Card";
import CardModal from "@/components/CardModal/CardModal";
import type {
  CardData,
  GridSection,
} from "@/components/GridContainer/GridContainer.types";

import { getGlobalIndex, getLocalIndices } from "@/lib/gridview-utils";

import OffsetContainer, {
  type Offset,
} from "@/components/OffsetContainer/OffsetContainer";
import Mask from "../Mask/Mask";
import { useCardEditor } from "@/hooks/useCardEditor";
import { useDragDrop } from "@/hooks/useDragDrop";

const GRID_SIZE = {
  width: 2200,
  height: 2200,
};
const GRID_BOUNDARY = 100;

// Grid cards configuration
const SECTION_COUNTS = 9;
const CARD_COUNTS = 9;
const CENTER_SECTION_INDEX = 4;
const CENTER_CARD_INDEX = 4;
const STORAGE_KEY = "mandala-chart-9x9-sections";

// Cards default colors
const CARD_COLORS = {
  main: "#f04902",
  secondary: "#ffa15c",
  tertiary: "#ffcaa4",
};

// Get initial sections with default colors
const getInitialSections = (): GridSection[] =>
  Array(SECTION_COUNTS)
    .fill(null)
    .map((_, sectionIndex) => {
      const sectionCards = Array(CARD_COUNTS)
        .fill(null)
        .map((_, cardIndex) => ({
          id: `section-${sectionIndex}-card-${cardIndex}`,
          title:
            cardIndex === CENTER_CARD_INDEX
              ? "核心目標"
              : `關聯目標${cardIndex}`,
          content: `說明...`,
          bgColor:
            sectionIndex === CENTER_SECTION_INDEX
              ? cardIndex === CENTER_CARD_INDEX
                ? CARD_COLORS.main
                : [1, 3, 5, 7].includes(cardIndex)
                ? CARD_COLORS.secondary
                : CARD_COLORS.tertiary
              : "#ffffff",
        }));

      return {
        id: `section-${sectionIndex}`,
        sectionIndex,
        cards: sectionCards,
      };
    });

// Storage functions
const loadSectionsFromStorage = (): GridSection[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : getInitialSections();
  } catch {
    return getInitialSections();
  }
};

const saveSectionsToStorage = (sections: GridSection[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
};

export const GridView9x9 = () => {
  const [sections, setSections] = useState<GridSection[]>(
    loadSectionsFromStorage()
  );
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { editIndex, modalPosition, handleEdit, handleCancel, closeEditor } =
    useCardEditor({ offset });
  const { dragIndex, handleDragStart, resetDrag } = useDragDrop();

  const getOffset = (offset: Offset) => {
    setOffset(offset);
  };

  const handleDrop = (dropGlobalIndex: number) => {
    if (dragIndex === null || dragIndex === dropGlobalIndex) {
      resetDrag();
      return;
    }

    const fromIndices = getLocalIndices(dragIndex);
    const toIndices = getLocalIndices(dropGlobalIndex);

    setSections((prev) => {
      const newSections = [...prev];

      // 檢查是否在同一個區塊
      if (fromIndices.sectionIndex === toIndices.sectionIndex) {
        // 同區塊交換
        const section = { ...newSections[fromIndices.sectionIndex] };
        section.cards = [...section.cards];

        // 直接交換兩個位置的卡片
        [
          section.cards[fromIndices.cardIndex],
          section.cards[toIndices.cardIndex],
        ] = [
          section.cards[toIndices.cardIndex],
          section.cards[fromIndices.cardIndex],
        ];

        newSections[fromIndices.sectionIndex] = section;
      } else {
        // 跨區塊交換
        const fromSection = { ...newSections[fromIndices.sectionIndex] };
        const toSection = { ...newSections[toIndices.sectionIndex] };

        fromSection.cards = [...fromSection.cards];
        toSection.cards = [...toSection.cards];

        // 獲取要交換的兩張卡片
        const fromCard = fromSection.cards[fromIndices.cardIndex];
        const toCard = toSection.cards[toIndices.cardIndex];

        // 執行交換
        fromSection.cards[fromIndices.cardIndex] = toCard;
        toSection.cards[toIndices.cardIndex] = fromCard;

        // 更新 sections
        newSections[fromIndices.sectionIndex] = fromSection;
        newSections[toIndices.sectionIndex] = toSection;
      }

      // 檢查是否需要同步：交換涉及中央 section 的非中心卡片或周邊 section 的中心卡片
      // 注意：由於所有中心卡片都設為不可拖拽，實際上只有中央 section 的非中心卡片交換會觸發同步
      const needsSync =
        (fromIndices.sectionIndex === CENTER_SECTION_INDEX &&
          fromIndices.cardIndex !== CENTER_CARD_INDEX) ||
        (toIndices.sectionIndex === CENTER_SECTION_INDEX &&
          toIndices.cardIndex !== CENTER_CARD_INDEX) ||
        (fromIndices.sectionIndex !== CENTER_SECTION_INDEX &&
          fromIndices.cardIndex === CENTER_CARD_INDEX) ||
        (toIndices.sectionIndex !== CENTER_SECTION_INDEX &&
          toIndices.cardIndex === CENTER_CARD_INDEX);

      if (needsSync) {
        // 對交換後的兩個位置都執行同步
        let syncedSections = newSections;

        // 同步 from 位置
        if (
          fromIndices.sectionIndex === CENTER_SECTION_INDEX &&
          fromIndices.cardIndex !== CENTER_CARD_INDEX
        ) {
          syncedSections = syncRelatedCards(
            syncedSections,
            fromIndices.sectionIndex,
            fromIndices.cardIndex,
            syncedSections[fromIndices.sectionIndex].cards[
              fromIndices.cardIndex
            ]
          );
        } else if (
          fromIndices.sectionIndex !== CENTER_SECTION_INDEX &&
          fromIndices.cardIndex === CENTER_CARD_INDEX
        ) {
          syncedSections = syncRelatedCards(
            syncedSections,
            fromIndices.sectionIndex,
            fromIndices.cardIndex,
            syncedSections[fromIndices.sectionIndex].cards[
              fromIndices.cardIndex
            ]
          );
        }

        // 同步 to 位置
        if (
          toIndices.sectionIndex === CENTER_SECTION_INDEX &&
          toIndices.cardIndex !== CENTER_CARD_INDEX
        ) {
          syncedSections = syncRelatedCards(
            syncedSections,
            toIndices.sectionIndex,
            toIndices.cardIndex,
            syncedSections[toIndices.sectionIndex].cards[toIndices.cardIndex]
          );
        } else if (
          toIndices.sectionIndex !== CENTER_SECTION_INDEX &&
          toIndices.cardIndex === CENTER_CARD_INDEX
        ) {
          syncedSections = syncRelatedCards(
            syncedSections,
            toIndices.sectionIndex,
            toIndices.cardIndex,
            syncedSections[toIndices.sectionIndex].cards[toIndices.cardIndex]
          );
        }

        return syncedSections;
      }

      return newSections;
    });

    resetDrag();
  };

  // 中心區塊與周邊區塊的雙向同步邏輯
  const syncRelatedCards = (
    sections: GridSection[],
    sectionIndex: number,
    cardIndex: number,
    updatedCard: CardData
  ): GridSection[] => {
    const newSections = [...sections];

    // 同步內容但保留原有的 id
    const syncCardContent = (targetCard: CardData, sourceCard: CardData) => ({
      ...targetCard,
      title: sourceCard.title,
      content: sourceCard.content,
      bgColor: sourceCard.bgColor,
    });

    // 情況 1：編輯中心 section (4) 的非中心卡片，同步到對應周邊 section 的中心卡片
    if (
      sectionIndex === CENTER_SECTION_INDEX &&
      cardIndex !== CENTER_CARD_INDEX
    ) {
      const targetSectionIndex = cardIndex;
      const targetCardIndex = CENTER_CARD_INDEX;

      newSections[targetSectionIndex] = {
        ...newSections[targetSectionIndex],
        cards: newSections[targetSectionIndex].cards.map((card, idx) =>
          idx === targetCardIndex ? syncCardContent(card, updatedCard) : card
        ),
      };
    }

    // 情況 2：編輯周邊 section 的中心卡片，同步到中心 section 的對應卡片
    if (
      sectionIndex !== CENTER_SECTION_INDEX &&
      cardIndex === CENTER_CARD_INDEX
    ) {
      const targetSectionIndex = CENTER_SECTION_INDEX;
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

  const handleSave = (updatedCard: CardData, syncBgColor?: boolean) => {
    if (editIndex === null) return;

    const { sectionIndex, cardIndex } = getLocalIndices(editIndex);

    setSections((prev) => {
      // 先更新當前編輯的卡片
      const sectionsAfterUpdate = prev.map((section, idx) => {
        if (idx === sectionIndex) {
          const updatedCards = [...section.cards];
          updatedCards[cardIndex] = {
            ...updatedCards[cardIndex],
            ...updatedCard,
          };

          // 如果需要同步背景色
          if (syncBgColor) {
            updatedCards.forEach((card, index) => {
              if (index !== CENTER_CARD_INDEX) {
                card.bgColor = updatedCard.bgColor;
              }
            });
          }

          return { ...section, cards: updatedCards };
        }
        return section;
      });

      // 再執行雙向同步
      return syncRelatedCards(
        sectionsAfterUpdate,
        sectionIndex,
        cardIndex,
        updatedCard
      );
    });

    closeEditor();
  };

  // 中央 section 向四周同步功能
  const syncCenterToPeriphery = (sections: GridSection[]): GridSection[] => {
    const newSections = [...sections];
    const centerSection = newSections[CENTER_SECTION_INDEX];

    // 同步內容但保留原有的 id
    const syncCardContent = (targetCard: CardData, sourceCard: CardData) => ({
      ...targetCard,
      title: sourceCard.title,
      content: sourceCard.content,
      bgColor: sourceCard.bgColor,
    });

    // 將中央 section 的每張非中心卡片同步到對應周邊 section 的中心卡片
    centerSection.cards.forEach((centerCard, cardIndex) => {
      if (cardIndex !== CENTER_CARD_INDEX) {
        const targetSectionIndex = cardIndex;
        const targetCardIndex = CENTER_CARD_INDEX;

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

  useEffect(() => {
    setSections((prev) => {
      const synced = syncCenterToPeriphery(prev);
      return synced;
    });
  }, []);

  useEffect(() => {
    saveSectionsToStorage(sections);
  }, [sections]);

  useEffect(() => {
    const handleReset = () => {
      const initialSections = getInitialSections();
      const syncedSections = syncCenterToPeriphery(initialSections);
      setSections(syncedSections);
      closeEditor();
      resetDrag();
    };

    window.addEventListener("gridReset", handleReset);
    return () => window.removeEventListener("gridReset", handleReset);
  }, [closeEditor, resetDrag]);

  return (
    <OffsetContainer childrenSize={GRID_SIZE} onOffsetChange={getOffset}>
      <div
        id="screenShot_9x9"
        className="grid grid-cols-3 gap-6 mx-auto"
        style={{
          width: `${GRID_SIZE.width}px`,
          height: `${GRID_SIZE.height}px`,
        }}
      >
        {sections.map((section) => (
          <div key={section.id} className=" grid grid-cols-3 gap-2 p-4">
            {section.cards.map((card, cardIndex) => {
              const globalIndex = getGlobalIndex(
                section.sectionIndex,
                cardIndex
              );

              return (
                <Card
                  key={card.id}
                  card={card}
                  index={globalIndex}
                  isEditable={true}
                  isDraggable={cardIndex === CENTER_CARD_INDEX ? false : true}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  onEdit={handleEdit}
                />
              );
            })}
          </div>
        ))}

        {editIndex !== null && (
          <>
            <Mask
              position={{
                top: `-${GRID_BOUNDARY}px`,
                left: `-${GRID_BOUNDARY}px`,
                bottom: `-${GRID_BOUNDARY}px`,
                right: `-${GRID_BOUNDARY}px`,
              }}
            />
            <div
              className="absolute z-50"
              style={{
                left: `${modalPosition.x}px`,
                top: `${modalPosition.y}px`,
              }}
            >
              <CardModal
                card={
                  sections[getLocalIndices(editIndex).sectionIndex].cards[
                    getLocalIndices(editIndex).cardIndex
                  ]
                }
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </div>
          </>
        )}
      </div>
    </OffsetContainer>
  );
};
