import { useState } from "react";

export const useDragDrop = () => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const resetDrag = () => {
    setDragIndex(null);
  };

  const isDragging = (index: number) => {
    return dragIndex === index;
  };

  return {
    dragIndex,
    handleDragStart,
    resetDrag,
    isDragging,
    hasDragIndex: dragIndex !== null,
  };
};
