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

const GRID_SIZE = {
  width: 2200,
  height: 2200,
};
const GRID_BOUNDARY = 100;

// Grid cards configuration
const SECTION_COUNTS = 9;
const CARD_COUNTS = 9;
//const CENTER_SECTION_INDEX = 4;
const CENTER_CARD_INDEX = 4;

// Default cards
const initialCards: CardData[] = Array(CARD_COUNTS)
  .fill(null)
  .map((_, index) => ({
    id: `9x9-card-${index}`,
    title: index === CENTER_CARD_INDEX ? "核心目標" : `關聯目標`,
    content: `說明...`,
    bgColor: "#fffff",
  }));

// Initial sections
const initialSections: GridSection[] = Array(SECTION_COUNTS)
  .fill(null)
  .map((_, sectionIndex) => {
    return {
      id: `section-${sectionIndex}`,
      sectionIndex,
      cards: initialCards,
    };
  });

interface GridView9x9Props {
  // TODO: 定義所需的 props
}

export const GridView9x9 = ({}: GridView9x9Props) => {
  const [sections, setSections] = useState<GridSection[]>(initialSections);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  // const [dragIndex, setDragIndex] = useState<number | null>(null); // TODO: 拖拽功能開發中
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  console.log("sections", setSections);

  const getOffset = (offset: Offset) => {
    setOffset(offset);
  };

  // TODO: 實作拖拽功能
  const handleDragStart = () => {
    console.log("TODO: 實作拖拽開始邏輯");
  };

  const handleDrop = () => {
    console.log("TODO: 實作放置邏輯");
  };

  // TODO: 實作編輯功能
  const handleEdit = (index: number) => {
    setEditIndex(index);
    console.log("TODO: 實作編輯邏輯", index);
  };

  // TODO: 實作儲存功能
  const handleSave = (updatedCard: CardData) => {
    console.log("TODO: 實作儲存邏輯", updatedCard);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  // 置中 Card Modal
  const centeredCardModal = (offset: Offset) => {
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

  useEffect(() => {
    const center = centeredCardModal(offset);
    setModalPosition(center);
  }, [editIndex, offset]);

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
