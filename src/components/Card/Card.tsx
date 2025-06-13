import React from "react";
import type { CardData } from "@/components/GridContainer/GridContainer.types";
import Editor from "@/components/Editor/Editor";

export interface CardProps {
  card: CardData;
  index: number;
  isEditable: boolean;
  isDraggable: boolean;
  onDragStart: (index: number) => void;
  onDrop: (index: number) => void;
  onEdit: (index: number) => void;
}

export const Card: React.FC<CardProps> = ({
  card,
  index,
  isEditable,
  isDraggable,
  onDragStart,
  onDrop,
  onEdit,
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDraggable) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", index.toString());
    onDragStart(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isDraggable) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    onDrop(index);
  };

  const handleDoubleClick = () => {
    if (isEditable) {
      onEdit(index);
    }
  };

  return (
    <div
      draggable={isDraggable}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDoubleClick={handleDoubleClick}
      className="p-4 bg-white border-2 border-gray-100 rounded-lg shadow-md flex flex-col cursor-move hover:shadow-lg transition-shadow overflow-hidden aspect-square"
      style={{ backgroundColor: card.bgColor || "#ffffff" }}
    >
      <h3 className="text-lg font-semibold" data-t={card.content}>
        {card.title}
      </h3>

      <div className="flex-1 overflow-hidden mt-1">
        <div
          className="h-full overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full"
          style={
            {
              "--scrollbar-bg": card.bgColor || "#ffffff",
              "--scrollbar-thumb": card.bgColor
                ? `${card.bgColor}99`
                : "#e5e7eb",
            } as React.CSSProperties
          }
        >
          <Editor content={card.content} viewOnly={true} />
        </div>
      </div>
    </div>
  );
};
