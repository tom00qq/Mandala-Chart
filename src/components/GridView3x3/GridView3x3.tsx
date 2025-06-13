import { useEffect, useState } from "react";
import { Card } from "@/components/Card/Card";
import type { CardData } from "@/components/GridContainer/GridContainer.types";
import CardModal from "@/components/CardModal/CardModal";
import Mask from "@/components/Mask/Mask";
import { useCardEditor } from "@/hooks/useCardEditor";
import { useDragDrop } from "@/hooks/useDragDrop";
import {
  loadCardsFromStorage,
  saveCardsToStorage,
  getInitialCards,
} from "@/utils/grid/gridUtils";

const GRID_CONFIG = {
  cards: {
    centerIndex: 4,
    total: 9,
  },
  colors: {
    main: "#f04902",
    secondary: "#ffa15c",
    tertiary: "#ffcaa4",
  },
  storage: {
    key: "mandala-chart-3x3-cards",
  },
} as const;

export const GridView3x3 = () => {
  const [cards, setCards] = useState<CardData[]>(() => {
    const savedCards = loadCardsFromStorage(GRID_CONFIG.storage.key);
    return savedCards.length > 0
      ? savedCards
      : getInitialCards(
          GRID_CONFIG.cards.total,
          GRID_CONFIG.cards.centerIndex,
          GRID_CONFIG.colors
        );
  });
  const { editIndex, modalPosition, handleEdit, handleCancel, closeEditor } =
    useCardEditor();
  const { dragIndex, handleDragStart, resetDrag } = useDragDrop();

  useEffect(() => {
    saveCardsToStorage(cards, GRID_CONFIG.storage.key);
  }, [cards]);

  const handleDrop = (dropIndex: number) => {
    if (dragIndex !== null && dragIndex !== dropIndex) {
      const updatedCard = [...cards];

      [updatedCard[dragIndex], updatedCard[dropIndex]] = [
        updatedCard[dropIndex],
        updatedCard[dragIndex],
      ];

      setCards(updatedCard);
    }
    resetDrag();
  };

  const handleSave = (updatedCard: CardData, syncBgColor: boolean) => {
    if (editIndex !== null) {
      const updatedCards = [...cards];

      updatedCards[editIndex] = {
        ...updatedCards[editIndex],
        ...updatedCard,
      };

      if (syncBgColor) {
        updatedCards.forEach((card, index) => {
          if (index !== GRID_CONFIG.cards.centerIndex) {
            card.bgColor = updatedCard.bgColor;
          }
        });
      }

      setCards(updatedCards);
      closeEditor();
    }
  };

  useEffect(() => {
    const handleReset = () => {
      const initialCards = getInitialCards(
        GRID_CONFIG.cards.total,
        GRID_CONFIG.cards.centerIndex,
        GRID_CONFIG.colors
      );
      setCards(initialCards);
      closeEditor();
    };

    window.addEventListener("gridReset", handleReset);
    return () => window.removeEventListener("gridReset", handleReset);
  }, [closeEditor]);

  return (
    <div
      id="screenShot_3x3"
      className="grid grid-cols-3 gap-2.5 p-2.5 w-[95vw] h-[95vw] max-w-[95vh] max-h-[95vh] mx-auto"
    >
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          index={index}
          isEditable={true}
          isDraggable={GRID_CONFIG.cards.centerIndex === index ? false : true}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onEdit={handleEdit}
        />
      ))}

      {editIndex !== null && (
        <>
          <Mask />
          <div
            className="absolute z-50"
            style={{
              left: `${modalPosition.x}px`,
              top: `${modalPosition.y}px`,
            }}
          >
            <CardModal
              card={cards[editIndex]}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </>
      )}
    </div>
  );
};
