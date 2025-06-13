import { useEffect, useState } from "react";
import { Card } from "@/components/Card/Card";
import type {
  CardData,
  GridSection,
} from "@/components/GridContainer/GridContainer.types";
import CardModal from "@/components/CardModal/CardModal";
import Mask from "@/components/Mask/Mask";
import { useCardEditor } from "@/hooks/useCardEditor";
import { useDragDrop } from "@/hooks/useDragDrop";
import {
  loadSectionsFromStorage,
  saveSectionsToStorage,
  getInitialSections,
  syncRelatedCards,
  syncCenterToPeriphery,
  getGlobalIndex,
  getLocalIndices,
} from "@/utils/grid/gridUtils";

import OffsetContainer, {
  type Offset,
} from "@/components/OffsetContainer/OffsetContainer";

const GRID_CONFIG = {
  grid: {
    size: {
      width: 2200,
      height: 2200,
    },
    boundary: 100,
  },
  sections: {
    total: 9,
    centerIndex: 4,
  },
  cards: {
    total: 9,
    centerIndex: 4,
  },
  colors: {
    main: "#f04902",
    secondary: "#ffa15c",
    tertiary: "#ffcaa4",
  },
  storage: {
    key: "mandala-chart-9x9-sections",
  },
} as const;

export const GridView9x9 = () => {
  const [sections, setSections] = useState<GridSection[]>(() => {
    const savedSections = loadSectionsFromStorage(GRID_CONFIG.storage.key);
    return savedSections.length > 0
      ? savedSections
      : getInitialSections(
          GRID_CONFIG.sections.total,
          GRID_CONFIG.cards.total,
          GRID_CONFIG.sections.centerIndex,
          GRID_CONFIG.cards.centerIndex,
          GRID_CONFIG.colors
        );
  });
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

        const fromCard = fromSection.cards[fromIndices.cardIndex];
        const toCard = toSection.cards[toIndices.cardIndex];

        fromSection.cards[fromIndices.cardIndex] = toCard;
        toSection.cards[toIndices.cardIndex] = fromCard;

        newSections[fromIndices.sectionIndex] = fromSection;
        newSections[toIndices.sectionIndex] = toSection;
      }

      // 檢查是否需要同步：交換涉及中央 section 的非中心卡片或周邊 section 的中心卡片
      const needsSync =
        fromIndices.sectionIndex === GRID_CONFIG.sections.centerIndex ||
        toIndices.sectionIndex === GRID_CONFIG.sections.centerIndex;

      if (needsSync) {
        // 對交換後的兩個位置都執行同步
        let syncedSections = newSections;

        // 同步 from 位置
        if (fromIndices.sectionIndex === GRID_CONFIG.sections.centerIndex) {
          syncedSections = syncRelatedCards(
            syncedSections,
            fromIndices.sectionIndex,
            fromIndices.cardIndex,
            syncedSections[fromIndices.sectionIndex].cards[
              fromIndices.cardIndex
            ],
            GRID_CONFIG.sections.centerIndex,
            GRID_CONFIG.cards.centerIndex
          );
        }
        // 同步 to 位置
        if (toIndices.sectionIndex === GRID_CONFIG.sections.centerIndex) {
          syncedSections = syncRelatedCards(
            syncedSections,
            toIndices.sectionIndex,
            toIndices.cardIndex,
            syncedSections[toIndices.sectionIndex].cards[toIndices.cardIndex],
            GRID_CONFIG.sections.centerIndex,
            GRID_CONFIG.cards.centerIndex
          );
        }
        return syncedSections;
      }

      return newSections;
    });

    resetDrag();
  };

  const handleSave = (updatedCard: CardData, syncBgColor?: boolean) => {
    if (editIndex === null) return;

    const { sectionIndex, cardIndex } = getLocalIndices(editIndex);

    setSections((prev) => {
      const sectionsAfterUpdate = prev.map((section, idx) => {
        if (idx !== sectionIndex) return section;

        const updatedCards = section.cards.map((card, index) => {
          if (index === cardIndex) {
            return { ...card, ...updatedCard };
          }
          if (syncBgColor && index !== GRID_CONFIG.cards.centerIndex) {
            return { ...card, bgColor: updatedCard.bgColor };
          }
          return card;
        });

        return { ...section, cards: updatedCards };
      });

      return syncRelatedCards(
        sectionsAfterUpdate,
        sectionIndex,
        cardIndex,
        updatedCard,
        GRID_CONFIG.sections.centerIndex,
        GRID_CONFIG.cards.centerIndex
      );
    });

    closeEditor();
  };

  useEffect(() => {
    setSections((prev) => {
      return syncCenterToPeriphery(
        prev,
        GRID_CONFIG.sections.centerIndex,
        GRID_CONFIG.cards.centerIndex
      );
    });
  }, []);

  useEffect(() => {
    saveSectionsToStorage(sections, GRID_CONFIG.storage.key);
  }, [sections]);

  useEffect(() => {
    const handleReset = () => {
      const initialSections = getInitialSections(
        GRID_CONFIG.sections.total,
        GRID_CONFIG.cards.total,
        GRID_CONFIG.sections.centerIndex,
        GRID_CONFIG.cards.centerIndex,
        GRID_CONFIG.colors
      );
      const syncedSections = syncCenterToPeriphery(
        initialSections,
        GRID_CONFIG.sections.centerIndex,
        GRID_CONFIG.cards.centerIndex
      );
      setSections(syncedSections);
      closeEditor();
      resetDrag();
    };

    window.addEventListener("gridReset", handleReset);
    return () => window.removeEventListener("gridReset", handleReset);
  }, [closeEditor, resetDrag]);

  return (
    <OffsetContainer
      childrenSize={GRID_CONFIG.grid.size}
      onOffsetChange={getOffset}
    >
      <div
        id="screenShot_9x9"
        className="grid grid-cols-3 gap-6 mx-auto"
        style={{
          width: `${GRID_CONFIG.grid.size.width}px`,
          height: `${GRID_CONFIG.grid.size.height}px`,
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
                  isDraggable={
                    cardIndex === GRID_CONFIG.cards.centerIndex ? false : true
                  }
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
                top: `-${GRID_CONFIG.grid.boundary}px`,
                left: `-${GRID_CONFIG.grid.boundary}px`,
                bottom: `-${GRID_CONFIG.grid.boundary}px`,
                right: `-${GRID_CONFIG.grid.boundary}px`,
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
