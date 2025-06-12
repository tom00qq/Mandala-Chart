import { useEffect, useState } from "react";
import { Card } from "@/components/Card/Card";
import type { CardData } from "@/components/GridContainer/GridContainer.types";
import CardModal from "@/components/CardModal/CardModal";
import Mask from "@/components/Mask/Mask";
import { useCardEditor } from "@/hooks/useCardEditor";
import { useDragDrop } from "@/hooks/useDragDrop";

// Grid cards configuration
const CENTER_CARD_INDEX = 4;
const CARD_COUNTS = 9;

// Cards default colors
const CARD_COLORS = {
  main: "#f04902",
  secondary: "#ffa15c",
  tertiary: "#ffcaa4",
};

// LocalStorage key
const STORAGE_KEY = "mandala-chart-3x3-cards";

// Default cards
const getInitialCards = (): CardData[] =>
  Array(CARD_COUNTS)
    .fill(null)
    .map((_, index) => ({
      id: `card-${index}`,
      title: index === CENTER_CARD_INDEX ? "核心目標" : `關聯目標`,
      content: `說明...`,
      bgColor:
        index === CENTER_CARD_INDEX
          ? CARD_COLORS.main
          : [1, 3, 5, 7].includes(index)
          ? CARD_COLORS.secondary
          : CARD_COLORS.tertiary,
    }));

// Load cards from localStorage
const loadCardsFromStorage = (): CardData[] => {
  const savedCards = localStorage.getItem(STORAGE_KEY);
  if (savedCards) {
    const parsedCards = JSON.parse(savedCards);
    if (parsedCards) {
      return parsedCards;
    }
  }

  return getInitialCards();
};

// Save cards to localStorage
const saveCardsToStorage = (cards: CardData[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};

export const GridView3x3 = () => {
  const [cards, setCards] = useState<CardData[]>(loadCardsFromStorage);
  const { editIndex, modalPosition, handleEdit, handleCancel, closeEditor } =
    useCardEditor();
  const { dragIndex, handleDragStart, resetDrag } = useDragDrop();

  useEffect(() => {
    saveCardsToStorage(cards);
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
        updatedCards.forEach((card) => {
          card.bgColor = updatedCard.bgColor;
        });
      }

      setCards(updatedCards);
      closeEditor();
    }
  };

  useEffect(() => {
    const handleReset = () => {
      const initialCards = getInitialCards();
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
          isDraggable={CENTER_CARD_INDEX === index ? false : true}
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
